// Copyright 2020, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] on a canvas. Typically it is preferable to use LinePlot, but this alternative
 * is provided for cases where canvas must be used for performance.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import ColorDef from '../../scenery/js/util/ColorDef.js';
import bamboo from './bamboo.js';
import CanvasPainter from './CanvasPainter.js';

class CanvasLinePlot extends CanvasPainter {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {
      stroke: 'black', // {ColorDef}
      lineWidth: 1
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
    this.dataSet = dataSet;

    // @private
    this._stroke = null;

    // @private {string} - cache values of CSS so they don't need to be recomputed at each paint
    this._strokeCSS = null;

    // @private
    this.colorListener = () => {
      this._strokeCSS = ColorDef.toCSS( this._stroke );
      assert && assert( this._strokeCSS === null || typeof this._strokeCSS === 'string' );
    };

    this.setStroke( options.stroke );

    // @public if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
    this.lineWidth = options.lineWidth;
  }

  // @public - Sets the stroke. You are responsible for calling update on the associated ChartCanvasNode(s).
  setStroke( stroke ) {
    assert && assert( ColorDef.isColorDef( stroke ), 'must be a ColorDef' );
    ColorDef.unlink( this._stroke, this.colorListener );
    this._stroke = stroke;
    ColorDef.link( this._stroke, this.colorListener ); // caches the new color CSS
  }

  // @public - see setStroke()
  set stroke( stroke ) {
    this.setStroke( stroke );
  }

  // @public
  dispose() {
    assert && assert( !this.isDisposed, 'already disposed' );
    ColorDef.unlink( this._stroke, this.colorListener );
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
    assert && assert( this._strokeCSS === null || typeof this._strokeCSS === 'string', 'stroke must be a CSS string or null' );
    if ( this._strokeCSS !== null ) {
      context.beginPath();
      context.strokeStyle = this._strokeCSS;
      context.lineWidth = this.lineWidth;

      for ( let i = 0; i < this.dataSet.length; i++ ) {
        const point = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
        i === 0 && context.moveTo( point.x, point.y );
        i !== 0 && context.lineTo( point.x, point.y );
      }
      context.stroke();
    }
  }
}

bamboo.register( 'CanvasLinePlot', CanvasLinePlot );
export default CanvasLinePlot;