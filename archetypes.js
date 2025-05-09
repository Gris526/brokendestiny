function renderArchetypeSlots() {
  const archetypeSlotsContainer = document.getElementById('archetype-slots');
  archetypeSlotsContainer.innerHTML = '';
  const defaultSlot = document.createElement('div');
  defaultSlot.className = 'race-slot';
  defaultSlot.innerHTML = `
    <select class="archetype-dropdown">
      ${Object.keys(archetypeModifiers).map(archetype => `
        <option value="${archetype}">${archetype}</option>
      `).join('')}
    </select>
    <input type="number" class="archetype-level" value="1" min="1" max="100">
    <button class="remove-race"><i class="fas fa-times"></i></button>
  `;
  archetypeSlotsContainer.appendChild(defaultSlot);
  addArchetypeSlotListeners(defaultSlot);
}

function addArchetypeSlot() {
  const archetypeSlotsContainer = document.getElementById('archetype-slots');
  const newSlot = document.createElement('div');
  newSlot.className = 'race-slot';
  newSlot.innerHTML = `
    <select class="archetype-dropdown">
      ${Object.keys(archetypeModifiers).map(archetype => `
        <option value="${archetype}">${archetype}</option>
      `).join('')}
    </select>
    <input type="number" class="archetype-level" value="1" min="1" max="100">
    <button class="remove-race"><i class="fas fa-times"></i></button>
  `;
  archetypeSlotsContainer.appendChild(newSlot);
  addArchetypeSlotListeners(newSlot);
  updateArchetypeDisplay();
}

function addArchetypeSlotListeners(slot) {
  const dropdown = slot.querySelector('.archetype-dropdown');
  const levelInput = slot.querySelector('.archetype-level');
  const removeBtn = slot.querySelector('.remove-race');
  
  dropdown.addEventListener('change', updateArchetypeDisplay);
  levelInput.addEventListener('change', updateArchetypeDisplay);
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      slot.remove();
      updateArchetypeDisplay();
    });
  }
}

