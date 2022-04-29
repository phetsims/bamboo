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
import CanvasPainter from './CanvasPainter.js';
import ChartTransform from './ChartTransform.js';
import ClippingType from './ClippingType.js';

class CanvasGridLineSet extends CanvasPainter {
  private readonly chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly origin: number;
  private readonly clippingType: ClippingType;
  private readonly stroke: any;
  private readonly lineDash: number[];
  private readonly lineWidth: number;
  private lineDashOffset: number;

  /**
   * @param chartTransform
   * @param axisOrientation - axis along which successive grid lines appear.  For example,
   *                        - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param spacing - in model coordinates
   * @param [options]
   */
  constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number, options?: any ) {

    options = merge( {
      origin: 0,
      clippingType: 'strict',

      // Path options
      stroke: 'black',
      lineDash: [ 1 ],
      lineWidth: 1,
      lineDashOffset: 0
    }, options );

    super();

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

  setSpacing( spacing: number ): void {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
    }
  }

  setLineDashOffset( lineDashOffset: number ): void {
    this.lineDashOffset = lineDashOffset;
  }

  paintCanvas( context: CanvasRenderingContext2D ): void {
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
  }
}

bamboo.register( 'CanvasGridLineSet', CanvasGridLineSet );
export default CanvasGridLineSet;