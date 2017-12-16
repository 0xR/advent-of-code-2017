describe('solution 1', () => {
  const up = [0, 1];
  const down = [0, -1];
  const right = [1, 0];
  const left = [-1, 0];

  function solution(input) {
    let i = 1;
    const visited = {};
    let currentLocation = [0, 0];
    let direction = 'right';

    function visit(location) {
      visited[location.join(',')] = true;
    }

    function visitedLocation(location) {
      return visited[location.join(',')];
    }

    function relativeLocation([dx, dy]) {
      const [x, y] = currentLocation;

      return [x + dx, y + dy];
    }

    function visitedRelative(delta) {
      return visitedLocation(relativeLocation(delta));
    }

    function canGoRight() {
      return !visitedRelative(right);
    }

    while (i < input) {
      visit(currentLocation);
      if (direction == 'right') {
        currentLocation = relativeLocation(right);
        if (!visitedRelative(up)) {
          direction = 'up';
        }
      } else if (direction === 'up') {
        currentLocation = relativeLocation(up);
        if (!visitedRelative(left)) {
          direction = 'left';
        }
      } else if (direction === 'left') {
        currentLocation = relativeLocation(left);
        if (!visitedRelative(down)) {
          direction = 'down';
        }
      } else if (direction === 'down') {
        currentLocation = relativeLocation(down);
        if (!visitedRelative(right)) {
          direction = 'right';
        }
      }
      i++;
    }

    return Math.abs(currentLocation[0]) + Math.abs(currentLocation[1]);
  }

  it("Data from square 1 is carried 0 steps, since it's at the access port.", () => {
    expect(solution(1)).toBe(0);
  });

  it('Data from square 12 is carried 3 steps, such as: down, left, left.', () => {
    expect(solution(12)).toBe(3);
  });

  it('Data from square 23 is carried only 2 steps: up twice.', () => {
    expect(solution(23)).toBe(2);
  });

  it('Data from square 1024 must be carried 31 steps.', () => {
    expect(solution(1024)).toBe(31);
  });

  it('should get the answer to the question', () => {
    console.log(solution(277678));
  });
});

describe('solution 2', () => {
  const up = [0, 1];
  const down = [0, -1];
  const right = [1, 0];
  const left = [-1, 0];

  function solution(input) {
    const visited = {};
    let currentLocation = [0, 0];
    let direction = 'right';
    let i = 1;

    function visit(location) {
      visited[location.join(',')] = i;
    }

    function locationValue(location) {
      return visited[location.join(',')] || 0;
    }

    function visitedLocation(location) {
      return locationValue(location) !== 0;
    }

    function relativeLocation([dx, dy]) {
      const [x, y] = currentLocation;

      return [x + dx, y + dy];
    }

    function visitedRelative(delta) {
      return visitedLocation(relativeLocation(delta));
    }

    function valueRelative(delta) {
      return locationValue(relativeLocation(delta));
    }

    function canGoRight() {
      return !visitedRelative(right);
    }

    function neighbourSum() {
      return (
        valueRelative(up) +
        valueRelative(down) +
        valueRelative(right) +
        valueRelative(left) +
        valueRelative([1, 1]) +
        valueRelative([1, -1]) +
        valueRelative([-1, -1]) +
        valueRelative([-1, 1])
      );
    }

    while (i < input) {
      visit(currentLocation);
      if (direction == 'right') {
        currentLocation = relativeLocation(right);
        if (!visitedRelative(up)) {
          direction = 'up';
        }
      } else if (direction === 'up') {
        currentLocation = relativeLocation(up);
        if (!visitedRelative(left)) {
          direction = 'left';
        }
      } else if (direction === 'left') {
        currentLocation = relativeLocation(left);
        if (!visitedRelative(down)) {
          direction = 'down';
        }
      } else if (direction === 'down') {
        currentLocation = relativeLocation(down);
        if (!visitedRelative(right)) {
          direction = 'right';
        }
      }
      i = neighbourSum() || 1;
    }

    return i;
  }

  it('should return 122 for input 60', () => {
    expect(solution(60)).toBe(122);
  });

  it('should calculate the solution', () => {
    console.log(solution(277678));
  });
});
