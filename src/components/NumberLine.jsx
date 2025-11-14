import { useEffect, useRef, useMemo } from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '100px',
  aspectRatio: '2',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-20, 1, 20, -0.15],
  showCopyright: false,
  showNavigation: false,
};

const NumberLineMulNegOneExample = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;
  
    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );


    var axisx = board.create('axis', [[0,0], [1,0]], 
      {
        firstArrow: true,
        lastArrow: true,
        ticks: {
          drawZero: true,
          ticksDistance: 1,
          majorHeight: 30,
          tickEndings: [1,1],
          minorTicks: 0
        },
        fixed: true
      });

    var point = board.create('glider', [5, 0, axisx], { name: '', color: 'crimson', fixed: true });

    board.create('button', [
      -20,
      () => board.getBoundingBox()[1] - 0.15,
      '⨯ (–1)',
      () => point.moveTo([-point.X(), point.Y()], 20),
      {}
    ]);
    board.create('button', [
      -20,
      () => board.getBoundingBox()[1] - 0.45,
      '⨯ (+1)',
      () => {},
      {}
    ]);

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

export default NumberLineMulNegOneExample;
