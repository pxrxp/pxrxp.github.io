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

const TangentSin = () => {

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
      ticks: { visible: true, fixed: true, ticksPerLabel: 10, drawZero: true }
    });

    const f = x => Math.sin(x);
    const df = x => Math.cos(x);

    let plotDerivative = false;

    const curve = board.create('functiongraph', [f], {
      strokeColor: 'lightblue',
      strokeWidth: 2,
      fixed: true
    });

    const derivativeCurve = board.create('functiongraph', [df], {
      strokeColor: 'hotpink',
      strokeWidth: () => plotDerivative ? 2 : 0,
      highlightStrokeWidth: () => plotDerivative ? 2 : 0,
      fixed: true,
    });

    const tangencyPoint = board.create('glider', [0, f(0), curve], {
      name: '',
      size: 3,
      face: 'o',
      color: 'pink',
    });

    const tangentLine = board.create('tangent', [tangencyPoint], {
      strokeColor: 'gray',
      dash: 2
    });

    board.create('text', [
      0.5, -1.7,
      () => '<span style="color:hotpink">Slope</span> of <span style="color: gray">tangent</span> = ' + df(tangencyPoint.X()).toFixed(2)
    ], {
      fontSize: 14,
      fixed: true,
    });

    board.create('button', [
      -5, -1.7,
      'Plot the slope',
      () => plotDerivative = !plotDerivative
    ], {
      fixed: true
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

export default TangentSin;
