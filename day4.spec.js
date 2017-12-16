const fs = require('fs-extra');

describe('part 1', () => {
  function solution(input) {
    const words = input.split(/\s+/);
    return words.every(w => words.filter(w2 => w === w2).length === 1);
  }
  it('should verify aa bb cc dd ee is valid.', () => {
    expect(solution('aa bb cc dd ee')).toBe(true);
  });

  it('should verify aa bb cc dd aa is not valid - the word aa appears more than once.', () => {
    expect(solution('aa bb cc dd aa')).toBe(false);
  });

  it('should verify aa bb cc dd aaa is valid - aa and aaa count as different words.', () => {
    expect(solution('aa bb cc dd aaa')).toBe(true);
  });

  it('should load the example', async () => {
    const buffer = await fs.readFile('./day4.input.txt');
    const lines = buffer
      .toString()
      .split('\n')
      .filter(Boolean);

    expect(lines).toHaveLength(512);
    console.log(lines.map(solution).reduce((sum, ok) => sum + (ok ? 1 : 0), 0));
  });
});

describe('part 2', () => {
  function solution(input) {
    const words = input.split(/\s+/);
    const wordsSorted = words.map(w =>
      w
        .split('')
        .sort()
        .join(''),
    );
    return wordsSorted.every(
      w => wordsSorted.filter(w2 => w === w2).length === 1,
    );
  }

  it('should verify abcde fghij is a valid passphrase.', () => {
    expect(solution('abcde fghij')).toBe(true);
  });

  it('should verify abcde xyz ecdab is not valid - the letters from the third word can be rearranged to form the first word.', () => {
    expect(solution('abcde xyz ecdab')).toBe(false);
  });

  it('should verify a ab abc abd abf abj is a valid passphrase, because all letters need to be used when forming another word.', () => {
    expect(solution('a ab abc abd abf abj')).toBe(true);
  });

  it('should verify iiii oiii ooii oooi oooo is valid.', () => {
    expect(solution('iiii oiii ooii oooi oooo')).toBe(true);
  });

  it('should verify oiii ioii iioi iiio is not valid - any of these words can be rearranged to form any other word.', () => {
    expect(solution('oiii ioii iioi iiio')).toBe(false);
  });

  it('should load the example', async () => {
    const buffer = await fs.readFile('./day4.input.txt');
    const lines = buffer
      .toString()
      .split('\n')
      .filter(Boolean);

    expect(lines).toHaveLength(512);
    console.log(lines.map(solution).reduce((sum, ok) => sum + (ok ? 1 : 0), 0));
  });
});
