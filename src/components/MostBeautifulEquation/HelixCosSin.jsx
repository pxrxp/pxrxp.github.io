import { useEffect, useRef } from 'react';
import { JSXGraph } from "jsxgraph";

const containerStyle = {
  width: '100%',
  maxWidth: '800px',
  maxHeight: '800px',
  aspectRatio: '1',
  margin: 'auto',
};

const boardConfig = {
  boundingbox: [-2, 2, 2, -2],
  axis: false,
  fixed: true,
  showCopyright: false,
  showNavigation: false,
  pan: {
    enabled: false
  },
  zoom: {
    enabled: false
  },
};

const HelixCosSin = () => {

  const boardRef = useRef(null);

  useEffect(() => {
    if (!boardRef.current)
      return;

    const board = JSXGraph.initBoard(
      boardRef.current,
      boardConfig
    );

    const masterSlider = board.create('slider', [
      [-1.8, -1.3],
      [0, -1.3],
      [0, 2, 10]
    ], {
      label: {
        visible: false,
      },
      moveOnUp: false,
      anchorY: 'bottom',
      highline: {
        strokeColor: '#666666'
      },
      baseline: {
        strokeColor: '#666666'
      }
    });

    const figureName = sliderVal => {
      let slider = Math.min(Math.max(sliderVal, 0), 9);
      if (slider >= 8.67) {
        return "cos(x)";
      } else if (slider >= 7.00) {
        return "Helix";
      } else if (slider >= 4.00) {
        return "Unit Circle";
      } else if (slider >= 1.39) {
        return "Helix";
      } else {
        return "sin(x)"
      }
    }

    board.create('text', [
      0.3, -1.3,
      () => '<span style="color:hotpink">' + figureName(masterSlider.Value()) + '</span>'
    ], {
      fontSize: 18,
      fixed: true,
    });

    const azimuth = sliderVal => {
      let slider = Math.min(Math.max(sliderVal, 0), 9);
      let s, start, end;
      if (slider > 8) {
        s = slider - 8;
        start = 6.56;
        end = 6.28;
      } else if (slider > 7) {
        s = slider - 7;
        start = 6.46;
        end = 6.56;
      } else if (slider > 6) {
        s = slider - 6;
        start = 6.48;
        end = 6.46;
      } else if (slider > 5) {
        s = slider - 5;
        start = 4.88;
        end = 6.46;
      } else if (slider > 4) {
        s = slider - 4;
        start = 4.88;
        end = 4.88;
      } else if (slider > 3) {
        s = slider - 3;
        start = 4.98;
        end = 4.88;
      } else if (slider > 2) {
        s = slider - 2;
        start = 4.98;
        end = 4.98;
      } else if (slider > 1) {
        s = slider - 1;
        start = 4.71;
        end = 4.98;
      } else {
        s = slider;
        start = 4.71;
        end = 4.71;
      }
      return start + (end - start) * s;
    };

    const elevation = sliderVal => {
      let slider = Math.min(Math.max(sliderVal, 0), 9);
      let s, start, end;
      if (slider > 8) {
        s = slider - 8;
        start = 0.67;
        end = 0.00;
      } else if (slider > 7) {
        s = slider - 7;
        start = 1.57;
        end = 0.67;
      } else if (slider > 6) {
        s = slider - 6;
        start = 1.57;
        end = 1.57;
      } else if (slider > 5) {
        s = slider - 5;
        start = 1.57;
        end = 1.57;
      } else if (slider > 4) {
        s = slider - 4;
        start = 1.57;
        end = 1.57;
      } else if (slider > 3) {
        s = slider - 3;
        start = 0.67;
        end = 1.57;
      } else if (slider > 2) {
        s = slider - 2;
        start = 0.67;
        end = 0.67;
      } else if (slider > 1) {
        s = slider - 1;
        start = 0.00;
        end = 0.67;
      } else {
        s = slider;
        start = 0.00;
        end = 0.00;
      }
      return start + (end - start) * s;
    };

    const banking = sliderVal => {
      let slider = Math.min(Math.max(sliderVal, 0), 9);
      let s, start, end;
      if (slider > 6) {
        s = slider - 6;
        start = 1.575;
        end = 1.575;
      } else if (slider > 5) {
        s = slider - 5;
        start = 1.75;
        end = 1.575;
      } else if (slider > 4) {
        s = slider - 4;
        start = 1.75;
        end = 1.75;
      } else if (slider > 3) {
        s = slider - 3;
        start = 1.75;
        end = 1.75;
      } else if (slider > 2) {
        s = slider - 2;
        start = 1.75;
        end = 1.75;
      } else if (slider > 1) {
        s = slider - 1;
        start = 1.575;
        end = 1.75;
      } else {
        s = slider;
        start = 1.575;
        end = 1.575;
      }
      return start + (end - start) * s;
    };

    let view = board.create('view3d',
      [
        [-0.3, -0.8], [2., 2],
        [
          [-1.22, 1.22],
          [-1.22, 1.22],
          [0, 2 * Math.PI],
        ]
      ], {
      projection: 'parallel',
      xAxis: { strokeColor: 'red', strokeWidth: 1.5 },
      yAxis: { strokeColor: 'green', strokeWidth: 1.5 },
      zAxis: { strokeColor: 'blue', strokeWidth: 1.5 },

      bank: {
        pointer: {
          enabled: false,
        },
        keyboard: {
          enabled: false,
        },
        continuous: false,
        slider: {
          visible: false,
          start: banking(masterSlider.Value()),
        }
      },
      az: {
        pointer: {
          enabled: false,
        },
        keyboard: {
          enabled: false,
        },
        continuous: false,
        slider: {
          visible: false,
          start: azimuth(masterSlider.Value()),
        }
      },
      el: {
        pointer: {
          enabled: false,
        },
        keyboard: {
          enabled: false,
        },
        continuous: false,
        slider: {
          visible: false,
          start: elevation(masterSlider.Value()),
        }
      },

      xPlaneFront: {
        visible: true,
        fillColor: 'violet',
      },
      xPlaneRear: {
        visible: false,
      },
      yPlaneRear: {
        visible: true,
        fillColor: 'yellowgreen',
      },
      zPlaneRear: {
        visible: true,
        fillColor: 'lightblue'
      },

      verticaldrag: {
        enabled: false,
      },

      xPlaneFrontYAxis: { visible: false },
      xPlaneFrontZAxis: { visible: false },
      yPlaneRearXAxis: { visible: false },
      yPlaneRearZAxis: { visible: false },
      zPlaneRearXAxis: { visible: false },
      zPlaneRearYAxis: { visible: false }
    });

    var curve = view.create('curve3d', [
      t => Math.cos(3 * t),
      t => Math.sin(3 * t),
      t => t,
      [-2 * Math.PI + Math.PI / 2, 3 * Math.PI - Math.PI / 2]
    ], {
      strokeWidth: 4,
      strokeColor: 'hotpink'
    });

    masterSlider.on('drag', () => {
      let masterValue = masterSlider.Value();
      view.az_slide.setValue(azimuth(masterValue));
      view.el_slide.setValue(elevation(masterValue));
      view.bank_slide.setValue(banking(masterValue));
      view.update();
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

export default HelixCosSin;
