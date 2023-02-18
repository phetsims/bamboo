// Copyright 2020-2023, University of Colorado Boulder

/**
 * Copy/paste of GridLineSet that renders to canvas.  Note, these 2 files should be maintained together,
 * to keep as similar an API as possible.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import Orientation from '../../phet-core/js/Orientation.js';
import PickOptional from '../../phet-core/js/types/PickOptional.js';
import { PathOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import CanvasPainter, { CanvasPainterOptions } from './CanvasPainter.js';
import ChartTransform from './ChartTransform.js';
import ClippingType from './ClippingType.js';

type SelfOptions = {
  origin?: number;
  clippingType?: ClippingType;
  stroke?: string | CanvasGradient | CanvasPattern;
} & PickOptional<PathOptions, 'lineWidth' | 'lineDash' | 'lineDashOffset'>;

export type CanvasGridLineSetOptions = SelfOptions & CanvasPainterOptions;

class CanvasGridLineSet extends CanvasPainter {

  private readonly chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly origin: number;
  private readonly clippingType: ClippingType;
  private readonly stroke: string | CanvasGradient | CanvasPattern;
  private readonly lineDash: number[];
  private readonly lineWidth: number;
  private lineDashOffset: number;

  /**
   * @param chartTransform
   * @param axisOrientation - axis along which successive grid lines appear.  For example,
   *                        - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param spacing - in model coordinates
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number,
                      providedOptions?: CanvasGridLineSetOptions ) {

    const options = optionize<CanvasGridLineSetOptions, SelfOptions>()( {

      // SelfOptions
      origin: 0,
      clippingType: 'strict',
      stroke: 'black',
      lineWidth: 1,
      lineDash: [ 1 ],
      lineDashOffset: 0
    }, providedOptions );

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

  public setSpacing( spacing: number ): void {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
    }
  }

  public setLineDashOffset( lineDashOffset: number ): void {
    this.lineDashOffset = lineDashOffset;
  }

  public paintCanvas( context: CanvasRenderingContext2D ): void {
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