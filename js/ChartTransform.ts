// Copyright 2020-2023, University of Colorado Boulder

/**
 * ChartTransform defines the chart dimensions in model and view coordinate frames, and provides transform methods
 * for moving between those coordinate frames.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../axon/js/Emitter.js';
import TEmitter from '../../axon/js/TEmitter.js';
import Range from '../../dot/js/Range.js';
import Transform1 from '../../dot/js/Transform1.js';
import Utils from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import optionize from '../../phet-core/js/optionize.js';
import Orientation from '../../phet-core/js/Orientation.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';

type SelfOptions = {

  // The horizontal axis is referred to as the "x" axis, though it may be used to depict another dimension, such as "time"
  viewWidth?: number; // width in view coordinates
  modelXRange?: Range; // range of the x axis, in model coordinates
  modelXRangeInverted?: boolean;
  xTransform?: Transform1; // model-to-view scaling function for the x axis

  // The vertical axis is referred to as the "y" axis, though it may be used to depict another dimension such as "width"
  viewHeight?: number; // height in view coordinates
  modelYRange?: Range; // range of the y axis, in model coordinates
  modelYRangeInverted?: boolean;
  yTransform?: Transform1; // model-to-view scaling function for the y axis
};
export type ChartTransformOptions = SelfOptions;

class ChartTransform {

  // fires when some aspects of this transform changes
  public readonly changedEmitter: TEmitter;

  public viewWidth: number;
  public viewHeight: number;
  public modelXRange: Range;
  public modelYRange: Range;
  public xTransform: Transform1;
  public yTransform: Transform1;
  public modelXRangeInverted: boolean;
  public modelYRangeInverted: boolean;

  public constructor( providedOptions?: ChartTransformOptions ) {

    const options = optionize<ChartTransformOptions, SelfOptions>()( {

      // SelfOptions
      viewWidth: 100,
      modelXRange: new Range( -1, 1 ),
      modelXRangeInverted: false,
      xTransform: new Transform1( x => x, x => x ),

      viewHeight: 100,
      modelYRange: new Range( -1, 1 ),
      modelYRangeInverted: false,
      yTransform: new Transform1( x => x, x => x )
    }, providedOptions );

    assert && assert( options.xTransform instanceof Transform1, 'xTransform must be of type Transform' );
    assert && assert( options.yTransform instanceof Transform1, 'yTransform must be of type Transform' );

    this.changedEmitter = new Emitter();

    this.viewWidth = options.viewWidth;
    this.viewHeight = options.viewHeight;

    this.modelXRange = options.modelXRange;
    this.modelXRangeInverted = options.modelXRangeInverted;

    this.modelYRange = options.modelYRange;
    this.modelYRangeInverted = options.modelYRangeInverted;

    this.xTransform = options.xTransform;
    this.yTransform = options.yTransform;
  }

  public dispose(): void {
    this.changedEmitter.dispose();
  }

  /**
   * For the axis that corresponds to Orientation, iterates over the range and performs an operation (specified by
   * callback) at regular intervals (specified by spacing).
   * @param axisOrientation
   * @param spacing - the spacing (delta) between operations, in model coordinates
   * @param origin - the origin for the operation, in model coordinates. The operation is guaranteed to occur at this position.
   * @param clippingType - if something is clipped elsewhere, we allow slack so it doesn't disappear from view like a flicker
   * @param callback
   */
  public forEachSpacing( axisOrientation: Orientation, spacing: number, origin: number, clippingType: ClippingType,
                         callback: ( modelPosition: number, viewPosition: number ) => void ): void {
    const [ nMin, nMax ] = this.getSpacingBorders( axisOrientation, spacing, origin, clippingType );

    for ( let n = nMin; n <= nMax + 1E-6; n++ ) {
      const modelPosition = n * spacing + origin;
      const viewPosition = this.modelToView( axisOrientation, modelPosition );
      callback( modelPosition, viewPosition );
    }
  }

  // Transforms a model coordinate {number} to a view coordinate {number} for the axis that corresponds to Orientation.
  public modelToView( axisOrientation: Orientation, value: number ): number {

    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.viewWidth : this.viewHeight;
    const transform = axisOrientation === Orientation.HORIZONTAL ? this.xTransform : this.yTransform;
    const inverted = axisOrientation === Orientation.HORIZONTAL ? this.modelXRangeInverted : this.modelYRangeInverted;

    const transformedValue = transform.evaluate( value );
    assert && assert( !isNaN( transformedValue ), 'transformed value was NaN' );
    assert && assert( Number.isFinite( transformedValue ), 'transformed value was not finite' );

    const lowSide = inverted ? viewDimension : 0;
    const highSide = inverted ? 0 : viewDimension;

    // For vertical, +y is usually up
    const viewValue = axisOrientation === Orientation.HORIZONTAL ?
                      Utils.linear( transform.evaluate( modelRange.min ), transform.evaluate( modelRange.max ), lowSide, highSide, transformedValue ) :
                      Utils.linear( transform.evaluate( modelRange.max ), transform.evaluate( modelRange.min ), lowSide, highSide, transformedValue );
    assert && assert( Number.isFinite( viewValue ), 'viewValue should be finite' );
    assert && assert( !isNaN( viewValue ), 'viewValue should be a number' );

    return viewValue;
  }

  // Transforms a model coordinate {number} to a view coordinate {number} for the x axis.
  public modelToViewX( x: number ): number {
    return this.modelToView( Orientation.HORIZONTAL, x );
  }

  // Transforms a model coordinate {number} to a view coordinate {number} for the y axis.
  public modelToViewY( y: number ): number {
    return this.modelToView( Orientation.VERTICAL, y );
  }

  // Transforms model x,y coordinates to a view position.
  public modelToViewXY( x: number, y: number ): Vector2 {
    return new Vector2( this.modelToViewX( x ), this.modelToViewY( y ) );
  }

  // Transforms a model position to a view position.
  public modelToViewPosition( position: Vector2 ): Vector2 {
    return this.modelToViewXY( position.x, position.y );
  }

  // Transforms a model delta {number} to a view delta {number} for the axis that corresponds to Orientation.
  public modelToViewDelta( axisOrientation: Orientation, modelDelta: number ): number {
    return this.modelToView( axisOrientation, modelDelta ) - this.modelToView( axisOrientation, 0 );
  }

  // Transforms a model delta {number} to a view delta {number} for the x axis.
  public modelToViewDeltaX( dx: number ): number {
    return this.modelToViewDelta( Orientation.HORIZONTAL, dx );
  }

  // Transforms a model delta {number} to a view delta {number} for the y axis.
  public modelToViewDeltaY( dy: number ): number {
    return this.modelToViewDelta( Orientation.VERTICAL, dy );
  }

  // Transforms a model delta pair of numbers to view Vector2
  public modelToViewDeltaXY( dx: number, dy: number ): Vector2 {
    return new Vector2( this.modelToViewDeltaX( dx ), this.modelToViewDeltaY( dy ) );
  }

  // Converts a scalar value from view coordinates to model coordinates, along the specified axis.  The inverse of modelToView.
  public viewToModel( axisOrientation: Orientation, value: number ): number {

    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.viewWidth : this.viewHeight;
    const transform = axisOrientation === Orientation.HORIZONTAL ? this.xTransform : this.yTransform;
    const inverted = axisOrientation === Orientation.HORIZONTAL ? this.modelXRangeInverted : this.modelYRangeInverted;

    const lowSide = inverted ? viewDimension : 0;
    const highSide = inverted ? 0 : viewDimension;

    // For vertical, +y is usually up
    const out = axisOrientation === Orientation.HORIZONTAL ?
                Utils.linear( lowSide, highSide, transform.evaluate( modelRange.min ), transform.evaluate( modelRange.max ), value ) :
                Utils.linear( lowSide, highSide, transform.evaluate( modelRange.max ), transform.evaluate( modelRange.min ), value );
    assert && assert( Number.isFinite( out ), 'out value should be finite' );
    assert && assert( !isNaN( out ), 'out value should be a number' );

    const modelValue = transform.inverse( out );
    assert && assert( Number.isFinite( modelValue ), 'modelValue should be finite' );
    assert && assert( !isNaN( modelValue ), 'modelValue should be a number' );

    return modelValue;
  }

  // Convert a view position to a model position, in the horizontal direction.
  public viewToModelX( x: number ): number {
    return this.viewToModel( Orientation.HORIZONTAL, x );
  }

  // Convert a view position to a model position, in the vertical direction.
  public viewToModelY( y: number ): number {
    return this.viewToModel( Orientation.VERTICAL, y );
  }

  // Convert a view position to a model position, for a coordinate specified as x,y.
  public viewToModelXY( x: number, y: number ): Vector2 {
    return new Vector2( this.viewToModelX( x ), this.viewToModelY( y ) );
  }

  // Convert a view position to a model position.
  public viewToModelPosition( position: Vector2 ): Vector2 {
    return this.viewToModelXY( position.x, position.y );
  }

  // Convert a delta in the view to a delta in the model, in the horizontal direction.
  public viewToModelDeltaX( dx: number ): number {
    return this.viewToModelX( dx ) - this.viewToModelX( 0 );
  }

  // Convert a delta in the view to a delta in the model, in the vertical direction.
  public viewToModelDeltaY( dy: number ): number {
    return this.viewToModelY( dy ) - this.viewToModelY( 0 );
  }

  // Convert a delta in the view to a delta in the model, for a Vector2
  public viewToModelDelta( deltaVector: Vector2 ): Vector2 {
    return this.viewToModelPosition( deltaVector ).minus( this.viewToModelPosition( Vector2.ZERO ) );
  }

  // Sets the view width.
  public setViewWidth( viewWidth: number ): void {
    if ( viewWidth !== this.viewWidth ) {
      this.viewWidth = viewWidth;
      this.changedEmitter.emit();
    }
  }

  // Sets the view height.
  public setViewHeight( viewHeight: number ): void {
    if ( viewHeight !== this.viewHeight ) {
      this.viewHeight = viewHeight;
      this.changedEmitter.emit();
    }
  }

  // Sets the Range for the model's x dimension.
  public setModelXRange( modelXRange: Range ): void {
    if ( !modelXRange.equals( this.modelXRange ) ) {
      this.modelXRange = modelXRange;
      this.changedEmitter.emit();
    }
  }

  // Sets the Range for the model's y dimension.
  public setModelYRange( modelYRange: Range ): void {
    if ( !modelYRange.equals( this.modelYRange ) ) {
      this.modelYRange = modelYRange;
      this.changedEmitter.emit();
    }
  }

  // Gets the model range for the axis that corresponds to Orientation.
  public getModelRange( axisOrientation: Orientation ): Range {
    return ( axisOrientation === Orientation.HORIZONTAL ) ? this.modelXRange : this.modelYRange;
  }

  // Sets the model-to-view scaling function for the x-axis.
  public setXTransform( xTransform: Transform1 ): void {
    if ( this.xTransform !== xTransform ) {
      this.xTransform = xTransform;
      this.changedEmitter.emit();
    }
  }

  // Sets the model-to-view scaling function for the y-axis.
  public setYTransform( yTransform: Transform1 ): void {
    if ( this.yTransform !== yTransform ) {
      this.yTransform = yTransform;
      this.changedEmitter.emit();
    }
  }

  public getSpacingBorders( axisOrientation: Orientation, spacing: number, origin: number, clippingType: ClippingType ): number[] {
    const modelRange = this.getModelRange( axisOrientation );
    const nMin = getValueForSpacing( modelRange.min, clippingType, origin, spacing, Math.ceil );
    const nMax = getValueForSpacing( modelRange.max, clippingType, origin, spacing, Math.floor );

    return [ nMin, nMax ];
  }
}

/**
 * Solve for spaced value.
 * n * spacing + origin = x
 * n = (x-origin)/spacing, where n is an integer
 */
function getValueForSpacing( value: number, clippingType: ClippingType,
                             origin: number, spacing: number, round: ( n: number ) => number ): number {
  return clippingType === 'lenient' ?
         Utils.roundSymmetric( ( value - origin ) / spacing ) :
         round( ( value - origin ) / spacing );
}

bamboo.register( 'ChartTransform', ChartTransform );
export default ChartTransform;
