import { useEffect, useRef, useMemo } from 'react';
import { JSXGraph } from "jsxgraph";

const defaultContainerStyle = {
  width: '100%',
  maxWidth: '800px',
  aspectRatio: '4 / 3',
  margin: 'auto',
};

const defaultBoardConfig = {
  boundingbox: [-1, 2, 7, -2],
  axis: true,
  showCopyright: false,
  showNavigation: false,
};

const EqPlot = ({
  funcStrings = [],
  boardConfig = defaultBoardConfig,
  containerStyle = defaultContainerStyle
}) => {

  const boardRef = useRef(null);

  const functionsToPlot = useMemo(() => {
    return funcStrings
      .map(str => {
        try {
          return new Function('x', `return ${str}`);
        } catch (e) {
          console.error(`Error parsing function string: "${str}"`, e);
          return null;
        }
      })
      .filter(f => f !== null);
  }, [funcStrings]);

  useEffect(() => {
    if (!boardRef.current)
      return;
  
    var board = JSXGraph.initBoard(
      boardRef.current,
      {...defaultBoardConfig, ...boardConfig}
    );

    if (functionsToPlot && functionsToPlot.length > 0) {
      functionsToPlot.forEach(func => {
        board.create('functiongraph', func);
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
  }, [functionsToPlot, ]);

  return (
    <div style={{...defaultContainerStyle, ...containerStyle}}>
        <div ref={boardRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default EqPlot;
