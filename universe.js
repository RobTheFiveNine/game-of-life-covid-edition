export const State = {
  DEAD: 0,
  ALIVE: 1,
  INFECTED: 2,
};

export function nextGeneration(universe, { infectionRate, deathRate }) {
  const nextGen = JSON.parse(JSON.stringify(universe));
  const size = {
    w: universe[0].length,
    h: universe.length,
  };

  for (let row = 0; row < size.h; row += 1) {
    const bottom = (row + 1 + size.h) % size.h;
    const top = (row + -1 + size.h) % size.h;

    for (let col = 0; col < size.w; col += 1) {
      const left = (col + -1 + size.w) % size.w;
      const right = (col + 1 + size.w) % size.w;

      const neighbourIndexes = [
        [row, left],
        [row, right],
        [top, left],
        [top, col],
        [top, right],
        [bottom, left],
        [bottom, col],
        [bottom, right],
      ];

      const liveNeighbours = neighbourIndexes.filter(
        (i) => (universe[i[0]][i[1]] & State.ALIVE) === State.ALIVE,
      ).length;

      if ((universe[row][col] & State.ALIVE) === State.ALIVE) {
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

      if (nextGen[row][col] === State.ALIVE) {
        if (Math.random() <= infectionRate) {
          nextGen[row][col] |= State.INFECTED;
        }
      }

      // Infect neighbouring cells and roll death dice.
      if ((nextGen[row][col] & State.INFECTED) === State.INFECTED) {
        for (let i = 0; i < neighbourIndexes.length; i += 1) {
          const ni = neighbourIndexes[i];
          if ((nextGen[ni[0]][ni[1]] & State.ALIVE) === State.ALIVE) {
            if (Math.random() <= infectionRate * 2) {
              nextGen[ni[0]][ni[1]] |= State.INFECTED;
            }
          }
        }

        if (Math.random() <= deathRate) {
          nextGen[row][col] = State.DEAD;
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
      const rn = Math.random();
      universe[row].push(rn <= unitProbability ? State.ALIVE : State.DEAD);

      if (rn <= infectionRate) {
        universe[row][col] |= State.INFECTED;
      }
    }
  }

  return universe;
}

export default createUniverse;
