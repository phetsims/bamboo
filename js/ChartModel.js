// Copyright 2020, University of Colorado Boulder

/**
 * This defines an output rectangle where chart data will be rendered, and one transform for each axis.
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

class ChartModel {

  /**
   * @param {number} width - in view coordinates
   * @param {number} height - in view coordinates
   * @param [options]
   */
  constructor( width, height, options ) {

    options = merge( {

      // The horizontal axis is referred to as the "x" axis, though it may be used to depict another dimension, such as "time"
      modelXRange: new Range( -1, 1 ),
      xScale: x => x,

      // The vertical axis is referred to as the "y" axis, though it may be used to depict another dimension such as "width"
      modelYRange: new Range( -1, 1 ),
      yScale: y => y
    }, options );

    this.transformChangedEmitter = new Emitter();

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
   * @param {Orientation} axisOrientation
   * @param {number} spacing - model separation
   * @param {number} origin - where one is guaranteed to land
   * @param {boolean} clipped - if something is clipped elsewhere, we allow slack so it doesn't disappear from view like a flicker
   * @param {function} callback
   * @public
   */
  forEachSpacing( axisOrientation, spacing, origin, clipped, callback ) {

    const modelRange = this.getModelRange( axisOrientation );

    // n* spacing + origin = x
    // n = (x-origin)/spacing, where n is an integer
    const nMin = clipped ?
                 Util.roundSymmetric( ( modelRange.min - origin ) / spacing ) :
                 Math.ceil( ( modelRange.min - origin ) / spacing );
    const nMax = clipped ?
                 Util.roundSymmetric( ( modelRange.max - origin ) / spacing ) :
                 Math.floor( ( modelRange.max - origin ) / spacing );

    for ( let n = nMin; n <= nMax + 1E-6; n++ ) {
      const modelPosition = n * spacing + origin;
      const viewPosition = this.modelToView( axisOrientation, modelPosition );
      callback( modelPosition, viewPosition );
    }
  }

  /**
   * Called when the chart transform has changed, and right away for initialization
   * @param {function} listener
   * @public
   */
  link( listener ) {
    this.transformChangedEmitter.addListener( listener );
    listener();
  }

  /**
   * Remove a listener from the chart transforms
   * @param {function} listener
   * @public
   */
  unlink( listener ) {
    this.transformChangedEmitter.removeListener( listener );
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
   * Transforms a model position {number} to a view position {number} for the specified Orientation
   * @param {Orientation} axisOrientation
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToView( axisOrientation, value ) {
    assert && assert( axisOrientation === Orientation.VERTICAL || axisOrientation === Orientation.HORIZONTAL );
    const modelRange = axisOrientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = axisOrientation === Orientation.HORIZONTAL ? this.width : this.height;
    const scale = axisOrientation === Orientation.HORIZONTAL ? this.xScale : this.yScale;

    // for a log plot, we need to choose a scale factor that takes


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
   * @param {Orientation} axisOrientation
   * @returns {Range}
   * @private
   */
  getModelRange( axisOrientation ) {
    assert && assert( axisOrientation === Orientation.VERTICAL || axisOrientation === Orientation.HORIZONTAL );
    return axisOrientation === Orientation.VERTICAL ? this.modelYRange : this.modelXRange;
  }

  /**
   * Sets the width out the output region of the chart.
   * @param {number} width
   * @public
   */
  setWidth( width ) {
    if ( width !== this.width ) {
      this.width = width;
      this.transformChangedEmitter.emit();
    }
  }

  /**
   * Sets the height out the output region of the chart.
   * @param {number} height
   * @public
   */
  setHeight( height ) {
    if ( height !== this.height ) {
      this.height = height;
      this.transformChangedEmitter.emit();
    }
  }

  /**
   * Sets the Range for the x dimension for the model, this sets a linear coordinate transform in this dimension.
   * @param {Range} modelXRange
   * @public
   */
  setModelXRange( modelXRange ) {
    if ( !modelXRange.equals( this.modelXRange ) ) {
      this.modelXRange = modelXRange;
      this.transformChangedEmitter.emit();
    }
  }

  /**
   * Sets the Range for the y dimension for the model, this sets a linear coordinate transform in this dimension.
   * @param {Range} modelYRange
   * @public
   */
  setModelYRange( modelYRange ) {
    if ( !modelYRange.equals( this.modelYRange ) ) {
      this.modelYRange = modelYRange;
      this.transformChangedEmitter.emit();
    }
  }

  /**
   * Change the scaling for the y-axis.
   * @param {function} yScale
   * @public
   */
  setYScale( yScale ) {
    if ( this.yScale !== yScale ) {
      this.yScale = yScale;
      this.transformChangedEmitter.emit();
    }
  }

  /**
   * Change the scaling for the x-axis.
   * @param {function} xScale
   * @public
   */
  setXScale( xScale ) {
    if ( this.xScale !== xScale ) {
      this.xScale = xScale;
      this.transformChangedEmitter.emit();
    }
  }
}

bamboo.register( 'ChartModel', ChartModel );
export default ChartModel;