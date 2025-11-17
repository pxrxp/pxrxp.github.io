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
  boundingbox: [-1.2, 1.2, 1.24, -1.2],
  axis: true,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: false
  },
  zoom: {
    enabled: false
  },
  defaultAxes: {
    x: {
      name: 'Re(z)',
      withLabel: true,
      ticks: {
        visible: false
      },
      label: {
        position: 'rt',
        offset: [13, 15],
        anchorX: 'right'
      }
    },
    y: {
      withLabel: true,
      name: 'Im(z)',
      ticks: {
        visible: false
      },
      label: {
        position: 'rt',
        offset: [-40, 10],
        anchorY: 'top'
      }
    }
  }
};

const IotaCycle = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    const center = board.create('point', [0.0, 0.0], { visible: false, fixed: true });
    const circle = board.create('circle', [center, 1.0], {
      strokeColor: 'lightblue',
      fixed: true
    });

    const point = board.create('glider', [
      1.0, 0.0,
      circle
    ], {
      name: '',
      color: 'pink',
      fixed: true
    }
    );

    window.changePlotType = () => {
      board.update();
    }

    const origin = board.create('point',
      [0, 0],
      {
        name: "",
        color: "pink",
        fixed: true
      }
    );
    const xOne = board.create('point', [1, 0], { visible: false, fixed: true });

    board.create('angle',
      [xOne, origin, point],
      {
        radius: 1,
        name: "",
        fixed: true,
        color: "pink"
      }
    );

    const defaultDuration = 300;

    board.create('button', [
      -1.2,
      0.9,
      '⨯ i',
      () => {
        let x = Math.round(point.X());
        let y = Math.round(point.Y());
        let angle = Math.atan2(y, x) + Math.PI/2;
       
        point.moveAlong([
          [point.X(), point.Y()],
          [Math.cos(angle), Math.sin(angle)],
        ], 2 * defaultDuration);
      }
    ], {
        fontSize: 14
      });

    board.create('text', [
      0.03, -0.9,
      "- i"
    ], {
        fontSize: 15
      }
    );

    board.create('text', [
      0.03, 0.9,
      "+ i"
    ], {
        fontSize: 15
      }
    );

    board.create('text', [
      0.9, -0.1,
      "1"
    ], {
        fontSize: 15
      }
    );

    board.create('text', [
      -0.95, -0.1,
      "-1"
    ], {
        fontSize: 15
      }
    );

    window.addEventListener('resize', () => board.update());

    return () => {
      window.removeEventListener('resize', () => board.update());
      JSXGraph.freeBoard(board);
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div ref={boardRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default IotaCycle;
