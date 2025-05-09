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
    const sectionOptions = document.querySelectorAll(`.section-option[data-race="${race}"]`);
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
