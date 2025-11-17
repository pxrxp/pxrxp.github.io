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
      label: {
        position: 'rt',
        offset: [13, 15],
        anchorX: 'right'
      }
    },
    y: {
      withLabel: true,
      name: 'Im(z)',
      label: {
        position: 'rt',
        offset: [-40, 10],
        anchorY: 'top'
      }
    }
  }
};

const ReImRot = () => {

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

    window.updateBoard = () => {
      board.update();
    }

    var radio = board.create('text', [
      -1.19, -0.95,
      `
        <input type="radio" name="plotType" value="Cartesian" onchange="window.updateBoard();" checked />Cartesian<br/>
        <input type="radio" name="plotType" value="Polar" onchange="window.updateBoard();" />Polar<br/>
        `
    ], { fixed: true });

    radio.Value = () => {
      let opt = document.querySelector(`input[name=plotType]:checked`);
      return opt = (opt != null) ? opt.value : "";
    };

    board.create('text', [
      0.65, -0.95,
      () => {
        const x = point.X().toFixed(2);
        const y = point.Y();

        if (radio.Value() == "Cartesian") {
          if (y >= 0) {
            return x + ' + i ' + y.toFixed(2);
          } else {
            return x + ' - i ' + Math.abs(y).toFixed(2);
          }
        } else if (radio.Value() == "Polar") {
          let angle = (Math.atan2(y, x) * 180) / Math.PI;
          angle = angle < 0.0 ? angle + 360.0 : angle;
          return '1.00∠' + angle.toFixed(2) + '°';
        }
        return '';
      }
    ], {
      fontSize: 14,
      fixed: true,
    });

    const pX = board.create('point', [() => point.X(), 0], { visible: false, fixed: true });
    const pY = board.create('point', [0, () => point.Y()], { visible: false, fixed: true });

    const origin = board.create('point',
      [0, 0],
      {
        name: "",
        color: "pink",
        visible: () => radio.Value() == "Polar",
        fixed: true
      }
    );
    const xOne = board.create('point', [1, 0], { visible: false, fixed: true });

    board.create('angle',
      [xOne, origin, point],
      {
        radius: () => radio.Value() == "Polar" ? 1 : 0,
        name: "",
        fixed: true,
        color: "pink"
      }
    );

    board.create('segment', [point, pX], {
      strokeColor: 'gray',
      strokeWidth: () => radio.Value() == "Cartesian" ? 1 : 0,
      dash: 2,
      fixed: true
    });

    board.create('segment', [point, pY], {
      strokeColor: 'gray',
      strokeWidth: () => radio.Value() == "Cartesian" ? 1 : 0,
      dash: 2,
      fixed: true
    });

    const speed = board.create('slider', [
      [0.3, 1.15],
      [0.6, 1.15],
      [0.01, 1, 3]
    ], {
      name: '· Speed',
      snapWidth: 0.01,
      anchorY: 'bottom',
      highline: {
        strokeColor: '#666666'
      },
      baseline: {
        strokeColor: '#666666'
      }
    });
    const defaultDuration = 1200;

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
        ], defaultDuration / speed.Value());
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
        ], 2 * defaultDuration / speed.Value());
      }
    ]);

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

export default ReImRot;
