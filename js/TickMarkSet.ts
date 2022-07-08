// Copyright 2020-2022, University of Colorado Boulder

/**
 * Shows tick marks within or next to a chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import { Shape } from '../../kite/js/imports.js';
import Orientation from '../../phet-core/js/Orientation.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';
import ChartTransform from './ChartTransform.js';
import optionize from '../../phet-core/js/optionize.js';

type SelfOptions = {
  value?: number;
  edge?: null | 'min' | 'max'; // 'min' or 'max' put the ticks on that edge of the chart (takes precedence over value)
  origin?: number;
  lineWidth?: number;
  extent?: number;

  // determines whether the rounding is lenient, see ChartTransform
  clippingType?: ClippingType;
};
type TickMarkSetOptions = SelfOptions & PathOptions;

class TickMarkSet extends Path {

  private chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly value: number;
  private edge: null | 'min' | 'max';
  private readonly origin: number;
  private readonly extent: number;
  private readonly clippingType: ClippingType;
  private readonly disposeTickMarkSet: () => void;

  public static DEFAULT_EXTENT = 10;

  /**
   * @param chartTransform
   * @param axisOrientation - the progression of the ticks.  For instance HORIZONTAL has ticks at x=0,1,2, etc.
   * @param spacing - in model coordinates
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number,
                      providedOptions?: TickMarkSetOptions ) {

    const options = optionize<TickMarkSetOptions, SelfOptions, PathOptions>()( {
      value: 0, // appear on the axis by default
      edge: null, // 'min' or 'max' put the ticks on that edge of the chart (takes precedence over value)
      origin: 0,
      stroke: 'black',
      lineWidth: 1,
      extent: TickMarkSet.DEFAULT_EXTENT,

      // determines whether the rounding is lenient, see ChartTransform
      clippingType: 'strict'
    }, providedOptions );

    if ( options.edge ) {
      assert && assert( options.value === 0, 'value and edge are mutually exclusive' );
    }

    super( null, options );

    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.value = options.value;
    this.edge = options.edge;
    this.origin = options.origin;
    this.extent = options.extent;
    this.clippingType = options.clippingType;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeTickMarkSet = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  public setSpacing( spacing: number ): void {
    if ( spacing !== this.spacing ) {
      this.spacing = spacing;
      this.update();
    }
  }

  private update(): void {
    const shape = new Shape();

    this.chartTransform.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType, ( modelPosition, viewPosition ) => {
      const tickBounds = new Bounds2( 0, 0, 0, 0 );
      if ( this.axisOrientation === Orientation.HORIZONTAL ) {
        const viewY = this.edge === 'min' ? this.chartTransform.viewHeight :
                      this.edge === 'max' ? 0 :
                      this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );
        shape.moveTo( viewPosition, viewY - this.extent / 2 );
        shape.lineTo( viewPosition, viewY + this.extent / 2 );
        tickBounds.setMinMax( viewPosition, viewY - this.extent / 2, viewPosition, viewY + this.extent / 2 );
      }
      else {
        const viewX = this.edge === 'min' ? 0 :
                      this.edge === 'max' ? this.chartTransform.viewWidth :
                      this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );
        shape.moveTo( viewX - this.extent / 2, viewPosition );
        shape.lineTo( viewX + this.extent / 2, viewPosition );
        tickBounds.setMinMax( viewX - this.extent / 2, viewPosition, viewX + this.extent / 2, viewPosition );
      }
    } );

    this.shape = shape.makeImmutable();
  }

  public override dispose(): void {
    this.disposeTickMarkSet();
    super.dispose();
  }
}

bamboo.register( 'TickMarkSet', TickMarkSet );
export default TickMarkSet;