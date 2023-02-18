// Copyright 2020-2023, University of Colorado Boulder

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 *
 * See also CanvasGridLineSet for one that renders to canvas. Note, these 2 files should be maintained together,
 * to keep as similar an API as possible.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../kite/js/imports.js';
import Orientation from '../../phet-core/js/Orientation.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';
import ChartTransform from './ChartTransform.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  origin?: number;
  clippingType?: ClippingType;
};
export type GridLineSetOptions = SelfOptions & PathOptions;

class GridLineSet extends Path {

  private readonly chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly origin: number;
  private readonly clippingType: ClippingType;
  private readonly disposeGridLineSet: () => void;

  /**
   * @param chartTransform
   * @param axisOrientation - axis along which successive grid lines appear.  For example,
   *                                      - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param spacing - in model coordinates
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number,
                      providedOptions?: GridLineSetOptions ) {

    const options = optionize<GridLineSetOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      origin: 0,
      clippingType: 'strict',

      // Path options
      stroke: 'black'
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.clippingType = options.clippingType;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeGridLineSet = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  private update(): void {
    const shape = new Shape();
    this.chartTransform.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType,
      ( modelPosition, viewPosition ) => {
        if ( this.axisOrientation === Orientation.VERTICAL ) {
          shape.moveTo( 0, viewPosition );
          shape.lineTo( this.chartTransform.viewWidth, viewPosition );
        }
        else {
          shape.moveTo( viewPosition, 0 );
          shape.lineTo( viewPosition, this.chartTransform.viewHeight );
        }
      } );
    this.shape = shape.makeImmutable();
  }

  public setSpacing( spacing: number ): void {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.update();
    }
  }

  public override dispose(): void {
    this.disposeGridLineSet();
    super.dispose();
  }
}

bamboo.register( 'GridLineSet', GridLineSet );
export default GridLineSet;