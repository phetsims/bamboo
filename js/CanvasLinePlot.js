// Copyright 2019-2020, University of Colorado Boulder

/**
 * CanvasLinePlot renders line plots of one or more data sets using Canvas, for performance.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import CanvasNode from '../../scenery/js/nodes/CanvasNode.js';
import bamboo from './bamboo.js';

class CanvasLinePlot extends CanvasNode {

  /**
   * @param {ChartModel} chartModel
   * @param {Vector2[][]} dataSets
   * @param {Object} [options]
   */
  constructor( chartModel, dataSets, options ) {

    options = options || {};

    assert && assert( !options.canvasBounds, 'CanvasLinePlot sets canvasBounds' );
    options.canvasBounds = new Bounds2( 0, 0, chartModel.width, chartModel.height );

    super( options );

    // @private
    this.chartModel = chartModel;

    // @public if you change this directly, you are responsible for calling update
    this.dataSets = dataSets;

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeCanvasLinePlot = () => {
      chartModel.link( update );
    };
  }

  /**
   * Sets the data sets and redraws the chart.
   * @param {Vector2[][]}dataSets
   * @public
   */
  setDataSets( dataSets ) {
    this.dataSets = dataSets;
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
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 0.1;

    this.dataSets.forEach( dataSet => {
      for ( let i = 0; i < dataSet.length; i++ ) {
        const point = this.chartModel.modelToViewPosition( dataSet[ i ] );
        i === 0 && context.moveTo( point.x, point.y );
        i !== 0 && context.lineTo( point.x, point.y );
      }
    } );

    context.stroke();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeCanvasLinePlot();
    super.dispose();
  }
}

bamboo.register( 'CanvasLinePlot', CanvasLinePlot );
export default CanvasLinePlot;