// Copyright 2020-2023, University of Colorado Boulder

/**
 * Shows a set of tick labels within or next to a chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import Utils from '../../dot/js/Utils.js';
import Orientation from '../../phet-core/js/Orientation.js';
import { Node, Path, PathOptions, Text } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';
import TickMarkSet from './TickMarkSet.js';
import ChartTransform from './ChartTransform.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  value?: number;
  edge?: null | 'min' | 'max'; // 'min' or 'max' put the ticks on that edge of the chart (takes precedence over value)
  origin?: number;
  skipCoordinates?: number[]; // skip ticks at these coordinates, most often useful to skip zero where axes intersect

  // act as if there is a corresponding tick with this extent, for positioning the label relatively
  extent?: number;

  // determines whether the rounding is lenient, see ChartTransform
  clippingType?: ClippingType;

  // or return null if no label for that value
  createLabel?: ( value: number ) => Node | null;
  positionLabel?: ( label: Node, tickBounds: Bounds2, axisOrientation: Orientation ) => Node;
};

export type TickLabelSetOptions = SelfOptions & StrictOmit<PathOptions, 'children'>;

class TickLabelSet extends Path {

  private chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private spacing: number;
  private readonly origin: number;
  private readonly skipCoordinates: number[];
  private readonly extent: number;
  private readonly value: number;
  private readonly clippingType: ClippingType;
  private readonly edge: null | 'min' | 'max';
  private createLabel;
  private readonly positionLabel;
  private labelMap: Map<number, Node | null>; // cache labels for quick reuse
  private readonly disposeTickLabelSet: () => void;

  /**
   * @param chartTransform
   * @param axisOrientation - the progression of the ticks.  For instance HORIZONTAL has ticks at x=0,1,2, etc.
   * @param spacing - in model coordinates
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, spacing: number,
                      providedOptions?: TickLabelSetOptions ) {

    const options = optionize<TickLabelSetOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      value: 0, // appear on the axis by default
      edge: null,
      origin: 0,
      skipCoordinates: [],
      extent: TickMarkSet.DEFAULT_EXTENT,
      clippingType: 'strict',
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 1 ), { fontSize: 12 } ),
      positionLabel: ( label: Node, tickBounds: Bounds2, axisOrientation: Orientation ) => {
        if ( axisOrientation === Orientation.HORIZONTAL ) {

          // ticks flow horizontally, so tick labels should be below
          label.centerTop = tickBounds.centerBottom.plusXY( 0, 1 );
        }
        else {
          label.rightCenter = tickBounds.leftCenter.plusXY( -1, 0 );
        }
        return label;
      }
    }, providedOptions );

    if ( options.edge ) {
      assert && assert( options.value === 0, 'value and edge are mutually exclusive' );
    }

    super( null, options );

    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.skipCoordinates = options.skipCoordinates;
    this.extent = options.extent;
    this.value = options.value;
    this.clippingType = options.clippingType;
    this.edge = options.edge;
    this.createLabel = options.createLabel;
    this.positionLabel = options.positionLabel;

    this.labelMap = new Map();

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeTickLabelSet = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  public setSpacing( spacing: number ): void {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.update();
    }
  }

  // Updates the labels when range or spacing has changed.
  private update(): void {
    const children: Node[] = [];
    const used = new Set();

    this.chartTransform.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType, ( modelCoordinate, viewCoordinate ) => {
      if ( !this.skipCoordinates.includes( modelCoordinate ) ) {
        const tickBounds = new Bounds2( 0, 0, 0, 0 );
        if ( this.axisOrientation === Orientation.HORIZONTAL ) {
          const viewY = this.edge === 'min' ? this.chartTransform.viewHeight :
                        this.edge === 'max' ? 0 :
                        this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );
          tickBounds.setMinMax( viewCoordinate, viewY - this.extent / 2, viewCoordinate, viewY + this.extent / 2 );
        }
        else {
          const viewX = this.edge === 'min' ? 0 :
                        this.edge === 'max' ? this.chartTransform.viewWidth :
                        this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );
          tickBounds.setMinMax( viewX - this.extent / 2, viewCoordinate, viewX + this.extent / 2, viewCoordinate );
        }

        const label = this.labelMap.has( modelCoordinate ) ? this.labelMap.get( modelCoordinate )! :
                      this.createLabel ? this.createLabel( modelCoordinate ) :
                      null;
        this.labelMap.set( modelCoordinate, label );
        label && this.positionLabel( label, tickBounds, this.axisOrientation );
        label && children.push( label );
        used.add( modelCoordinate );
      }
    } );

    // empty cache of unused values
    const toRemove = [];
    for ( const key of this.labelMap.keys() ) {
      if ( !used.has( key ) ) {
        toRemove.push( key );
      }
    }
    toRemove.forEach( t => {
      this.labelMap.delete( t );
    } );

    this.children = children;
  }

  /**
   * Clears the cache and updates the label set. Use this if you need to have new labels for values that are in
   * the cache. For example, if your createLabel function had logic to switch between numeric (e.g. 2) and
   * symbolic labels (e.g. '2L').
   */
  private invalidateTickLabelSet(): void {
    this.labelMap.clear();
    this.update();
  }

  public setCreateLabel( createLabel: ( value: number ) => Node | null ): void {
    this.createLabel = createLabel;
    this.invalidateTickLabelSet();
  }

  public override dispose(): void {
    this.disposeTickLabelSet();
    super.dispose();
  }
}

bamboo.register( 'TickLabelSet', TickLabelSet );
export default TickLabelSet;