function updateArchetypeDisplay() {
  const subclassContainer = document.getElementById('subclass-selection');
  const archetypeBenefitsContainer = document.getElementById('archetype-benefits');
  const archetypeModifierList = document.getElementById('archetype-modifier-list');
  
  subclassContainer.innerHTML = '';
  archetypeBenefitsContainer.innerHTML = '';
  archetypeModifierList.innerHTML = '';
  
  const activeModifiers = {};
  const archetypeSlots = document.querySelectorAll('.archetype-dropdown');
  
  archetypeSlots.forEach(dropdown => {
    const slot = dropdown.closest('.race-slot');
    const archetype = dropdown.value;
    const level = parseInt(slot.querySelector('.archetype-level')?.value) || 1;
    
    if (!archetype || !archetypeModifiers[archetype]) return;
    
    const archetypeData = archetypeModifiers[archetype];
    
    // Add base modifiers
    Object.entries(archetypeData.base || {}).forEach(([stat, value]) => {
      activeModifiers[stat] = (activeModifiers[stat] || 0) + value;
      
      const li = document.createElement('li');
      li.className = 'modifier-item';
      li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">Base</span></span>`;
      archetypeModifierList.appendChild(li);
    });
    
    // Add level benefits
    const applicableLevel = getApplicableLevel(archetypeData.levelBenefits, level);
    if (applicableLevel && archetypeData.levelBenefits[applicableLevel]) {
      Object.entries(archetypeData.levelBenefits[applicableLevel]).forEach(([stat, value]) => {
        activeModifiers[stat] = (activeModifiers[stat] || 0) + value;
        
        const li = document.createElement('li');
        li.className = 'modifier-item';
        li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">Level ${applicableLevel}</span></span>`;
        archetypeModifierList.appendChild(li);
      });
      
      const benefitsDiv = document.createElement('div');
      benefitsDiv.className = 'extra-section';
      benefitsDiv.innerHTML = `
        <div class="section-title">${archetype} Level ${applicableLevel} Benefits</div>
        <ul>
          ${Object.entries(archetypeData.levelBenefits[applicableLevel]).map(([stat, value]) => `
            <li>${stat}: ${value > 0 ? '+' : ''}${value}</li>
          `).join('')}
        </ul>
      `;
      archetypeBenefitsContainer.appendChild(benefitsDiv);
    }
    
    // Add subclass selection
    if (Object.keys(archetypeData.subclasses || {}).length > 0) {
      const subclassDiv = document.createElement('div');
      subclassDiv.className = 'extra-section';
      subclassDiv.innerHTML = `
        <div class="section-title">${archetype} Subclass</div>
        <select class="subclass-select" data-archetype="${archetype}">
          <option value="">None</option>
          ${Object.keys(archetypeData.subclasses).map(subclass => `
            <option value="${subclass}">${subclass}</option>
          `).join('')}
        </select>
      `;
      subclassContainer.appendChild(subclassDiv);
      
      // Set up subclass change listener
      const subclassSelect = subclassDiv.querySelector('.subclass-select');
      subclassSelect.addEventListener('change', () => {
        updateArchetypeDisplay();
      });
      
      // Add subclass benefits if selected
      const selectedSubclass = subclassSelect.value;
      if (selectedSubclass && archetypeData.subclasses[selectedSubclass]) {
        const subclassData = archetypeData.subclasses[selectedSubclass];
        
        // Add base subclass modifiers
        Object.entries(subclassData.base || {}).forEach(([stat, value]) => {
          activeModifiers[stat] = (activeModifiers[stat] || 0) + value;
          
          const li = document.createElement('li');
          li.className = 'modifier-item';
          li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">${selectedSubclass}</span></span>`;
          archetypeModifierList.appendChild(li);
        });
        
        // Add subclass level benefits
        const subclassApplicableLevel = getApplicableLevel(subclassData.levelBenefits, level);
        if (subclassApplicableLevel && subclassData.levelBenefits[subclassApplicableLevel]) {
          Object.entries(subclassData.levelBenefits[subclassApplicableLevel]).forEach(([stat, value]) => {
            activeModifiers[stat] = (activeModifiers[stat] || 0) + value;
            
            const li = document.createElement('li');
            li.className = 'modifier-item';
            li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">${selectedSubclass} Level ${subclassApplicableLevel}</span></span>`;
            archetypeModifierList.appendChild(li);
          });
          
          const subclassBenefitsDiv = document.createElement('div');
          subclassBenefitsDiv.className = 'extra-section';
          subclassBenefitsDiv.innerHTML = `
            <div class="section-title">${selectedSubclass} Level ${subclassApplicableLevel} Benefits</div>
            <ul>
              ${Object.entries(subclassData.levelBenefits[subclassApplicableLevel]).map(([stat, value]) => `
                <li>${stat}: ${value > 0 ? '+' : ''}${value}</li>
              `).join('')}
            </ul>
          `;
          archetypeBenefitsContainer.appendChild(subclassBenefitsDiv);
        }
      }
    }
  });
  
  // Update stats display to include archetype modifiers
  updateStatsDisplay();
}

function getApplicableLevel(levelBenefits, currentLevel) {
  if (!levelBenefits) return null;
  const levels = Object.keys(levelBenefits).map(Number).sort((a,b) => a-b);
  let applicableLevel = null;
  
  for (const level of levels) {
    if (level <= currentLevel) {
      applicableLevel = level;
    } else {
      break;
    }
  }
  
  return applicableLevel;
}

function openArchetypeEditor() {
  const firstArchetypeDropdown = document.querySelector('.archetype-dropdown');
  currentEditingArchetype = firstArchetypeDropdown?.value || null;
  
  document.getElementById('new-archetype-name').value = currentEditingArchetype || '';
  document.getElementById('archetype-editor-modifier-list').innerHTML = '';
  document.getElementById('subclass-modifiers-container').innerHTML = '';
  document.getElementById('level-benefits-container').innerHTML = '';
  
  if (currentEditingArchetype && archetypeModifiers[currentEditingArchetype]) {
    const archetypeData = archetypeModifiers[currentEditingArchetype];
    
    // Load base modifiers
    Object.entries(archetypeData.base || {}).forEach(([stat, value]) => {
      addModifierToEditor(stat, value, document.getElementById('archetype-editor-modifier-list'));
    });
    
    // Load subclasses
    Object.entries(archetypeData.subclasses || {}).forEach(([subclassName, subclassData]) => {
      addSubclassToEditor(subclassName, subclassData);
    });
    
    // Load level benefits
    Object.entries(archetypeData.levelBenefits || {}).forEach(([level, benefits]) => {
      addLevelSectionToEditor(level, benefits);
    });
  }
  
  document.getElementById('archetype-editor-modal').style.display = 'block';
}

