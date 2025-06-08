 <script>
    // Initialize base stats
    let baseStats = {
      strength: 5,
      speed: 5,
      resistance: 5,
      intelligence: 5,
      charisma: 5,
      maestry: 5,
      perception: 5,
      will: 5,
      bravery: 5,
      mana: 5,
      luck: 5,
      stealth: 5,
      size: 5
    };

    // Archetype data structure
    let archetypeModifiers = {
      warrior: {
        base: { strength: 2, resistance: 1 },
        subclasses: {
          "Berserker": {
            base: { strength: 1, will: -1 },
            levelBenefits: {
              "1": { strength: 1 },
              "15": { strength: 2, resistance: 1 },
              "30": { strength: 3, resistance: 2 },
              "50": { strength: 5, resistance: 3 },
              "100": { strength: 10, resistance: 5 }
            }
          }
        },
        levelBenefits: {
          "1": { strength: 1 },
          "15": { strength: 2, resistance: 1 },
          "30": { strength: 3, resistance: 2 },
          "50": { strength: 4, resistance: 3 },
          "100": { strength: 6, resistance: 5 }
        }
      },
      mage: {
        base: { intelligence: 2, mana: 1 },
        subclasses: {},
        levelBenefits: {}
      },
      rogue: {
        base: { speed: 2, stealth: 1 },
        subclasses: {},
        levelBenefits: {}
      }
    };

    // Main race data structure
    let raceModifiers = {
      human: {
        base: { 
          strength: 1, 
          speed: 1, 
          resistance: 1, 
          intelligence: 1, 
          charisma: 1 
        },
        extraSections: {
          "Human Potential": {
            "0%": {},
            "25%": { strength: 1, speed: 1 },
            "50%": { strength: 2, speed: 2, resistance: 1 },
            "100%": { strength: 3, speed: 3, resistance: 2, intelligence: 2, charisma: 2 }
          }
        }
      },
      elf: {
        base: { speed: 2, intelligence: 1, perception: 1 },
        extraSections: {}
      },
      dwarf: {
        base: { resistance: 2, strength: 1, size: 1 },
        extraSections: {}
      },
      halfling: {
        base: { speed: 2, stealth: 1, size: -1 },
        extraSections: {}
      }
    };

    // DOM Elements
    const raceSlotsContainer = document.getElementById('race-slots');
    const addRaceBtn = document.getElementById('add-race');
    const modifyRaceBtn = document.getElementById('modify-race');
    const extraTraitsContainer = document.getElementById('extra-traits-container');
    const modifierList = document.getElementById('modifier-list');
    const statElements = {
      strength: document.getElementById('strength'),
      speed: document.getElementById('speed'),
      resistance: document.getElementById('resistance'),
      intelligence: document.getElementById('intelligence'),
      charisma: document.getElementById('charisma'),
      maestry: document.getElementById('maestry'),
      perception: document.getElementById('perception'),
      will: document.getElementById('will'),
      bravery: document.getElementById('bravery'),
      mana: document.getElementById('mana'),
      luck: document.getElementById('luck'),
      stealth: document.getElementById('stealth'),
      size: document.getElementById('size')
    };
    const archetypeSlotsContainer = document.getElementById('archetype-slots');
    const addArchetypeBtn = document.getElementById('add-archetype');
    const modifyArchetypeBtn = document.getElementById('modify-archetype');
    const subclassContainer = document.getElementById('subclass-selection');
    const archetypeBenefitsContainer = document.getElementById('archetype-benefits');
    const archetypeModifierList = document.getElementById('archetype-modifier-list');
    const archetypeModal = document.getElementById('archetype-editor-modal');
    const newArchetypeNameInput = document.getElementById('new-archetype-name');
    const archetypeEditorModifierList = document.getElementById('archetype-editor-modifier-list');
    const saveArchetypeBtn = document.getElementById('save-archetype');
    const deleteArchetypeBtn = document.getElementById('delete-archetype');
    const subclassModifiersContainer = document.getElementById('subclass-modifiers-container');
    const addSubclassBtn = document.getElementById('add-subclass');
    const newSubclassNameInput = document.getElementById('new-subclass-name');
    const levelBenefitsContainer = document.getElementById('level-benefits-container');
    const addLevelSectionBtn = document.getElementById('add-level-section');
    const levelSelect = document.getElementById('level-select');
    
    // Base Stats Editor Elements
    const baseStatInputs = {
      strength: document.getElementById('base-strength'),
      speed: document.getElementById('base-speed'),
      resistance: document.getElementById('base-resistance'),
      intelligence: document.getElementById('base-intelligence'),
      charisma: document.getElementById('base-charisma'),
      maestry: document.getElementById('base-maestry'),
      perception: document.getElementById('base-perception'),
      will: document.getElementById('base-will'),
      bravery: document.getElementById('base-bravery'),
      mana: document.getElementById('base-mana'),
      luck: document.getElementById('base-luck'),
      stealth: document.getElementById('base-stealth'),
      size: document.getElementById('base-size')
    };
    const updateStatsBtn = document.getElementById('update-stats');

    // Race Editor Elements
    const modal = document.getElementById('race-editor-modal');
    const closeModal = document.querySelector('.close');
    const newRaceNameInput = document.getElementById('new-race-name');
    const editorModifierList = document.getElementById('editor-modifier-list');
    const saveRaceBtn = document.getElementById('save-race');
    const deleteRaceBtn = document.getElementById('delete-race');
    const sectionModifiersContainer = document.getElementById('section-modifiers-container');
    const addSectionBtn = document.getElementById('add-section');
    const newSectionNameInput = document.getElementById('new-section-name');
    const statSelect = document.querySelector('.stat-select');
    const modifierValueInput = document.querySelector('.modifier-value');
    const addModifierBtn = document.querySelector('.add-modifier');
    const themeToggle = document.getElementById('theme-toggle');
    const resetEditorBtn = document.getElementById('reset-editor');
    
    // JSON Tools Elements
    const exportDataBtn = document.getElementById('export-data');
    const importDataBtn = document.getElementById('import-data');
    const exportCharacterBtn = document.getElementById('export-character');
    const characterNameInput = document.getElementById('character-name');

    // Tab Elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Current editing state
    let currentEditingRace = null;
    let currentEditingArchetype = null;
    let currentSections = {};

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderRaceSlots();
      renderArchetypeSlots();
      updateStatsDisplay();
      updateBaseStatInputs();
      updateArchetypeDisplay();
      
      // Set up event listeners
      setupEventListeners();
    });

    // --- Export/Import Functions ---
    function exportAllData() {
      const data = {
        races: raceModifiers,
        archetypes: archetypeModifiers,
        baseStats: baseStats
      };
      
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dnd-character-creator-data.json';
      a.click();
    }

    function importAllData() {
      document.getElementById('import-file').click();
    }

    function handleFileImport(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.races) raceModifiers = data.races;
          if (data.archetypes) archetypeModifiers = data.archetypes;
          if (data.baseStats) baseStats = data.baseStats;
          
          renderRaceSlots();
          renderArchetypeSlots();
          updateExtraTraitsUI();
          updateStatsDisplay();
          updateBaseStatInputs();
          updateArchetypeDisplay();
          
          alert('Data imported successfully!');
        } catch (error) {
          alert('Invalid JSON file!');
          console.error(error);
        }
      };
      reader.readAsText(file);
    }

    function exportCharacter() {
  const characterName = document.getElementById('character-name').value.trim() || 'Unnamed Character';
  
  // Get selected races and their options
  const selectedRaces = [];
  const raceSlots = document.querySelectorAll('.race-slot');
  raceSlots.forEach(slot => {
    const race = slot.querySelector('.race-dropdown').value;
    const raceData = raceModifiers[race];
    if (!raceData) return;
    
    const raceInfo = {
      name: race,
      baseModifiers: {...raceData.base}
    };
    
    // Add extra sections
    const sectionOptions = extraTraitsContainer.querySelectorAll(`.section-option[data-race="${race}"]`);
    if (sectionOptions.length > 0) {
      raceInfo.extraSections = {};
      sectionOptions.forEach(select => {
        const section = select.dataset.section;
        const option = select.value;
        raceInfo.extraSections[section] = option;
      });
    }
    
    selectedRaces.push(raceInfo);
  });
  
  // Get selected archetypes, levels, and subclasses
  const selectedArchetypes = [];
  const archetypeSlots = document.querySelectorAll('.archetype-dropdown');
  archetypeSlots.forEach(slot => {
    const archetype = slot.value;
    const level = parseInt(slot.closest('.race-slot').querySelector('.archetype-level').value) || 1;
    const archetypeData = archetypeModifiers[archetype];
    if (!archetypeData) return;
    
    const archetypeInfo = {
      name: archetype,
      level: level,
      baseModifiers: {...archetypeData.base}
    };
    
    // Add subclass if selected
    const subclassSelect = document.querySelector(`.subclass-select[data-archetype="${archetype}"]`);
    if (subclassSelect && subclassSelect.value) {
      archetypeInfo.subclass = subclassSelect.value;
      const subclassData = archetypeData.subclasses[subclassSelect.value];
      if (subclassData) {
        archetypeInfo.subclassModifiers = {...subclassData.base};
        
        // Add subclass level benefits
        const subclassApplicableLevel = getApplicableLevel(subclassData.levelBenefits, level);
        if (subclassApplicableLevel && subclassData.levelBenefits[subclassApplicableLevel]) {
          archetypeInfo.subclassLevelBenefits = {
            level: subclassApplicableLevel,
            modifiers: {...subclassData.levelBenefits[subclassApplicableLevel]}
          };
        }
      }
    }
    
    selectedArchetypes.push(archetypeInfo);
  });
  
  // Get current stats with modifiers
  const currentStats = {};
  for (const stat in baseStats) {
    currentStats[stat] = {
      base: baseStats[stat],
      modifier: getCombinedModifiers()[stat] || 0,
      total: baseStats[stat] + (getCombinedModifiers()[stat] || 0)
    };
  }
  
  // Create character object
  const character = {
    name: characterName,
    baseStats: baseStats,
    currentStats: currentStats,
    races: selectedRaces,
    archetypes: selectedArchetypes,
    modifiers: getCombinedModifiers(),
    size: calculateSize(currentStats.size.total),
    timestamp: new Date().toISOString()
  };
  
  // Export as JSON
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${characterName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
  a.click();
}

    // --- Archetype Functions ---
    function renderArchetypeSlots() {
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
      
      newArchetypeNameInput.value = currentEditingArchetype || '';
      archetypeEditorModifierList.innerHTML = '';
      subclassModifiersContainer.innerHTML = '';
      levelBenefitsContainer.innerHTML = '';
      
      if (currentEditingArchetype && archetypeModifiers[currentEditingArchetype]) {
        const archetypeData = archetypeModifiers[currentEditingArchetype];
        
        // Load base modifiers
        Object.entries(archetypeData.base || {}).forEach(([stat, value]) => {
          addModifierToEditor(stat, value, archetypeEditorModifierList);
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
      
      archetypeModal.style.display = 'block';
    }

    function addSubclass() {
      const subclassName = newSubclassNameInput.value.trim();
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
      newSubclassNameInput.value = '';
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
      subclassModifiersContainer.appendChild(subclassDiv);
      
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
      const level = levelSelect.value;
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
      levelBenefitsContainer.appendChild(levelDiv);
      
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
      const name = newArchetypeNameInput.value.trim();
      if (!name) return;
      
      // Get base modifiers
      const baseModifiers = {};
      archetypeEditorModifierList.querySelectorAll('li').forEach(item => {
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
      archetypeModal.style.display = 'none';
    }

    function deleteArchetype() {
      const name = newArchetypeNameInput.value.trim();
      if (name && archetypeModifiers[name]) {
        delete archetypeModifiers[name];
        renderArchetypeSlots();
        updateArchetypeDisplay();
        archetypeModal.style.display = 'none';
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

    // --- Race Functions ---
    function renderRaceSlots() {
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

    function getCombinedModifiers() {
  const modifiers = {};
  const raceSlots = document.querySelectorAll('.race-dropdown');
  const archetypeSlots = document.querySelectorAll('.archetype-dropdown');

  // Add race modifiers
  raceSlots.forEach(slot => {
    const race = slot.value;
    const raceData = raceModifiers[race];
    if (!raceData) return;

    // Add base modifiers
    for (const [stat, value] of Object.entries(raceData.base || {})) {
      if (value) modifiers[stat] = (modifiers[stat] || 0) + value;
    }

    // Add extra sections from this race
    const sectionOptions = extraTraitsContainer.querySelectorAll(`.section-option[data-race="${race}"]`);
    sectionOptions.forEach(select => {
      const section = select.dataset.section;
      const option = select.value;
      
      const sectionData = raceData.extraSections?.[section] || {};
      const optionData = sectionData[option] || {};
      
      for (const [stat, value] of Object.entries(optionData)) {
        if (value) modifiers[stat] = (modifiers[stat] || 0) + value;
      }
    });
  });

  // Add archetype modifiers
  archetypeSlots.forEach(slot => {
    const archetype = slot.value;
    const level = parseInt(slot.closest('.race-slot').querySelector('.archetype-level').value) || 1;
    const archetypeData = archetypeModifiers[archetype];
    if (!archetypeData) return;

    // Add base archetype modifiers
    for (const [stat, value] of Object.entries(archetypeData.base || {})) {
      modifiers[stat] = (modifiers[stat] || 0) + value;
    }

    // Add level benefits
    const applicableLevel = getApplicableLevel(archetypeData.levelBenefits, level);
    if (applicableLevel && archetypeData.levelBenefits[applicableLevel]) {
      for (const [stat, value] of Object.entries(archetypeData.levelBenefits[applicableLevel])) {
        modifiers[stat] = (modifiers[stat] || 0) + value;
      }
    }

    // Add subclass benefits if selected
    const subclassSelect = document.querySelector(`.subclass-select[data-archetype="${archetype}"]`);
    if (subclassSelect && subclassSelect.value && archetypeData.subclasses[subclassSelect.value]) {
      const subclassData = archetypeData.subclasses[subclassSelect.value];
      
      // Add base subclass modifiers
      for (const [stat, value] of Object.entries(subclassData.base || {})) {
        modifiers[stat] = (modifiers[stat] || 0) + value;
      }
      
      // Add subclass level benefits
      const subclassApplicableLevel = getApplicableLevel(subclassData.levelBenefits, level);
      if (subclassApplicableLevel && subclassData.levelBenefits[subclassApplicableLevel]) {
        for (const [stat, value] of Object.entries(subclassData.levelBenefits[subclassApplicableLevel])) {
          modifiers[stat] = (modifiers[stat] || 0) + value;
        }
      }
    }
  });

  return modifiers;
}

    function updateStatsDisplay() {
      const modifiers = getCombinedModifiers();
      modifierList.innerHTML = '';
      archetypeModifierList.innerHTML = '';

      // Clear both modifier lists first
      modifierList.innerHTML = '';
      archetypeModifierList.innerHTML = '';

      // Process race modifiers
      const raceSlots = document.querySelectorAll('.race-dropdown');
      raceSlots.forEach(slot => {
        const race = slot.value;
        const raceData = raceModifiers[race];
        if (!raceData) return;

        // Add base modifiers to race modifier list
        Object.entries(raceData.base || {}).forEach(([stat, value]) => {
          if (value) {
            const li = document.createElement('li');
            li.className = 'modifier-item';
            li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">Race Base</span></span>`;
            modifierList.appendChild(li);
          }
        });

        // Add extra sections to race modifier list
        const sectionOptions = extraTraitsContainer.querySelectorAll(`.section-option[data-race="${race}"]`);
        sectionOptions.forEach(select => {
          const section = select.dataset.section;
          const option = select.value;
          
          const sectionData = raceData.extraSections?.[section] || {};
          const optionData = sectionData[option] || {};
          
          Object.entries(optionData).forEach(([stat, value]) => {
            if (value) {
              const li = document.createElement('li');
              li.className = 'modifier-item';
              li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">${section} ${option}</span></span>`;
              modifierList.appendChild(li);
            }
          });
        });
      });

      // Process archetype modifiers
      const archetypeSlots = document.querySelectorAll('.archetype-dropdown');
      archetypeSlots.forEach(slot => {
        const archetype = slot.value;
        const level = parseInt(slot.closest('.race-slot').querySelector('.archetype-level').value) || 1;
        const archetypeData = archetypeModifiers[archetype];
        if (!archetypeData) return;

        // Add base archetype modifiers to archetype modifier list
        Object.entries(archetypeData.base || {}).forEach(([stat, value]) => {
          const li = document.createElement('li');
          li.className = 'modifier-item';
          li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">Archetype Base</span></span>`;
          archetypeModifierList.appendChild(li);
        });

        // Add level benefits to archetype modifier list
        const applicableLevel = getApplicableLevel(archetypeData.levelBenefits, level);
        if (applicableLevel && archetypeData.levelBenefits[applicableLevel]) {
          Object.entries(archetypeData.levelBenefits[applicableLevel]).forEach(([stat, value]) => {
            const li = document.createElement('li');
            li.className = 'modifier-item';
            li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">Level ${applicableLevel}</span></span>`;
            archetypeModifierList.appendChild(li);
          });
        }

        // Add subclass benefits if selected
        const subclassSelect = document.querySelector(`.subclass-select[data-archetype="${archetype}"]`);
        if (subclassSelect && subclassSelect.value && archetypeData.subclasses[subclassSelect.value]) {
          const subclassData = archetypeData.subclasses[subclassSelect.value];
          
          // Add base subclass modifiers to archetype modifier list
          Object.entries(subclassData.base || {}).forEach(([stat, value]) => {
            const li = document.createElement('li');
            li.className = 'modifier-item';
            li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">${subclassSelect.value}</span></span>`;
            archetypeModifierList.appendChild(li);
          });
          
          // Add subclass level benefits to archetype modifier list
          const subclassApplicableLevel = getApplicableLevel(subclassData.levelBenefits, level);
          if (subclassApplicableLevel && subclassData.levelBenefits[subclassApplicableLevel]) {
            Object.entries(subclassData.levelBenefits[subclassApplicableLevel]).forEach(([stat, value]) => {
              const li = document.createElement('li');
              li.className = 'modifier-item';
              li.innerHTML = `<span>${stat}: ${value > 0 ? '+' : ''}${value} <span class="permanent-tag">${subclassSelect.value} Level ${subclassApplicableLevel}</span></span>`;
              archetypeModifierList.appendChild(li);
            });
          }
        }
      });

      // Update stat displays
      const combinedModifiers = getCombinedModifiers();
      for (const stat in baseStats) {
        const modifier = combinedModifiers[stat] || 0;
        const total = baseStats[stat] + modifier;
        if (statElements[stat]) {
          const valueSpan = statElements[stat].querySelector('.stat-value');
          const modSpan = statElements[stat].querySelector('.mod-value');
          
          if (valueSpan) {
            valueSpan.textContent = total;
          }
          
          if (modSpan) {
            if (stat === 'size') {
              const sizeSpan = statElements[stat].querySelector('.size-value');
              if (sizeSpan) {
                sizeSpan.textContent = calculateSize(total);
              }
            } else {
              const modifierValue = calculateModifier(total);
              modSpan.textContent = modifierValue > 0 ? '+' + modifierValue : modifierValue;
            }
          }
          
          statElements[stat].dataset.modifier = modifier !== 0 ? `(${baseStats[stat]} + ${modifier})` : '';
        }
      }
    }

    function updateBaseStatsFromInputs() {
      for (const stat in baseStatInputs) {
        const value = parseInt(baseStatInputs[stat].value);
        if (!isNaN(value)) {
          baseStats[stat] = value;
        }
      }
      updateStatsDisplay();
      updateSizeDisplay();
    }

    function updateBaseStatInputs() {
      for (const stat in baseStatInputs) {
        baseStatInputs[stat].value = baseStats[stat];
      }
    }

    function updateSizeDisplay() {
      const sizeElement = document.querySelector('#size .stat-value');
      const sizeValue = parseInt(sizeElement.textContent, 10);
      const sizeText = calculateSize(sizeValue);
      document.querySelector('#size .size-value').textContent = sizeText;
    }

    function calculateModifier(statValue) {
      const base = 1.25; // Growth factor (higher = steeper curve)
      const center = 5; // Center point where modifier = 0
      
      // Calculate difference from center
      const diff = statValue - center;
      
      // Apply exponential formula with sign preservation
      if (diff === 0) return 0;
      const modifier = Math.sign(diff) * Math.pow(base, Math.abs(diff)) - 1;
      
      // Round to nearest integer
      return Math.round(modifier);
    }

    function calculateSize(sizeValue) {
      // Linear growth - 1.50m at size 5, 0.10m per point difference
      const baseSize = 1.50; // meters at size 5
      const sizePerPoint = 0.10; // meters change per size point
      const sizeInMeters = baseSize + (sizeValue - 5) * sizePerPoint;
      return Math.max(0.1, sizeInMeters).toFixed(2) + "m";
    }

    // --- Race Editor Functions ---
    function openRaceEditor() {
      const firstRaceDropdown = document.querySelector('.race-dropdown');
      currentEditingRace = firstRaceDropdown ? firstRaceDropdown.value : null;
      
      newRaceNameInput.value = currentEditingRace || '';
      editorModifierList.innerHTML = '';
      sectionModifiersContainer.innerHTML = '';
      currentSections = {};

      // Load existing modifiers if editing
      if (currentEditingRace && raceModifiers[currentEditingRace]) {
        const raceData = raceModifiers[currentEditingRace];
        
        // Base modifiers
        for (const [stat, value] of Object.entries(raceData.base || {})) {
          addModifierToEditor(stat, value, editorModifierList);
        }

        // Extra sections
        for (const [sectionName, options] of Object.entries(raceData.extraSections || {})) {
          currentSections[sectionName] = options || {};
          addSectionToEditor(sectionName, options);
        }
      }

      modal.style.display = 'block';
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
      sectionModifiersContainer.appendChild(sectionDiv);

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
      const name = newRaceNameInput.value.trim();
      if (!name) return;

      // Get base modifiers
      const baseModifiers = {};
      editorModifierList.querySelectorAll('li').forEach(item => {
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
      modal.style.display = 'none';
    }

    function deleteRace() {
      const name = newRaceNameInput.value.trim();
      if (name && raceModifiers[name]) {
        delete raceModifiers[name];
        renderRaceSlots();
        updateExtraTraitsUI();
        modal.style.display = 'none';
      }
    }

    function resetEditor() {
      if (confirm('Are you sure you want to reset the editor? All unsaved changes will be lost.')) {
        newRaceNameInput.value = '';
        editorModifierList.innerHTML = '';
        sectionModifiersContainer.innerHTML = '';
        currentSections = {};
        currentEditingRace = null;
      }
    }

    // --- Event Listeners ---
    function setupEventListeners() {
      // Tab Switching
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          tab.classList.add('active');
          document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
      });

      // Theme Toggle
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
          icon.classList.replace('fa-moon', 'fa-sun');
        } else {
          icon.classList.replace('fa-sun', 'fa-moon');
        }
      });

      // Update Base Stats
      updateStatsBtn.addEventListener('click', updateBaseStatsFromInputs);

      // Race Slot Management
      addRaceBtn.addEventListener('click', () => addRaceSlot(false));

      // Archetype Slot Management
      addArchetypeBtn.addEventListener('click', () => addArchetypeSlot(false));

      // Race Editor
      modifyRaceBtn.addEventListener('click', openRaceEditor);
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      // Add modifier in editor
      addModifierBtn.addEventListener('click', () => {
        const stat = statSelect.value;
        const value = parseInt(modifierValueInput.value);
        if (isNaN(value)) return;

        addModifierToEditor(stat, value, editorModifierList);
        modifierValueInput.value = '';
      });

      // Add section in editor
      addSectionBtn.addEventListener('click', () => {
        const sectionName = newSectionNameInput.value.trim();
        if (!sectionName || currentSections[sectionName]) return;

        currentSections[sectionName] = { "Default Option": {} };
        addSectionToEditor(sectionName, currentSections[sectionName]);
        newSectionNameInput.value = '';
      });

      // Save race
      saveRaceBtn.addEventListener('click', saveRace);

      // Delete race
      deleteRaceBtn.addEventListener('click', deleteRace);

      // Reset editor
      resetEditorBtn.addEventListener('click', resetEditor);

      // Archetype Editor
      modifyArchetypeBtn.addEventListener('click', openArchetypeEditor);
      document.querySelector('#archetype-editor-modal .close').addEventListener('click', () => {
        archetypeModal.style.display = 'none';
      });
      saveArchetypeBtn.addEventListener('click', saveArchetype);
      deleteArchetypeBtn.addEventListener('click', deleteArchetype);
      addSubclassBtn.addEventListener('click', addSubclass);
      addLevelSectionBtn.addEventListener('click', addLevelSection);

       // JSON Export/Import
  exportDataBtn.addEventListener('click', exportAllData);
  importDataBtn.addEventListener('click', importAllData);
  exportCharacterBtn.addEventListener('click', exportCharacter);
  document.getElementById('import-file').addEventListener('change', handleFileImport);

      // Allow Enter key to add modifiers
      modifierValueInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addModifierBtn.click();
        }
      });

      newSectionNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addSectionBtn.click();
        }
      });

      newSubclassNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addSubclassBtn.click();
        }
      });

      // Allow Enter key in base stat inputs
      for (const input of Object.values(baseStatInputs)) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            updateBaseStatsFromInputs();
          }
        });
      }
    }
  </script>

