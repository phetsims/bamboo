// Copyright 2020-2021, University of Colorado Boulder

/**
 * CanvasLinePlot renders a {Array.<Vector2|null>} dataSet on a canvas that is managed by a ChartCanvasNode.
 * Typically it is preferable to use LinePlot, but this alternative is provided for cases where canvas must be
 * used for performance. Like LinePlot, null values are skipped, and allow you to create gaps in a plot.
 * @see LinePlot
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Color from '../../scenery/js/util/Color.js';
import bamboo from './bamboo.js';
import CanvasPainter from './CanvasPainter.js';

class CanvasLinePlot extends CanvasPainter {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Array.<Vector2|null>} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {
      stroke: 'black', // {Color|string|null}
      lineWidth: 1
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
    this.dataSet = dataSet;

    // @public if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
    this.lineWidth = options.lineWidth;

    // @private - CSS for rendering the stroke
    this.strokeCSS = null; // updated in setStroke
    this.setStroke( options.stroke );
  }

  /**
   * Sets the stroke.
   * @param {Color|string|null} stroke - If you call setStroke, you are responsible for calling update on the associated ChartCanvasNode(s).
   * @public
   */
  setStroke( stroke ) {
    assert && assert( stroke instanceof Color || ( typeof stroke === 'string' && Color.isCSSColorString( stroke ) ) || stroke === null, 'invalid stroke' );
    this.strokeCSS = stroke instanceof Color ? stroke.toCSS() : stroke;
  }

  // @public - see setStroke()
  set stroke( stroke ) {
    this.setStroke( stroke );
  }

  // @public
  dispose() {
    assert && assert( !this.isDisposed, 'already disposed' );
    this.isDisposed = true;
  }

  /**
   * Sets dataSet. You are responsible for calling update on the associated ChartCanvasNode(s).
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
  }

  /**
   * Intended to be called by ChartCanvasNode.
   * @param {CanvasRenderingContext2D} context
   * @public
   */
  paintCanvas( context ) {
    context.beginPath();

    if ( this.strokeCSS ) {
      context.strokeStyle = this.strokeCSS;
      context.lineWidth = this.lineWidth;

      let moveToNextPoint = true;

      // Only access the data set length once for performance
      const length = this.dataSet.length;
      for ( let i = 0; i < length; i++ ) {

        const dataPoint = this.dataSet[ i ];
        assert && assert( dataPoint === null || dataPoint.isFinite(), 'data points must be finite Vector2 or null' );

        // Draw a line segment to the next non-null value. Null values result in a gap (via move) in the plot.
        if ( dataPoint ) {
          const viewPoint = this.chartTransform.modelToViewPosition( dataPoint );
          if ( moveToNextPoint ) {
            context.moveTo( viewPoint.x, viewPoint.y );
            moveToNextPoint = false;
          }
          else {
            context.lineTo( viewPoint.x, viewPoint.y );
          }
        }
        else {
          moveToNextPoint = true;
        }
      }
      context.stroke();
    }
  }
}

bamboo.register( 'CanvasLinePlot', CanvasLinePlot );
export default CanvasLinePlot;