// Copyright 2020-2021, University of Colorado Boulder

/**
 * ChartCanvasNode renders to a canvas. It is usually preferable to use the other scenery Node-based
 * renderers, but this one can be necessary for performance-critical charts.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import CanvasNode from '../../scenery/js/nodes/CanvasNode.js';
import bamboo from './bamboo.js';

class ChartCanvasNode extends CanvasNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {CanvasPainter[]} painters
   * @param {Object} [options]
   */
  constructor( chartTransform, painters, options ) {

    options = options || {};

    assert && assert( !options.canvasBounds, 'ChartCanvasNode sets canvasBounds' );
    options.canvasBounds = new Bounds2( 0, 0, chartTransform.viewWidth, chartTransform.viewHeight );

    super( options );

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update
    this.painters = painters;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeChartCanvasLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the painters and redraws the chart.
   * @param {CanvasPainter[]} painters
   * @public
   */
  setPainters( painters ) {
    this.painters = painters;
    this.update();
  }

  // @public
  update() {
    this.invalidatePaint();
  }

  /**
   * Used to redraw the CanvasNode. Use CanvasNode.invalidatePaint to signify that it is time to redraw the canvas.
   * @protected
   * @override
   *
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas( context ) {
    this.painters.forEach( painter => {
      if ( painter.visible ) {
        painter.paintCanvas( context );
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeChartCanvasLinePlot();
    super.dispose();
  }
}

bamboo.register( 'ChartCanvasNode', ChartCanvasNode );
export default ChartCanvasNode;