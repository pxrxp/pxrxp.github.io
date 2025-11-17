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

    let pressed = false;
    let radio = board.create('text', [
      5.2, -3.2,
      `
        <input type="radio" name="plotType" value="0" onchange="window.updateBoard();" checked />Function 1<br/>
        <input type="radio" name="plotType" value="1" onchange="window.updateBoard();" />Function 2<br/>
        <input type="radio" name="plotType" value="2" onchange="window.updateBoard();" />Function 3<br/>
        <input type="radio" name="plotType" value="3" onchange="window.updateBoard();" />Function 4<br/>
        <input type="radio" name="plotType" value="4" onchange="window.updateBoard();" />Function 5<br/>
        `
    ], { fixed: true });

    radio.Value = () => {
      let opt = document.querySelector(`input[name=plotType]:checked`);
      return opt = (opt != null) ? parseInt(opt.value) : 0;
    };

    const functions = [
      x => x,
      x => Math.sin(x),
      x => x*x,
      x => x*x*x,
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
        fixed: true
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

    board.create('segment', [[0, -5], [0, 4]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "full") ? 2 : 0,
      visible: () => !pressed
    });

    board.create('segment', [[0, 0], [0, 4]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "half") ? 2 : 0,
      visible: () => !pressed
    });

    board.create('segment', [[0, -1], [0, 1]], {
      strokeColor: 'lightblue',
      strokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      highlightStrokeWidth: () => (!pressed && length(radio.Value()) == "unit") ? 2 : 0,
      visible: () => !pressed
    });

    for (let i = 0; i < functions.length; i++) {
      board.create('functiongraph', [functions[i]], {
          strokeColor: 'lightblue',
          strokeWidth: () => (pressed && radio.Value() == i) ? 2 : 0,
          highlightStrokeWidth: () => (pressed && radio.Value() == f) ? 2 : 0,
          fixed: true
      });
    }

    board.create('button', [
      5, 3,
      'The Button !!!',
      () => {
        pressed = !pressed;
        if (pressed) {
          axisx.show()
        } else {
          axisx.hide();
        }
      }
    ], {
      fixed: true
    });

    window.updateBoard = () => {
      board.update();
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