function addSubclass() {
  const subclassName = document.getElementById('new-subclass-name').value.trim();
  if (!subclassName) return;
  
  if (!archetypeModifiers[currentEditingArchetype]) {
    archetypeModifiers[currentEditingArchetype] = { subclasses: {} };
  }
  
  if (!archetypeModifiers[currentEditingArchetype].subclasses) {
    archetypeModifiers[currentEditingArchetype].subclasses = {};
  }
  
  if (!archetypeModifiers[currentEditingArchetype].subclasses[subclassName]) {
    archetypeModifiers[currentEditingArchetype].subclasses[subclassName] = {
      base: {},
      levelBenefits: {}
    };
  }
  
  addSubclassToEditor(subclassName, archetypeModifiers[currentEditingArchetype].subclasses[subclassName]);
  document.getElementById('new-subclass-name').value = '';
}

function addSubclassToEditor(subclassName, subclassData) {
  const subclassDiv = document.createElement('div');
  subclassDiv.className = 'editor-extra-section';
  subclassDiv.innerHTML = `
    <div class="section-header">
      <div class="section-title">${subclassName}</div>
      <button class="remove-section-btn" data-subclass="${subclassName}">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="section-options-container" data-subclass="${subclassName}">
      <div class="modifier-input">
        <select class="stat-select">
          <option value="strength">Strength</option>
          <option value="speed">Speed</option>
          <option value="resistance">Resistance</option>
          <option value="intelligence">Intelligence</option>
          <option value="charisma">Charisma</option>
          <option value="maestry">Maestry</option>
          <option value="perception">Perception</option>
          <option value="will">Will</option>
          <option value="bravery">Bravery</option>
          <option value="mana">Mana</option>
          <option value="luck">Luck</option>
          <option value="stealth">Stealth</option>
          <option value="size">Size</option>
        </select>
        <input type="number" class="modifier-value" placeholder="+2">
        <button class="add-subclass-modifier" data-subclass="${subclassName}">
          <i class="fas fa-plus"></i> Add Modifier
        </button>
      </div>
      <ul class="subclass-modifier-list" data-subclass="${subclassName}">
        ${Object.entries(subclassData.base || {}).map(([stat, value]) => `
          <li class="modifier-item">
            <span>${stat}: ${value}</span>
            <button class="remove-modifier-btn" data-stat="${stat}">
              <i class="fas fa-times"></i>
            </button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  document.getElementById('subclass-modifiers-container').appendChild(subclassDiv);
  
  // Add modifier button listener
  subclassDiv.querySelector('.add-subclass-modifier').addEventListener('click', (e) => {
    const subclass = e.target.closest('button').dataset.subclass;
    const stat = subclassDiv.querySelector('.stat-select').value;
    const value = parseInt(subclassDiv.querySelector('.modifier-value').value);
    
    if (!isNaN(value)) {
      archetypeModifiers[currentEditingArchetype].subclasses[subclass].base[stat] = value;
      const list = subclassDiv.querySelector('.subclass-modifier-list');
      const li = document.createElement('li');
      li.className = 'modifier-item';
      li.innerHTML = `
        <span>${stat}: ${value}</span>
        <button class="remove-modifier-btn" data-stat="${stat}">
          <i class="fas fa-times"></i>
        </button>
      `;
      list.appendChild(li);
      
      // Add remove listener
      li.querySelector('.remove-modifier-btn').addEventListener('click', (e) => {
        const stat = e.target.closest('button').dataset.stat;
        delete archetypeModifiers[currentEditingArchetype].subclasses[subclass].base[stat];
        li.remove();
      });
      
      subclassDiv.querySelector('.modifier-value').value = '';
    }
  });
  
  // Add remove listener for subclass
  subclassDiv.querySelector('.remove-section-btn').addEventListener('click', (e) => {
    const subclass = e.target.closest('button').dataset.subclass;
    delete archetypeModifiers[currentEditingArchetype].subclasses[subclass];
    subclassDiv.remove();
  });
}

function addLevelSection() {
  const level = document.getElementById('level-select').value;
  if (!level) return;
  
  if (!archetypeModifiers[currentEditingArchetype]) {
    archetypeModifiers[currentEditingArchetype] = { levelBenefits: {} };
  }
  
  if (!archetypeModifiers[currentEditingArchetype].levelBenefits) {
    archetypeModifiers[currentEditingArchetype].levelBenefits = {};
  }
  
  if (!archetypeModifiers[currentEditingArchetype].levelBenefits[level]) {
    archetypeModifiers[currentEditingArchetype].levelBenefits[level] = {};
  }
  
  addLevelSectionToEditor(level, archetypeModifiers[currentEditingArchetype].levelBenefits[level]);
}

