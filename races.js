function renderRaceSlots() {
  const raceSlotsContainer = document.getElementById('race-slots');
  raceSlotsContainer.innerHTML = '';
  const defaultSlot = document.createElement('div');
  defaultSlot.className = 'race-slot';
  defaultSlot.innerHTML = `
    <select class="race-dropdown">
      ${Object.keys(raceModifiers).map(race => `
        <option value="${race}">${race}</option>
      `).join('')}
    </select>
    <button class="remove-race"><i class="fas fa-times"></i></button>
  `;
  raceSlotsContainer.appendChild(defaultSlot);
  addRaceSlotListeners(defaultSlot);
}

function addRaceSlot() {
  const raceSlotsContainer = document.getElementById('race-slots');
  const newSlot = document.createElement('div');
  newSlot.className = 'race-slot';
  newSlot.innerHTML = `
    <select class="race-dropdown">
      ${Object.keys(raceModifiers).map(race => `
        <option value="${race}">${race}</option>
      `).join('')}
    </select>
    <button class="remove-race"><i class="fas fa-times"></i></button>
  `;
  raceSlotsContainer.appendChild(newSlot);
  addRaceSlotListeners(newSlot);
}

function addRaceSlotListeners(slot) {
  const dropdown = slot.querySelector('.race-dropdown');
  const removeBtn = slot.querySelector('.remove-race');
  
  dropdown.addEventListener('change', () => {
    updateExtraTraitsUI();
    updateStatsDisplay();
  });
  
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      slot.remove();
      updateExtraTraitsUI();
      updateStatsDisplay();
    });
  }
}

function updateExtraTraitsUI() {
  const extraTraitsContainer = document.getElementById('extra-traits-container');
  extraTraitsContainer.innerHTML = '';
  const raceSlots = document.querySelectorAll('.race-dropdown');

  raceSlots.forEach(slot => {
    const race = slot.value;
    const raceData = raceModifiers[race];
    if (!raceData || !raceData.extraSections) return;

    for (const [sectionName, options] of Object.entries(raceData.extraSections)) {
      if (!options) continue;
      
      const sectionDiv = document.createElement('div');
      sectionDiv.className = 'extra-section';
      sectionDiv.innerHTML = `
        <div class="section-title">
          <span>${sectionName}:</span>
          <button class="remove-section" data-race="${race}" data-section="${sectionName}">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <select class="section-option" data-race="${race}" data-section="${sectionName}">
          ${Object.keys(options).map(opt => `
            <option value="${opt}">${opt}</option>
          `).join('')}
        </select>
      `;
      extraTraitsContainer.appendChild(sectionDiv);

      sectionDiv.querySelector('.section-option').addEventListener('change', updateStatsDisplay);
      sectionDiv.querySelector('.remove-section').addEventListener('click', (e) => {
        const race = e.target.closest('button').dataset.race;
        const section = e.target.closest('button').dataset.section;
        if (raceModifiers[race] && raceModifiers[race].extraSections) {
          delete raceModifiers[race].extraSections[section];
          updateExtraTraitsUI();
          updateStatsDisplay();
        }
      });
    }
  });
}

function openRaceEditor() {
  const firstRaceDropdown = document.querySelector('.race-dropdown');
  currentEditingRace = firstRaceDropdown ? firstRaceDropdown.value : null;
  
  document.getElementById('new-race-name').value = currentEditingRace || '';
  document.getElementById('editor-modifier-list').innerHTML = '';
  document.getElementById('section-modifiers-container').innerHTML = '';
  currentSections = {};

  // Load existing modifiers if editing
  if (currentEditingRace && raceModifiers[currentEditingRace]) {
    const raceData = raceModifiers[currentEditingRace];
    
    // Base modifiers
    for (const [stat, value] of Object.entries(raceData.base || {})) {
      addModifierToEditor(stat, value, document.getElementById('editor-modifier-list'));
    }

    // Extra sections
    for (const [sectionName, options] of Object.entries(raceData.extraSections || {})) {
      currentSections[sectionName] = options || {};
      addSectionToEditor(sectionName, options);
    }
  }

  document.getElementById('race-editor-modal').style.display = 'block';
}

