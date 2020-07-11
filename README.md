Try It Out!
===========
The latest build can be found on https://robthefivenine.github.io/game-of-life-covid-edition

What is Game of Life?
=====================
The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
        
1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

1. Any live cell with two or three live neighbours survives.
2. Any dead cell with three live neighbours becomes a live cell.
3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations.

What is Different About This Version?
=====================================
I have added the posibility for cells to develop or catch a contagious virus, which can also lead to their death. Infected cells are displayed on the grid as green cells and can spread the infection to any of the eight neighbouring cells.

Building Source
===============
To build the source code, ensure that you have [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed and follow these steps:

1. Clone this repository: `git clone https://github.com/RobTheFiveNine/game-of-life-covid-edition.git`
2. Install the dependencies: `cd game-of-life-covid-edition && yarn`
3. Run the build script `yarn build`

After following these steps, the final build will be in the `build/` directory.

License
=======
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see https://www.gnu.org/licenses/.