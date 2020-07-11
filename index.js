import { State, createUniverse, nextGeneration } from './universe';

const universeConfig = {
  size: { width: 90, height: 60 },
  unitProbability: 0.2,
  infectionRate: 0.01,
  deathRate: 0.03,
};

let universe = createUniverse(universeConfig);
let generationCount = 0;
let running = false;

const generationSpan = document.getElementById('generation');
const infectionRateSpan = document.getElementById('infectionRate');
const deathRateSpan = document.getElementById('deathRate');
const spawnRate = document.getElementById('spawnRate');

infectionRateSpan.innerText = universeConfig.infectionRate;
deathRateSpan.innerText = universeConfig.deathRate;
spawnRate.innerText = universeConfig.unitProbability;

const c = document.getElementById('canvas');
const cellSize = {
  w: c.width / universeConfig.size.width,
  h: c.height / universeConfig.size.height,
};

const ctx = c.getContext('2d');
ctx.translate(0.5, 0.5);

function drawEmptyGrid() {
  for (let row = 0; row < universeConfig.size.height; row += 1) {
    for (let col = 0; col < universeConfig.size.width; col += 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ccc';
      ctx.rect(col * cellSize.w, row * cellSize.h, cellSize.w, cellSize.h);
      ctx.stroke();
    }
  }
}

function drawGeneration() {
  generationSpan.innerText = generationCount;
  for (let row = 0; row < universeConfig.size.height; row += 1) {
    for (let col = 0; col < universeConfig.size.width; col += 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ccc';
      ctx.rect(col * cellSize.w, row * cellSize.h, cellSize.w, cellSize.h);
      ctx.stroke();

      if ((universe[row][col] & State.INFECTED) === State.INFECTED) {
        ctx.fillStyle = '#50af23';
      } else if (universe[row][col] === State.ALIVE) {
        ctx.fillStyle = '#000';
      } else {
        ctx.fillStyle = '#fff';
      }

      ctx.fillRect(col * cellSize.w, row * cellSize.h, cellSize.w, cellSize.h);
    }
  }

  if (running) {
    setTimeout(() => {
      universe = nextGeneration(universe, universeConfig);
      generationCount += 1;
      drawGeneration();
    }, 20);
  }
}

const startButton = document.getElementById('startButton');
startButton.onclick = () => {
  if (!running) {
    running = true;
    startButton.innerText = 'Pause';
    drawGeneration();
  } else {
    startButton.innerText = 'Resume';
    running = false;
  }
};

document.getElementById('resetButton').onclick = () => {
  generationCount = 0;
  universe = createUniverse(universeConfig);

  if (!running) {
    startButton.onclick();
  }
};

drawEmptyGrid();
