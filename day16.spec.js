const fs = require('fs-extra');

describe('part 1', () => {
  const cache = {};
  function dance(programs, move) {
    if (cache[programs + move]) {
      return cache[programs + move];
    }

    function getMove() {
      if (move[0] === 's') {
        const spin = parseInt(move.slice(1));
        return (_, i) =>
          programs[(programs.length + i - spin) % programs.length];
      } else if (move[0] === 'x') {
        const [i1String, i2String] = move.slice(1).split('/');
        const i1 = parseInt(i1String);
        const i2 = parseInt(i2String);
        return (p, i) =>
          i === i1 ? programs[i2] : i === i2 ? programs[i1] : p;
      } else if (move[0] === 'p') {
        const [p1, p2] = move.slice(1).split('/');
        return p => (p === p1 ? p2 : p === p2 ? p1 : p);
      }
      throw Error('wtf');
    }
    const result = programs
      .split('')
      .map(getMove())
      .join('');

    expect(programs.length).toBe(result.length);
    cache[programs + move] = result;
    return result;
  }

  function generatePrograms(n) {
    return Array(n)
      .fill(1)
      .map((_, i) => 'a'.charCodeAt(0) + i)
      .map(cc => String.fromCharCode(cc))
      .join('');
  }

  it('s1, a spin of size 1: eabcd.', () => {
    expect(dance('abcde', 's1')).toBe('eabcd');
  });

  it('x3/4, swapping the last two programs: eabdc.', () => {
    expect(dance('eabcd', 'x3/4')).toBe('eabdc');
  });

  it('pe/b, swapping programs e and b: baedc.', () => {
    expect(dance('eabdc', 'pe/b')).toBe('baedc');
  });

  it('should generate programs', () => {
    expect(generatePrograms(3)).toBe('abc');
  });

  async function getMoves() {
    const buffer = await fs.readFile('./day16.input.txt');
    const lines = buffer
      .toString()
      .split('\n')
      .filter(Boolean);

    expect(lines).toHaveLength(1);
    return lines[0].split(',');
  }

  it('should solve the example', async () => {
    console.log((await getMoves()).reduce(dance, generatePrograms(16)));
  });

  it('should solve the example', async () => {
    console.log((await getMoves()).reduce(dance, generatePrograms(16)));
  });

  it('should run n times', async () => {
    const cache = {};
    const moves = await getMoves();
    let hit = 0;

    const run = programs => {
      if (!cache[programs]) {
        cache[programs] = moves.reduce(dance, programs);
      } else {
        hit++;
      }
      return cache[programs];
    };
    let programs = generatePrograms(16);
    for (let i = 0; i < 1e9; i++) {
      programs = run(programs);
    }

    console.log(programs);
  });
});

describe('part 2', () => {
  function dance(programs, move) {
    if (move.type === 's') {
      const { spin } = move;
      programs = programs.map(
        (_, i) => programs[(programs.length + i - spin) % programs.length],
      );
    } else if (move.type === 'x') {
      const { i1, i2 } = move;
      const tmp = programs[i1];
      programs[i1] = programs[i2];
      programs[i2] = tmp;
    } else if (move.type === 'p') {
      const { p1, p2 } = move;
      programs.forEach((p, i) => {
        if (p === p1) {
          programs[i] = p2;
        } else if (p === p2) {
          programs[i] = p1;
        }
      });
    } else {
      throw Error('wtf');
    }
    return programs;
  }

  function generatePrograms(n) {
    return Array(n)
      .fill(1)
      .map((_, i) => 'a'.charCodeAt(0) + i)
      .map(cc => String.fromCharCode(cc));
  }

  it('s1, a spin of size 1: eabcd.', () => {
    expect(dance('abcde'.split(''), { type: 's', spin: 1 }).join('')).toBe(
      'eabcd',
    );
  });

  it('x3/4, swapping the last two programs: eabdc.', () => {
    expect(dance('eabcd'.split(''), { type: 'x', i1: 3, i2: 4 }).join('')).toBe(
      'eabdc',
    );
  });

  it('pe/b, swapping programs e and b: baedc.', () => {
    expect(
      dance('eabdc'.split(''), { type: 'p', p1: 'e', p2: 'b' }).join(''),
    ).toBe('baedc');
  });

  it('should generate programs', () => {
    expect(generatePrograms(3)).toEqual('abc'.split(''));
  });

  async function getMoves() {
    const buffer = await fs.readFile('./day16.input.txt');
    const lines = buffer
      .toString()
      .split('\n')
      .filter(Boolean);

    expect(lines).toHaveLength(1);
    return lines[0].split(',').map(move => {
      if (move[0] === 's') {
        const spin = parseInt(move.slice(1));
        return {
          type: 's',
          spin,
          move,
        };
      } else if (move[0] === 'x') {
        const [i1String, i2String] = move.slice(1).split('/');
        const i1 = parseInt(i1String);
        const i2 = parseInt(i2String);
        return {
          type: 'x',
          i1,
          i2,
          move,
        };
      } else if (move[0] === 'p') {
        const [p1, p2] = move.slice(1).split('/');
        return {
          type: 'p',
          p1,
          p2,
          move,
        };
      } else {
        throw Error('wtf');
      }
    });
  }

  const cache = {};

  function performTimes(moves, count) {
    const cache = {};
    let hit = 0;

    let programs = generatePrograms(16);

    const run = programs => {
      return cache[programs];
    };
    for (let i = 0; i < count; i++) {
      const cacheKey = programs.join('');
      if (!cache[cacheKey]) {
        moves.forEach(m => {
          programs = dance(programs, m);
        });
        cache[cacheKey] = programs.slice();
      } else {
        hit++;
        programs = cache[cacheKey];
      }
    }
    return programs;
  }

  it('should perform it n times', async () => {
    const moves = await getMoves();
    expect(performTimes(moves, 1)).toEqual('bijankplfgmeodhc'.split(''));
  });

  function toSeconds(diff) {
    return (diff[0] * 1e9 + diff[1]) / 1e9;
  }

  // Has some issues
  xit('should perform it billion times', async () => {
    const moves = await getMoves();
    const start = process.hrtime();
    const testCount = 1e9;
    const result = performTimes(moves, testCount);
    const diff = process.hrtime(start);
    const estimate = (toSeconds(diff) * (1e9 / testCount)).toFixed(3);
    const perSeconds = (testCount / toSeconds(diff)).toFixed(0);
    console.log(`Benchmark took  ${estimate} seconds ${perSeconds}`);
    console.log(result);
  });
});
