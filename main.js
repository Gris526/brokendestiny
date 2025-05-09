// Shared variables
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

// Current editing state
let currentEditingRace = null;
let currentEditingArchetype = null;
let currentSections = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderRaceSlots();
  renderArchetypeSlots();
  updateStatsDisplay();
  updateBaseStatInputs();
  updateArchetypeDisplay();
  setupEventListeners();
});