function addSectionToEditor(sectionName, options) {
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'editor-extra-section';
  sectionDiv.innerHTML = `
    <div class="section-header">
      <div class="section-title">${sectionName}</div>
      <button class="remove-section-btn" data-section="${sectionName}">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="section-options-container" data-section="${sectionName}"></div>
    <button class="add-section-option" data-section="${sectionName}">
      <i class="fas fa-plus"></i> Add Option
    </button>
  `;
  document.getElementById('section-modifiers-container').appendChild(sectionDiv);

  // Add existing options
  const optionsContainer = sectionDiv.querySelector('.section-options-container');
  for (const [optName, modifiers] of Object.entries(options || {})) {
    addSectionOption(sectionName, optName, modifiers, optionsContainer);
  }

  // Add option button
  sectionDiv.querySelector('.add-section-option').addEventListener('click', (e) => {
    const section = e.target.closest('button').dataset.section;
    const optName = prompt("Option name (e.g., 50%):");
    if (optName) {
      if (!currentSections[section][optName]) {
        currentSections[section][optName] = {};
      }
      addSectionOption(section, optName, currentSections[section][optName], optionsContainer);
    }
  });

  // Remove section button
  sectionDiv.querySelector('.remove-section-btn').addEventListener('click', (e) => {
    const section = e.target.closest('button').dataset.section;
    delete currentSections[section];
    sectionDiv.remove();
  });
}

function addSectionOption(sectionName, optionName, modifiers, container) {
  if (!container) {
    container = document.querySelector(`.section-options-container[data-section="${sectionName}"]`);
    if (!container) return;
  }

  const optionDiv = document.createElement('div');
  optionDiv.className = 'section-option-editor';
  optionDiv.innerHTML = `
    <div class="option-header">
      <div>${optionName}:</div>
      <button class="remove-option-btn" data-section="${sectionName}" data-option="${optionName}">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="option-modifiers"></div>
    <div class="modifier-input">
      <select class="option-stat-select">
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
      <input type="number" class="option-modifier-value" placeholder="+2">
      <button class="add-option-modifier" data-section="${sectionName}" data-option="${optionName}">
        <i class="fas fa-plus"></i> Add
      </button>
    </div>
  `;
  container.appendChild(optionDiv);

  // Add existing modifiers
  const modsContainer = optionDiv.querySelector('.option-modifiers');
  for (const [stat, value] of Object.entries(modifiers || {})) {
    addModifierToOption(sectionName, optionName, stat, value, modsContainer);
  }

  // Add modifier button
  optionDiv.querySelector('.add-option-modifier').addEventListener('click', (e) => {
    const section = e.target.closest('button').dataset.section;
    const option = e.target.closest('button').dataset.option;
    const statSelect = optionDiv.querySelector('.option-stat-select');
    const valueInput = optionDiv.querySelector('.option-modifier-value');
    
    const stat = statSelect.value;
    const value = parseInt(valueInput.value);
    
    if (!isNaN(value)) {
      if (!currentSections[section][option]) {
        currentSections[section][option] = {};
      }
      currentSections[section][option][stat] = value;
      addModifierToOption(section, option, stat, value, modsContainer);
      valueInput.value = '';
    }
  });

  // Remove option button
  optionDiv.querySelector('.remove-option-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const section = e.target.closest('button').dataset.section;
    const option = e.target.closest('button').dataset.option;
    delete currentSections[section][option];
    optionDiv.remove();
  });
}

function addModifierToOption(section, option, stat, value, container) {
  const modDiv = document.createElement('div');
  modDiv.className = 'modifier-item';
  modDiv.innerHTML = `
    <span>${stat}: ${value}</span>
    <button class="remove-modifier-btn" data-stat="${stat}">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(modDiv);

  // Remove modifier button
  modDiv.querySelector('.remove-modifier-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const stat = e.target.closest('button').dataset.stat;
    delete currentSections[section][option][stat];
    modDiv.remove();
  });
}

function saveRace() {
  const name = document.getElementById('new-race-name').value.trim();
  if (!name) return;

  // Get base modifiers
  const baseModifiers = {};
  document.getElementById('editor-modifier-list').querySelectorAll('li').forEach(item => {
    const [stat, value] = item.textContent.split(': ');
    baseModifiers[stat] = parseInt(value);
  });

  // Save to raceModifiers
  raceModifiers[name] = {
    base: baseModifiers,
    extraSections: {...currentSections}
  };

  // Update UI
  renderRaceSlots();
  updateExtraTraitsUI();
  document.getElementById('race-editor-modal').style.display = 'none';
}

function deleteRace() {
  const name = document.getElementById('new-race-name').value.trim();
  if (name && raceModifiers[name]) {
    delete raceModifiers[name];
    renderRaceSlots();
    updateExtraTraitsUI();
    document.getElementById('race-editor-modal').style.display = 'none';
  }
}

function resetEditor() {
  if (confirm('Are you sure you want to reset the editor? All unsaved changes will be lost.')) {
    document.getElementById('new-race-name').value = '';
    document.getElementById('editor-modifier-list').innerHTML = '';
    document.getElementById('section-modifiers-container').innerHTML = '';
    currentSections = {};
    currentEditingRace = null;
  }
}
