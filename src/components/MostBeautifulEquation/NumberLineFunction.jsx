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
  boundingbox: [-5, 4, 8, -5],
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

const NumberLineFunction = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    const board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    window.updateBoard = () => {
      board.update();
    }

    let pressed = false;
    let radio = board.create('text', [
      4, -3.2,
      `
        <input type="radio" name="funcId" value="0" onchange="window.updateBoard();" checked />Function 1<br/>
        <input type="radio" name="funcId" value="1" onchange="window.updateBoard();" />Function 2<br/>
        <input type="radio" name="funcId" value="2" onchange="window.updateBoard();" />Function 3<br/>
        <input type="radio" name="funcId" value="3" onchange="window.updateBoard();" />Function 4<br/>
        <input type="radio" name="funcId" value="4" onchange="window.updateBoard();" />Function 5<br/>
        `
    ], { fixed: true });

    radio.Value = () => {
      let opt = document.querySelector(`input[name=funcId]:checked`);
      return opt = (opt != null) ? parseInt(opt.value) : 0;
    };

    const functions = [
      x => x,
      x => Math.sin(x),
      x => x * x,
      x => x * x * x,
      x => Math.cos(x)
    ];

    const length = f => {
      if (f == 0 || f == 3) {
        return "full"
      } else if (f == 1 || f == 4) {
        return "unit"
      } else {
        return "half"
      }
    };

    let axisx = board.create('axis', [[0, 0], [1, 0]], {
      name: 'x',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [-10, 20]
      },
      visible: false,
      fixed: true,
      ticks: {
        visible: () => pressed,
        label: {
          visible: false
        },
        insertTicks: false,
        ticksDistance: 1
      },
      strokeWidth: 2
    });

    board.create('axis', [[0, 0], [0, 1]], {
      name: 'f(x)',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [-40, 0],
        visible: true
      },
      fixed: true,
      ticks: {
        visible: true,
        drawZero: true,
      },
      strokeWidth: 2
    });

    let fullLine = board.create('segment', [[0, -5], [0, 4]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      visible: () => !pressed
    });

    let halfLine = board.create('segment', [[0, 0], [0, 4]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      visible: () => !pressed
    });

    let unitLine = board.create('segment', [[0, -1], [0, 1]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      visible: () => !pressed
    });

    let functionObjects = [];

    for (let i = 0; i < functions.length; i++) {
      functionObjects.push(board.create('functiongraph', [functions[i]], {
        strokeColor: 'lightblue',
        strokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        highlightStrokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        fixed: true
      }));
    }

    let funcPoints = []

    for (let i = 0; i < functions.length; i++) {
      let funcPoint = board.create('glider', [
        0.0, 0.0,
        functionObjects[i]
      ], {
        name: '',
        color: 'pink',
        visible: () => pressed && radio.Value() == i,
      }
      );

      funcPoints.push(funcPoint);

      const funcPX = board.create('point', [() => funcPoint.X(), 0], { visible: false, fixed: true });
      const funcPY = board.create('point', [0, () => funcPoint.Y()], { visible: false, fixed: true });

      board.create('segment', [funcPoint, funcPX], {
        strokeColor: 'gray',
        strokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        highlightStrokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        dash: 2,
        fixed: true
      });

      board.create('segment', [funcPoint, funcPY], {
        strokeColor: 'gray',
        strokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        highlightStrokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
        dash: 2,
        fixed: true
      });
    }

    board.create('button', [
      3.8, 3,
      'The Button !!!',
      () => {
        pressed = !pressed;
        if (pressed) {
          axisx.show()
        } else {
          axisx.hide();
        }
        board.update();
      }
    ], {
      fixed: true
    });

    const fullPoint = board.create('glider', [
      0.0, 0.0,
      fullLine
    ], {
      name: '',
      color: 'pink',
      visible: () => !pressed && length(radio.Value()) == "full",
    });

    const fullPX = board.create('point', [() => fullPoint.X(), 0], { visible: false, fixed: true });
    const fullPY = board.create('point', [0, () => fullPoint.Y()], { visible: false, fixed: true });

    board.create('segment', [fullPoint, fullPX], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    board.create('segment', [fullPoint, fullPY], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    const halfPoint = board.create('glider', [
      0.0, 0.0,
      halfLine
    ], {
      name: '',
      color: 'pink',
      visible: () => !pressed && length(radio.Value()) == "half",
    }
    );

    const halfPX = board.create('point', [() => halfPoint.X(), 0], { visible: false, fixed: true });
    const halfPY = board.create('point', [0, () => halfPoint.Y()], { visible: false, fixed: true });

    board.create('segment', [halfPoint, halfPX], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    board.create('segment', [halfPoint, halfPY], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    const unitPoint = board.create('glider', [
      0.0, 0.0,
      unitLine
    ], {
      name: '',
      color: 'pink',
      visible: () => !pressed && length(radio.Value()) == "unit",
    }
    );

    const unitPX = board.create('point', [() => unitPoint.X(), 0], { visible: false, fixed: true });
    const unitPY = board.create('point', [0, () => unitPoint.Y()], { visible: false, fixed: true });

    board.create('segment', [unitPoint, unitPX], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    board.create('segment', [unitPoint, unitPY], {
      strokeColor: 'gray',
      strokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      dash: 2,
      fixed: true
    });

    for (let i = 0; i < funcPoints.length; i++) {
      let fPoint = funcPoints[i];
      fPoint.on('drag', () => {
        let l = length(radio.Value());
        if (l == "full") {
          fullPoint.moveTo([0, fPoint.Y()]);
        } else if (l == "half") {
          halfPoint.moveTo([0, fPoint.Y()]);
        } else if (l == "unit") {
          unitPoint.moveTo([0, fPoint.Y()]);
        }
      });
    }

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

export default NumberLineFunction;
