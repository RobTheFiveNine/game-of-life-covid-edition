export const State = {
  DEAD: 0,
  ALIVE: 1,
  INFECTED: 2,
};

export function nextGeneration(universe, { infectionRate, deathRate }) {
  const nextGen = [];
  const size = {
    w: universe[0].length,
    h: universe.length,
  };

  for (let row = 0; row < size.h; row += 1) {
    nextGen.push(new Array(size.w));

    const bottom = (row + 1 + size.h) % size.h;
    const top = (row + -1 + size.h) % size.h;

    for (let col = 0; col < size.w; col += 1) {
      const left = (col + -1 + size.w) % size.w;
      const right = (col + 1 + size.w) % size.w;

      const neighbours = [
        universe[row][left], // left
        universe[row][right], // right
        universe[top][left], // top left
        universe[top][col], // top
        universe[top][right], // top right
        universe[bottom][left], // bottom left
        universe[bottom][col], // bottom
        universe[bottom][right], // bottom right
      ];

      const liveNeighbours = neighbours.filter((n) => n === State.ALIVE).length;

      nextGen[row][col] = universe[row][col];

      if (universe[row][col] === State.ALIVE) {
        if (liveNeighbours < 2) {
          nextGen[row][col] = State.DEAD;
        } else if (liveNeighbours > 3) {
          nextGen[row][col] = State.DEAD;
        }
      } else if (universe[row][col] === State.DEAD) {
        if (liveNeighbours === 3) {
          nextGen[row][col] = State.ALIVE;
        }
      }
    }
  }

  return nextGen;
}

export function createUniverse({ size, unitProbability, infectionRate }) {
  const universe = [];

  for (let row = 0; row < size.height; row += 1) {
    universe.push([]);

    for (let col = 0; col < size.width; col += 1) {
      universe[row].push(Math.random() <= unitProbability ? State.ALIVE : State.DEAD);
    }
  }

  return universe;
}

export default createUniverse;
