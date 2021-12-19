// Copyright 2020-2021, University of Colorado Boulder

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 *
 * See also CanvasGridLineSet for one that renders to canvas. Note, these 2 files should be maintained together,
 * to keep as similar an API as possible.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import { Path } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';
import ChartTransform from './ChartTransform.js';

class GridLineSet extends Path {
  private readonly chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly origin: any;
  private readonly clippingType: ClippingType;
  private disposeGridLineSet: () => void;

  /**
   * @param chartTransform
   * @param axisOrientation - axis along which successive grid lines appear.  For example,
   *                                      - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param spacing - in model coordinates
   * @param [options]
   */
  constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number, options?: any ) {

    options = merge( {
      origin: 0,
      clippingType: 'strict',

      // Path options
      stroke: 'black'
    }, options );

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

  private update() {
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

  setSpacing( spacing: number ): void {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.update();
    }
  }

  dispose(): void {
    this.disposeGridLineSet();
    super.dispose();
  }
}

bamboo.register( 'GridLineSet', GridLineSet );
export default GridLineSet;