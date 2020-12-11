// Copyright 2020, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] on a canvas. Typically it is preferable to use LinePlot, but this alternative
 * is provided for cases where canvas must be used for performance.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import bamboo from './bamboo.js';
import CanvasPainter from './CanvasPainter.js';

class ChartCanvasLinePlot extends CanvasPainter {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {
      stroke: 'black',
      lineWidth: 1
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
    this.dataSet = dataSet;
    this.stroke = options.stroke;
    this.lineWidth = options.lineWidth;
  }

  /**
   * Sets dataSet. You are responsible for calling update on the ChartCanvasNode
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
  }

  // @public
  paintCanvas( context ) {
    context.beginPath();
    context.strokeStyle = this.stroke;
    context.lineWidth = this.lineWidth;

    for ( let i = 0; i < this.dataSet.length; i++ ) {
      const point = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
      i === 0 && context.moveTo( point.x, point.y );
      i !== 0 && context.lineTo( point.x, point.y );
    }
    context.stroke();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeLinePlot();
    super.dispose();
  }
}

bamboo.register( 'ChartCanvasLinePlot', ChartCanvasLinePlot );
export default ChartCanvasLinePlot;