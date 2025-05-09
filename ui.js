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
    const sectionOptions = document.querySelectorAll(`.section-option[data-race="${race}"]`);
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
  const modifierList = document.getElementById('modifier-list');
  const archetypeModifierList = document.getElementById('archetype-modifier-list');

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
    const sectionOptions = document.querySelectorAll(`.section-option[data-race="${race}"]`);
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
