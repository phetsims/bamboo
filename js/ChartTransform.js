// Copyright 2020, University of Colorado Boulder

/**
 * ChartTransform defines the chart dimensions in model and view coordinate frames, and provides transform methods
 * for moving between those coordinate frames.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../axon/js/Emitter.js';
import Range from '../../dot/js/Range.js';
import Util from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';

class ChartTransform {

  /**
   * @param {number} width - in view coordinates
   * @param {number} height - in view coordinates
   * @param [options]
   */
  constructor( width, height, options ) {

    options = merge( {

      // The horizontal axis is referred to as the "x" axis, though it may be used to depict another dimension, such as "time"
      modelXRange: new Range( -1, 1 ),
      xScale: x => x, // {function(number):number} model-to-view scaling function for the x axis

      // The vertical axis is referred to as the "y" axis, though it may be used to depict another dimension such as "width"
      modelYRange: new Range( -1, 1 ),
      yScale: y => y // {function(number):number} model-to-view scaling function for the y axis
    }, options );

    // Validate because xScale and yScale are not typically functions in other PhET APIs.
    assert && assert( typeof options.xScale === 'function', 'xScale must be a function' );
    assert && assert( typeof options.yScale === 'function', 'yScale must be a function' );

    // @public fires when some aspect of this transform changes
    this.changedEmitter = new Emitter();

    // @public (read-only)
    this.width = width;
    this.height = height;
    this.modelXRange = options.modelXRange;
    this.modelYRange = options.modelYRange;

    // @private
    this.xScale = options.xScale;
    this.yScale = options.yScale;
  }

  /**
   * @public
   */
  dispose() {
    this.changedEmitter.dispose();
  }

  /**
   * TODO https://github.com/phetsims/bamboo/issues/18 document this method.
   * @param {Orientation} axisOrientation
   * @param {number} spacing - model separation
   * @param {number} origin - where one is guaranteed to land
   * @param {ClippingType} clippingType - if something is clipped elsewhere, we allow slack so it doesn't disappear from view like a flicker
   * @param {function} callback
   * @public
   */
  forEachSpacing( axisOrientation, spacing, origin, clippingType, callback ) {

    assert && assert( axisOrientation === Orientation.HORIZONTAL || axisOrientation === Orientation.VERTICAL,
      `invalid axisOrientation: ${axisOrientation}` );
    const modelRange = ( axisOrientation === Orientation.HORIZONTAL ) ? this.modelXRange : this.modelYRange;

    const nMin = getValueForSpacing( modelRange.min, clippingType, origin, spacing, Math.ceil );
    const nMax = getValueForSpacing( modelRange.max, clippingType, origin, spacing, Math.floor );

    for ( let n = nMin; n <= nMax + 1E-6; n++ ) {
      const modelPosition = n * spacing + origin;
      const viewPosition = this.modelToView( axisOrientation, modelPosition );
      callback( modelPosition, viewPosition );
    }
  }

  /**
   * Transforms a model coordinate to a view coordinate
   * @param {Vector2} vector
   * @returns {Vector2}
   * @public
   */
  modelToViewPosition( vector ) {
    return new Vector2(
      this.modelToView( Orientation.HORIZONTAL, vector.x ),
      this.modelToView( Orientation.VERTICAL, vector.y )
    );
  }

  /**
   * Transforms a model delta {number} to a view delta {number} for the specified Orientation
   * @param {Orientation} axisOrientation
   * @param {number} modelDelta
   * @returns {number}
   * @public
   */
  modelToViewDelta( axisOrientation, modelDelta ) {
    return this.modelToView( axisOrientation, modelDelta ) - this.modelToView( axisOrientation, 0 );
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
   * Transforms a model coordinate {number} to a view coordinate {number} for the specified Orientation
   * @param {Orientation} axisOrientation
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToView( axisOrientation, value ) {
    assert && assert( axisOrientation === Orientation.HORIZONTAL || axisOrientation === Orientation.VERTICAL,
      `invalid axisOrientation: ${axisOrientation}` );

    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.width : this.height;
    const scale = axisOrientation === Orientation.HORIZONTAL ? this.xScale : this.yScale;

    let scaledValue = scale( value );
    if ( isNaN( scaledValue ) || !Number.isFinite( scaledValue ) ) {
      scaledValue = value;
    }

    // For vertical, +y is usually up
    return axisOrientation === Orientation.HORIZONTAL ?
           Util.linear( scale( modelRange.min ), scale( modelRange.max ), 0, viewDimension, scaledValue ) :
           Util.linear( scale( modelRange.max ), scale( modelRange.min ), 0, viewDimension, scaledValue );
  }

  /**
   * Sets the view width.
   * @param {number} width
   * @public
   */
  setWidth( width ) {
    if ( width !== this.width ) {
      this.width = width;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the view height.
   * @param {number} height
   * @public
   */
  setHeight( height ) {
    if ( height !== this.height ) {
      this.height = height;
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
   * Sets the model-to-view scaling function for the x-axis.
   * @param {function(number):number} xScale
   * @public
   */
  setXScale( xScale ) {
    assert && assert( typeof xScale === 'function', 'xScale must be a function' );
    if ( this.xScale !== xScale ) {
      this.xScale = xScale;
      this.changedEmitter.emit();
    }
  }

  /**
   * Sets the model-to-view scaling function for the y-axis.
   * @param {function(number):number} yScale
   * @public
   */
  setYScale( yScale ) {
    assert && assert( typeof yScale === 'function', 'yScale must be a function' );
    if ( this.yScale !== yScale ) {
      this.yScale = yScale;
      this.changedEmitter.emit();
    }
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