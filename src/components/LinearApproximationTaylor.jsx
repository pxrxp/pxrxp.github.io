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
  boundingbox: [-5, 5, 5, -5],
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

const LinearApproximationTaylor = () => {

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
      ticks: { visible: false, fixed: true }
    });

    board.create('axis', [[0, 0], [0, 1]], {
      name: 'f(x)',
      withLabel: true, 
      label: {
          position: 'rt',
          offset: [-30, 0]
      },
      ticks: { visible: false, fixed: true }
    });

    const f = x => 0.1 * x**3 - 0.5 * x + 1;
    const df = x => 0.3 * x**2 - 0.5;

    const curve = board.create('functiongraph', [f], {
        strokeColor: 'blue',
        strokeWidth: 2,
        fixed: true
    });

    const tangencyPoint = board.create('glider', [1.5, f(1.5), curve], {
        name: '',
        size: 3,
        face: 'o',
        color : 'black',
    });

    const tangentLine = board.create('tangent', [tangencyPoint], {
        strokeColor: 'gray',
        dash: 2
    });

    const pX = board.create('point', [() => tangencyPoint.X(), 0], { name: 'a', withLabel: true, color: 'gray', size: 1, label: { offset: [0, -15] } });
    board.create('segment', [tangencyPoint, pX], { strokeColor: 'lightgray', dash: 2, strokeWidth: 1 });

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

export default LinearApproximationTaylor;
