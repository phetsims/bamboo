// Copyright 2020-2021, University of Colorado Boulder

/**
 * ChartTransform defines the chart dimensions in model and view coordinate frames, and provides transform methods
 * for moving between those coordinate frames.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../axon/js/Emitter.js';
import Range from '../../dot/js/Range.js';
import Transform1 from '../../dot/js/Transform1.js';
import Util from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';

class ChartTransform {

  /**
   * @param [options]
   */
  constructor( options ) {

    options = merge( {

      // The horizontal axis is referred to as the "x" axis, though it may be used to depict another dimension, such as "time"
      viewWidth: 100, // {number} width in view coordinates
      modelXRange: new Range( -1, 1 ), // {Range} range of the x axis, in model coordinates
      xTransform: new Transform1( x => x, x => x ), // {Transform1} model-to-view scaling function for the x axis

      // The vertical axis is referred to as the "y" axis, though it may be used to depict another dimension such as "width"
      viewHeight: 100, // {number} height in view coordinates
      modelYRange: new Range( -1, 1 ), // {Range} range of the y axis, in model coordinates
      yTransform: new Transform1( x => x, x => x ) // {Transform1} model-to-view scaling function for the y axis
    }, options );

    assert && assert( options.xTransform instanceof Transform1, 'xTransform must be of type Transform' );
    assert && assert( options.yTransform instanceof Transform1, 'yTransform must be of type Transform' );

    // @public fires when some aspect of this transform changes
    this.changedEmitter = new Emitter();

    // @public (read-only)
    this.viewWidth = options.viewWidth;
    this.viewHeight = options.viewHeight;
    this.modelXRange = options.modelXRange;
    this.modelYRange = options.modelYRange;

    // @private
    this.xTransform = options.xTransform;
    this.yTransform = options.yTransform;
  }

  /**
   * @public
   */
  dispose() {
    this.changedEmitter.dispose();
  }

  /**
   * For the axis that corresponds to Orientation, iterates over the range and performs an operation (specified by
   * callback) at regular intervals (specified by spacing).
   * @param {Orientation} axisOrientation
   * @param {number} spacing - the spacing (delta) between operations, in model coordinates
   * @param {number} origin - the origin for the operation, in model coordinates. The operation is guaranteed to occur at this position.
   * @param {ClippingType} clippingType - if something is clipped elsewhere, we allow slack so it doesn't disappear from view like a flicker
   * @param {function(modelPosition:Vector2, viewPosition:Vector2)} callback
   * @public
   */
  forEachSpacing( axisOrientation, spacing, origin, clippingType, callback ) {

    const modelRange = this.getModelRange( axisOrientation );
    const nMin = getValueForSpacing( modelRange.min, clippingType, origin, spacing, Math.ceil );
    const nMax = getValueForSpacing( modelRange.max, clippingType, origin, spacing, Math.floor );

    for ( let n = nMin; n <= nMax + 1E-6; n++ ) {
      const modelPosition = n * spacing + origin;
      const viewPosition = this.modelToView( axisOrientation, modelPosition );
      callback( modelPosition, viewPosition );
    }
  }

  /**
   * Transforms a model position to a view position.
   * @param {Vector2} vector
   * @returns {Vector2}
   * @public
   */
  modelToViewPosition( vector ) {
    return this.modelToViewXY( vector.x, vector.y );
  }

  /**
   * Transforms model x,y coordinates to a view position.
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   * @public
   */
  modelToViewXY( x, y ) {
    return new Vector2( this.modelToViewX( x ), this.modelToViewY( y ) );
  }

  /**
   * Transforms a model coordinate {number} to a view coordinate {number} for the x axis.
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToViewX( value ) {
    return this.modelToView( Orientation.HORIZONTAL, value );
  }

  /**
   * Transforms a model coordinate {number} to a view coordinate {number} for the y axis.
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToViewY( value ) {
    return this.modelToView( Orientation.VERTICAL, value );
  }

  /**
   * Transforms a model coordinate {number} to a view coordinate {number} for the axis that corresponds to Orientation.
   * @param {Orientation} axisOrientation
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToView( axisOrientation, value ) {
    assert && assert( Orientation.includes( axisOrientation ), `invalid axisOrientation: ${axisOrientation}` );

    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.viewWidth : this.viewHeight;
    const transform = axisOrientation === Orientation.HORIZONTAL ? this.xTransform : this.yTransform;

    let transformedValue = transform.evaluate( value );
    if ( isNaN( transformedValue ) || !Number.isFinite( transformedValue ) ) {
      transformedValue = value;
    }

    // For vertical, +y is usually up
    return axisOrientation === Orientation.HORIZONTAL ?
           Util.linear( transform.evaluate( modelRange.min ), transform.evaluate( modelRange.max ), 0, viewDimension, transformedValue ) :
           Util.linear( transform.evaluate( modelRange.max ), transform.evaluate( modelRange.min ), 0, viewDimension, transformedValue );
  }

  /**
   * The reverse of modelToView
   * @param axisOrientation
   * @param value
   * @returns {*}
   * @public
   */
  viewToModel( axisOrientation, value ) {
    assert && assert( Orientation.includes( axisOrientation ), `invalid axisOrientation: ${axisOrientation}` );

    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.viewWidth : this.viewHeight;
    const transform = axisOrientation === Orientation.HORIZONTAL ? this.xTransform : this.yTransform;

    // For vertical, +y is usually up
    const out = axisOrientation === Orientation.HORIZONTAL ?
                Util.linear( 0, viewDimension, transform.evaluate( modelRange.min ), transform.evaluate( modelRange.max ), value ) :
                Util.linear( 0, viewDimension, transform.evaluate( modelRange.max ), transform.evaluate( modelRange.min ), value );

    return transform.inverse( out );
  }

  /**
   * Transforms a model delta {number} to a view delta {number} for the x axis.
   * @param {number} dx
   * @returns {number}
   * @public
   */
  modelToViewDeltaX( dx ) {
    return this.modelToViewDelta( Orientation.HORIZONTAL, dx );
  }

  /**
   * Transforms a model delta {number} to a view delta {number} for the y axis.
   * @param {number} dy
   * @returns {number}
   * @public
   */
  modelToViewDeltaY( dy ) {
    return this.modelToViewDelta( Orientation.VERTICAL, dy );
  }

  /**
   * Transforms a model delta {number} to a view delta {number} for the axis that corresponds to Orientation.
   * @param {Orientation} axisOrientation
   * @param {number} modelDelta
   * @returns {number}
   * @public
   */
  modelToViewDelta( axisOrientation, modelDelta ) {
    return this.modelToView( axisOrientation, modelDelta ) - this.modelToView( axisOrientation, 0 );
  }

  /**
   * Sets the view width.
   * @param {number} viewWidth
   * @public
   */
  setViewWidth( viewWidth ) {
    if ( viewWidth !== this.viewWidth ) {
      this.viewWidth = viewWidth;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the view height.
   * @param {number} viewHeight
   * @public
   */
  setViewHeight( viewHeight ) {
    if ( viewHeight !== this.viewHeight ) {
      this.viewHeight = viewHeight;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the Range for the model's x dimension.
   * @param {Range} modelXRange
   * @public
   */
  setModelXRange( modelXRange ) {
    if ( !modelXRange.equals( this.modelXRange ) ) {
      this.modelXRange = modelXRange;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the Range for the model's y dimension.
   * @param {Range} modelYRange
   * @public
   */
  setModelYRange( modelYRange ) {
    if ( !modelYRange.equals( this.modelYRange ) ) {
      this.modelYRange = modelYRange;
      this.changedEmitter.emit();
    }
  }

  /**
   * Gets the model range for the axis that corresponds to Orientation.
   * @param {Orientation} axisOrientation
   * @returns {Object.modelXRange|Object.modelYRange}
   * @public
   */
  getModelRange( axisOrientation ) {
    assert && assert( Orientation.includes( axisOrientation ), `invalid axisOrientation: ${axisOrientation}` );
    return ( axisOrientation === Orientation.HORIZONTAL ) ? this.modelXRange : this.modelYRange;
  }

  /**
   * Sets the model-to-view scaling function for the x-axis.
   * @param {function(number):number} xTransform
   * @public
   */
  setXTransform( xTransform ) {
    assert && assert( xTransform instanceof Transform1, 'xTransform must be a Transform1' );
    if ( this.xTransform !== xTransform ) {
      this.xTransform = xTransform;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the model-to-view scaling function for the y-axis.
   * @param {function(number):number} yTransform
   * @public
   */
  setYTransform( yTransform ) {
    assert && assert( yTransform instanceof Transform1, 'yTransform must be a Transform1' );
    if ( this.yTransform !== yTransform ) {
      this.yTransform = yTransform;
      this.changedEmitter.emit();
    }
  }

  /**
   * Convert a view point to the corresponding model point.
   * @param {Vector2} pt
   * @returns {Vector2}
   * @public
   */
  viewToModelPoint( pt ) {
    return new Vector2(
      this.viewToModel( Orientation.HORIZONTAL, pt.x ),
      this.viewToModel( Orientation.VERTICAL, pt.y )
    );
  }
}

/**
 * Solve for spaced value.
 * n * spacing + origin = x
 * n = (x-origin)/spacing, where n is an integer
 * @param {number} value
 * @param {ClippingType} clippingType
 * @param {number} origin
 * @param {number} spacing
 * @param {function} round - rounding type for strict
 * @returns {number}
 */
function getValueForSpacing( value, clippingType, origin, spacing, round ) {
  return clippingType === ClippingType.LENIENT ?
         Util.roundSymmetric( ( value - origin ) / spacing ) :
         round( ( value - origin ) / spacing );
}

bamboo.register( 'ChartTransform', ChartTransform );
export default ChartTransform;