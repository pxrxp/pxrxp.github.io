import { useEffect, useRef } from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '400px',
  aspectRatio: '1',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-2, 5, 9, -1],
  axis: true,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: false
  },
  zoom: {
    enabled: false
  },
};

const SlopeLine = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;
  
    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    board.defaultAxes.x.setAttribute({ ticks: { visible: false } });
    board.defaultAxes.y.setAttribute({ ticks: { visible: false } });

    const line = board.create('line', [[-1, 0], [1, 1]], { strokeColor: 'blue', strokeWidth: 2, fixed: true });

    const p1 = board.create('glider', [2, 2.2, line], { name: '', color: 'crimson', size: 3 });
    const p2 = board.create('glider', [6, 4.6, line], { name: '', color: 'crimson', size: 3 });

    const pCorner = board.create('point', [() => p2.X(), () => p1.Y()], { visible: false });

    board.create('polygon', [p1, pCorner, p2], {
        fillColor: 'orange',
        fillOpacity: 0.3,
        borders: { strokeWidth: 0 }
    });

    board.create('segment', [p1, pCorner], { strokeColor: 'black', dash: 1 });
    board.create('segment', [pCorner, p2], { strokeColor: 'black', dash: 1 });

    board.create('text', [
        () => (p1.X() + pCorner.X()) / 2,
        () => p1.Y(),
        'Run (Δx)'
    ], { anchorX: 'middle', anchorY: 'top', fontSize: 16 });

    board.create('text', [
        () => p2.X(),
        () => (pCorner.Y() + p2.Y()) / 2,
        '&nbsp; Rise (Δf)'
    ], { anchorX: 'left', anchorY: 'middle', fontSize: 16 });

    board.create('text', [
        4.2,2.7,
        'Slope',
    ], {
        rotate: 39.5,
        anchorX: 'right',
        anchorY: 'bottom',
        fontSize: 16
      }
    );

    const pX1 = board.create('point', [() => p1.X(), 0], { name: 'a', withLabel: true, color: 'gray', size: 1, label: { offset: [0, -15] } });
    const pY1 = board.create('point', [0, () => p1.Y()], { name: 'f(a)', withLabel: true, color: 'gray', size: 1, label: { offset: [-40, 0] } });
    board.create('segment', [p1, pX1], { strokeColor: 'gray', dash: 2, strokeWidth: 1 });
    board.create('segment', [p1, pY1], { strokeColor: 'gray', dash: 2, strokeWidth: 1 });

    const pX2 = board.create('point', [() => p2.X(), 0], { name: 'x', withLabel: true, color: 'gray', size: 1, label: { offset: [0, -15] } });
    const pY2 = board.create('point', [0, () => p2.Y()], { name: 'f(x)', withLabel: true, color: 'gray', size: 1, label: { offset: [-40, 0] } });
    board.create('segment', [p2, pX2], { strokeColor: 'gray', dash: 2, strokeWidth: 1 });
    board.create('segment', [p2, pY2], { strokeColor: 'gray', dash: 2, strokeWidth: 1 });

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

export default SlopeLine;
