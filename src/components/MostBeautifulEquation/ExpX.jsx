import { useEffect, useRef} from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '500px',
  aspectRatio: '4 / 3',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-6, 6, 2, -1],
  axis: true,
  fixed: true,
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
      name: 'x',
      withLabel: true,
      label: {
        position: 'rt',
        offset: [5, 15],
        anchorX: 'right'
      },
    },
    y: {
      withLabel: false,
    }
  }
};

const ExpX = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    var board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    const coeff = board.create('slider', [
      [-5, 5],
      [-3, 5],
      [0, 4, 10]
    ], {
      name: '· n',
      digits: 5,
      snapWidth: 0.67957,
      anchorY: 'bottom',
      moveOnUp: false,
      highline: {
        strokeColor: '#666666'
      },
      baseline: {
        strokeColor: '#666666'
      }
    });

    board.create('functiongraph', x => Math.exp(x), { strokeColor: 'lightblue', strokeWidth: 2 });
    board.create('functiongraph', x => Math.pow(coeff.Value(), x), { strokeColor: 'hotpink', dash: 2, strokeWidth: 2 });

    board.create('text', [
      -5, 4,
      '<span style="color: lightblue">exp (x)</span>'
    ], {
        fontSize: 18,
        fixed: true,
      }
    );

    board.create('text', [
      -5, 3,
      () => '<span style="color: hotpink">' + coeff.Value().toFixed(5) + '<sup>x</sup></span>'
    ], {
        fontSize: 18,
        fixed: true,
      }
    );

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

export default ExpX;
