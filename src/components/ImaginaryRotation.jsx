
import { useEffect, useRef, useMemo } from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '800px',
  aspectRatio: '1',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-1.2, 1.2, 1.2, -1.2],
  axis: true,
  showCopyright: false,
  showNavigation: false,
  defaultAxes: {
    x: {
      name: 'Re(z)',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [-5, 15],
        anchorX: 'right'
      }
    },
    y: {
      withLabel: true,
      name: 'Im(z)',
      label: {
        position: 'rt',
        offset: [-40, -5],
        anchorY: 'top'
      }
    }
  }
};

const ReImRotExample = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    const center = board.create('point', [0.0, 0.0], { visible: false });
    const circle = board.create('circle', [center, 1.0], {
      fixed: true
    });

    const point = board.create('glider', [
      1.0, 0.0,
      circle
    ], {
      name: '',
      color: 'crimson',
      fixed: true
    }
    );

    const speed = board.create('slider', [
      [0.6, 1.1],
      [0.8, 1.1],
      [0.01, 1, 2]
    ], {
      name: '. Speed',
      snapWidth: 0.01
    });

    board.create('button', [
      -1.2,
      1.1,
      '⨯ (–1)',
      () => {
        let y_direction = point.X() > 0 ? 1.0 : -1.0;
        point.moveAlong([
          [point.X(), 0.0],
          [0.0, y_direction],
          [-point.X(), 0.0],
        ], 300 / speed.Value());
      }
    ]);
    board.create('button', [
      -1.2,
      0.9,
      '⨯ (+1)',
      () => {
        let y_direction = point.X() > 0 ? 1.0 : -1.0;
        point.moveAlong([
          [point.X(), 0.0],
          [0.0, y_direction],
          [-point.X(), 0.0],
          [0.0, -y_direction],
          [point.X(), 0.0],
        ], 2 * 300 / speed.Value());
      }
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

export default ReImRotExample;
