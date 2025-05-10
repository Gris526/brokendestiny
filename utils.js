// Utility functions
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
