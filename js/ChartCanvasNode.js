// Copyright 2019-2020, University of Colorado Boulder

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
   * @param {ChartModel} chartModel
   * @param {CanvasPainter[]} painters
   * @param {Object} [options]
   */
  constructor( chartModel, painters, options ) {

    options = options || {};

    assert && assert( !options.canvasBounds, 'ChartCanvasNode sets canvasBounds' );
    options.canvasBounds = new Bounds2( 0, 0, chartModel.width, chartModel.height );

    super( options );

    // @private
    this.chartModel = chartModel;

    // @public if you change this directly, you are responsible for calling update
    this.painters = painters;

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeChartCanvasLinePlot = () => chartModel.unlink( update );
  }

  /**
   * Sets the painters and redraws the chart.
   * @param {CanvasPainter} painters
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
    this.painters.forEach( painter => painter.paintCanvas( context ) );
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