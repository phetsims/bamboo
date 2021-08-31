// Copyright 2020-2021, University of Colorado Boulder

/**
 * Copy/paste of GridLineSet that renders to canvas.  Note, these 2 files should be maintained together,
 * to keep as similar an API as possible.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';
import CanvasPainter from './CanvasPainter.js';

class CanvasGridLineSet extends CanvasPainter {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Orientation} axisOrientation - axis along which successive grid lines appear.  For example,
   *                                      - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param {number} spacing - in model coordinates
   * @param {Object} [options]
   */
  constructor( chartTransform, axisOrientation, spacing, options ) {

    options = merge( {
      origin: 0,
      clippingType: ClippingType.STRICT,

      // Path options
      stroke: 'black',
      lineDash: [ 1 ],
      lineWidth: 1,
      lineDashOffset: 0
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.clippingType = options.clippingType;

    // Path options
    this.stroke = options.stroke;
    this.lineDash = options.lineDash;
    this.lineWidth = options.lineWidth;
    this.lineDashOffset = options.lineDashOffset;
  }

  /**
   * @param {number} spacing
   * @public
   */
  setSpacing( spacing ) {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeGridLineSet();
    super.dispose();
  }

  // @public
  setLineDashOffset( lineDashOffset ) {
    this.lineDashOffset = lineDashOffset;
  }

  // @public @override
  paintCanvas( context ) {
    context.save();
    context.strokeStyle = this.stroke;
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.setLineDash( this.lineDash );
    context.lineDashOffset = this.lineDashOffset;

    this.chartTransform.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType,
      ( modelPosition, viewPosition ) => {

        if ( this.axisOrientation === Orientation.VERTICAL ) {
          context.moveTo( 0, viewPosition );
          context.lineTo( this.chartTransform.viewWidth, viewPosition );
        }
        else {
          context.moveTo( viewPosition, 0 );
          context.lineTo( viewPosition, this.chartTransform.viewHeight );
        }
      } );

    context.stroke();
    context.restore();
  }
}

bamboo.register( 'CanvasGridLineSet', CanvasGridLineSet );
export default CanvasGridLineSet;