import { State, createUniverse, nextGeneration } from './universe';

const universeConfig = {
  size: { width: 90, height: 60 },
  unitProbability: 0.2,
};

let universe = createUniverse(universeConfig);
const c = document.getElementById('canvas');

const cellSize = {
  w: c.width / universeConfig.size.width,
  h: c.height / universeConfig.size.height,
};

const ctx = c.getContext('2d');
ctx.translate(0.5, 0.5);

function drawGeneration() {
  for (let row = 0; row < universeConfig.size.height; row += 1) {
    for (let col = 0; col < universeConfig.size.width; col += 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ccc';
      ctx.rect(col * cellSize.w, row * cellSize.h, cellSize.w, cellSize.h);
      ctx.stroke();

      if (universe[row][col] === State.ALIVE) {
        ctx.fillStyle = '#000';
      } else {
        ctx.fillStyle = '#fff';
      }

      ctx.fillRect(col * cellSize.w, row * cellSize.h, cellSize.w, cellSize.h);
    }
  }

  setTimeout(() => {
    universe = nextGeneration(universe, {});
    drawGeneration();
  }, 20);
}

document.getElementById('startButton').onclick = drawGeneration;
document.getElementById('resetButton').onclick = () => {
  universe = createUniverse(universeConfig);
};
