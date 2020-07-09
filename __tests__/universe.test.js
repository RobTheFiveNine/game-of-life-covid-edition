import fs from 'fs-extra';
import { createUniverse, nextGeneration, State } from '../universe';

const width = 10;
const height = 5;
const unitProbability = 0.2;
const infectionRate = 0.05;
const deathRate = 0.03;

// Generated Grid
// ==============
// X|X|X|O|X|O|X|X|O|X
// X|X|X|X|X|X|X|X|X|X
// X|X|O|X|X|X|X|O|X|X
// X|X|O|X|X|X|X|X|X|X
// X|X|X|O|X|O|O|X|X|X

let numbers;

beforeAll(async () => {
  numbers = await fs.readJSON('__tests__/samples/numbers.json');
});

beforeEach(() => {
  jest.spyOn(Math, 'random');

  for (let i = 0; i < (width * height) * 2; i += 1) {
    Math.random.mockReturnValueOnce(numbers[i]);
  }
});

afterEach(() => {
  Math.random.mockRestore();
});

describe('.createUniverse', () => {
  it('should return a 2D array matching the specificed size', () => {
    const universe = createUniverse({ size: { width, height } });
    expect(universe).toHaveLength(height);
    expect(universe[0]).toHaveLength(width);
  });

  it('should use the specified probability of cell creation', () => {
    const universe = createUniverse({
      size: { width, height },
      unitProbability,
    });

    for (let hi = 0; hi < height; hi += 1) {
      for (let wi = 0; wi < width; wi += 1) {
        const rng = numbers[(hi * width) + wi];
        if (rng <= unitProbability) {
          expect(universe[hi][wi] & State.ALIVE).toBe(State.ALIVE);
        } else {
          expect(universe[hi][wi] & State.DEAD).toBe(State.DEAD);
        }
      }
    }
  });

  it('should use the specified infection rate for initial infections', () => {
    const universe = createUniverse({
      size: { width, height },
      unitProbability,
      infectionRate,
    });

    expect(universe[2][2] & State.ALIVE).toBe(State.ALIVE);
    expect(universe[2][2] & State.INFECTED).toBe(State.INFECTED);

    expect(universe[3][2] & State.ALIVE).toBe(State.ALIVE);
    expect(universe[3][2] & State.INFECTED).toBe(State.INFECTED);
  });
});

describe('.nextGeneration', () => {
  let universe;

  beforeEach(() => {
    universe = createUniverse({
      size: { width, height },
      unitProbability,
      infectionRate,
    });
  });

  it('should kill cells with fewer than two live neighbours', () => {
    expect(universe[0][3] & State.ALIVE).toBe(State.ALIVE);
    const newState = nextGeneration(universe, {});
    expect(newState[0][3] & State.DEAD).toBe(State.DEAD);
  });

  it('should kill cells with more than three live neighbours', () => {
    universe[0][3] = State.ALIVE;
    universe[1][3] = State.ALIVE;
    universe[1][2] = State.ALIVE;
    universe[1][4] = State.ALIVE;
    universe[2][3] = State.ALIVE;

    // Generated Grid
    // ==============
    // X|X|X|O|X|O|X|X|O|X
    // X|X|O|O|O|X|X|X|X|X
    // X|X|O|O|X|X|X|O|X|X
    // X|X|O|X|X|X|X|X|X|X
    // X|X|X|O|X|O|O|X|X|X

    const newState = nextGeneration(universe, {});
    expect(newState[0][3] & State.DEAD).toBe(State.DEAD);
    expect(newState[1][3] & State.DEAD).toBe(State.DEAD);
    expect(newState[1][2] & State.DEAD).toBe(State.DEAD);
    expect(newState[1][4] & State.DEAD).toBe(State.DEAD);
    expect(newState[2][3] & State.DEAD).toBe(State.DEAD);
  });

  it('should not kill cells with two or three live neighbours', () => {
    universe[0][2] = State.ALIVE;
    universe[0][3] = State.ALIVE;
    universe[3][1] = State.ALIVE;

    // Generated Grid
    // ==============
    // X|X|O|O|X|O|X|X|O|X
    // X|X|X|X|X|X|X|X|X|X
    // X|X|O|X|X|X|X|O|X|X
    // X|0|O|X|X|X|X|X|X|X
    // X|X|X|O|X|O|O|X|X|X

    const newState = nextGeneration(universe, {});
    expect(newState[0][3] & State.ALIVE).toBe(State.ALIVE);
    expect(newState[0][5] & State.ALIVE).toBe(State.ALIVE);
    expect(newState[3][1] & State.ALIVE).toBe(State.ALIVE);
  });

  it('should respawn dead cells with exactly three live neighbours', () => {
    // Generated Grid
    // ==============
    // X|X|X|O|X|O|X|X|O|X
    // X|X|X|X|X|X|X|X|X|X
    // X|X|O|X|X|X|X|O|X|X
    // X|X|O|X|X|X|X|X|X|X
    // X|X|X|O|X|O|O|X|X|X

    expect(universe[3][3] & State.DEAD).toBe(State.DEAD);
    expect(universe[3][6] & State.DEAD).toBe(State.DEAD);

    const newState = nextGeneration(universe, {});
    expect(newState[3][3] & State.ALIVE).toBe(State.ALIVE);
    expect(newState[3][6] & State.ALIVE).toBe(State.ALIVE);
  });

  it('should have a chance to kill infected cells', () => {
    expect(universe[3][2] & State.INFECTED).toBe(State.INFECTED);
    const newState = nextGeneration(universe, { infectionRate, deathRate });
    expect(newState[3][2]).toBe(State.DEAD);
  });

  it('should have a chance to infect neighbouring cells', () => {
    expect(universe[4][3] & State.INFECTED).toBe(0);
    const newState = nextGeneration(universe, { infectionRate });
    expect(newState[4][3] & State.INFECTED).toBe(State.INFECTED);
  });
});
