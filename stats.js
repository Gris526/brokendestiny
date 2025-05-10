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

// DOM Elements
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

// Update base stats from inputs
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

// Update base stat inputs from baseStats
function updateBaseStatInputs() {
  for (const stat in baseStatInputs) {
    baseStatInputs[stat].value = baseStats[stat];
  }
}

// Update size display
function updateSizeDisplay() {
  const sizeElement = document.querySelector('#size .stat-value');
  const sizeValue = parseInt(sizeElement.textContent, 10);
  const sizeText = calculateSize(sizeValue);
  document.querySelector('#size .size-value').textContent = sizeText;
}

// Initialize stats
updateBaseStatInputs();
updateStatsDisplay();

// Event listeners
updateStatsBtn.addEventListener('click', updateBaseStatsFromInputs);

// Allow Enter key in base stat inputs
for (const input of Object.values(baseStatInputs)) {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateBaseStatsFromInputs();
    }
  });
}