function addLevelSectionToEditor(level, benefits) {
  const levelDiv = document.createElement('div');
  levelDiv.className = 'editor-extra-section';
  levelDiv.innerHTML = `
    <div class="section-header">
      <div class="section-title">Level ${level} Benefits</div>
      <button class="remove-section-btn" data-level="${level}">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modifier-input">
      <select class="stat-select">
        <option value="strength">Strength</option>
        <option value="speed">Speed</option>
        <option value="resistance">Resistance</option>
        <option value="intelligence">Intelligence</option>
        <option value="charisma">Charisma</option>
        <option value="maestry">Maestry</option>
        <option value="perception">Perception</option>
        <option value="will">Will</option>
        <option value="bravery">Bravery</option>
        <option value="mana">Mana</option>
        <option value="luck">Luck</option>
        <option value="stealth">Stealth</option>
        <option value="size">Size</option>
      </select>
      <input type="number" class="modifier-value" placeholder="+2">
      <button class="add-modifier" data-level="${level}">
        <i class="fas fa-plus"></i> Add
      </button>
    </div>
    <ul class="level-benefits-list" data-level="${level}">
      ${Object.entries(benefits).map(([stat, value]) => `
        <li class="modifier-item">
          <span>${stat}: ${value}</span>
          <button class="remove-modifier-btn" data-stat="${stat}">
            <i class="fas fa-times"></i>
          </button>
        </li>
      `).join('')}
    </ul>
  `;
  document.getElementById('level-benefits-container').appendChild(levelDiv);
  
  // Add modifier listener
  levelDiv.querySelector('.add-modifier').addEventListener('click', (e) => {
    const level = e.target.closest('button').dataset.level;
    const stat = levelDiv.querySelector('.stat-select').value;
    const value = parseInt(levelDiv.querySelector('.modifier-value').value);
    
    if (!isNaN(value)) {
      archetypeModifiers[currentEditingArchetype].levelBenefits[level][stat] = value;
      const list = levelDiv.querySelector('.level-benefits-list');
      const li = document.createElement('li');
      li.className = 'modifier-item';
      li.innerHTML = `
        <span>${stat}: ${value}</span>
        <button class="remove-modifier-btn" data-stat="${stat}">
          <i class="fas fa-times"></i>
        </button>
      `;
      list.appendChild(li);
      
      // Add remove listener
      li.querySelector('.remove-modifier-btn').addEventListener('click', (e) => {
        const stat = e.target.closest('button').dataset.stat;
        delete archetypeModifiers[currentEditingArchetype].levelBenefits[level][stat];
        li.remove();
      });
      
      levelDiv.querySelector('.modifier-value').value = '';
    }
  });
  
  // Add remove listener
  levelDiv.querySelector('.remove-section-btn').addEventListener('click', (e) => {
    const level = e.target.closest('button').dataset.level;
    delete archetypeModifiers[currentEditingArchetype].levelBenefits[level];
    levelDiv.remove();
  });
}

function saveArchetype() {
  const name = document.getElementById('new-archetype-name').value.trim();
  if (!name) return;
  
  // Get base modifiers
  const baseModifiers = {};
  document.getElementById('archetype-editor-modifier-list').querySelectorAll('li').forEach(item => {
    const [stat, value] = item.textContent.split(': ');
    baseModifiers[stat] = parseInt(value);
  });
  
  // Create/update archetype
  archetypeModifiers[name] = {
    base: baseModifiers,
    subclasses: archetypeModifiers[name]?.subclasses || {},
    levelBenefits: archetypeModifiers[name]?.levelBenefits || {}
  };
  
  // Update UI
  renderArchetypeSlots();
  updateArchetypeDisplay();
  document.getElementById('archetype-editor-modal').style.display = 'none';
}

function deleteArchetype() {
  const name = document.getElementById('new-archetype-name').value.trim();
  if (name && archetypeModifiers[name]) {
    delete archetypeModifiers[name];
    renderArchetypeSlots();
    updateArchetypeDisplay();
    document.getElementById('archetype-editor-modal').style.display = 'none';
  }
}

function addModifierToEditor(stat, value, container) {
  const li = document.createElement('li');
  li.className = 'modifier-item';
  li.innerHTML = `
    <span>${stat}: ${value}</span>
    <button class="remove-modifier-btn"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(li);

  li.querySelector('.remove-modifier-btn').addEventListener('click', () => {
    li.remove();
  });
}
