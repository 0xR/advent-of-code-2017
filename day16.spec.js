const fs = require('fs-extra');

describe('part 1', () => {
  function dance(programs, move) {
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

  it('should solve the example', async () => {
    const buffer = await fs.readFile('./day16.input.txt');
    const lines = buffer
      .toString()
      .split('\n')
      .filter(Boolean);

    expect(lines).toHaveLength(1);
    const moves = lines[0].split(',');
    console.log(moves.reduce(dance, generatePrograms(16)));
  });
});
