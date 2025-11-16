import { useEffect, useRef } from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '799px',
  maxHeight: '300px',
  aspectRatio: '1',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-5, 2, 5, -2],
  axis: false,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: false
  },
  zoom: {
    enabled: false
  },
};

const TaylorExpansionSin = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    board.create('axis', [[0, 0], [1, 0]], {
      name: 'x',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [-10, 10]
      },
      fixed: true,
      ticks: { visible: false, fixed: true }
    });

    board.create('axis', [[0, 0], [0, 1]], {
      name: 'f(x) = sin x',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [-80, 0]
      },
      fixed: true,
      ticks: { visible: true, fixed: true, ticksPerLabel: 10 }
    });

    board.create('functiongraph', [
      t => Math.sin(t),
      -10, 10],
      { strokeColor: "lightblue", strokeWidth: 1.5 }
    );

    var s = board.create('slider',
      [[0.5, -1.7], [2, -1.7], [1, 1, 11]],
      {
        name: '· No. of terms',
        snapWidth: 1,
        digits: 0,
        anchorY: 'bottom',
        highline: {
          strokeColor: '#666666'
        },
        baseline: {
          strokeColor: '#666666'
        }
      }
    );

    const l = board.create('line', [[0, 0], [1, 0]], { visible: false });

    var a = board.create('glider', [0, 0, l], { name: 'a', color: 'pink' });

    board.create('functiongraph', [
      t => {
        var val = 0,
          n, c,
          sv = s.Value() + 1;

        for (n = 0; n < sv; n++) {
          if (n % 4 == 0) {
            c = Math.sin(a.X());
          } else if (n % 4 == 1) {
            c = Math.cos(a.X());
          } else if (n % 4 == 2) {
            c = -Math.sin(a.X());
          } else if (n % 4 == 3) {
            c = -Math.cos(a.X());
          }
          val = val + c * Math.pow(t - a.X(), n) / JXG.Math.factorial(n);
        }
        return val;
      },
      -10, 10], {
      strokeWidth: 1.5,
      strokeColor: 'hotpink'
    });

    const handleResize = () => {
      board.update();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      JSXGraph.freeBoard(board);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div ref={boardRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TaylorExpansionSin;
