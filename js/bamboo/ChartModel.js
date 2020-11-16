// Copyright 2020, University of Colorado Boulder

import Emitter from '../../../axon/js/Emitter.js';
import Range from '../../../dot/js/Range.js';
import Util from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import griddle from '../griddle.js';

/**
 * This defines an output rectangle where chart data will be rendered, and one transform for each axis.
 * @author Sam Reid (PhET Interactive Simulations)
 */
class ChartModel {

  /**
   * @param [options]
   */
  constructor( options ) {

    options = merge( {
      width: 400,
      height: 400,

      // TODO: alternately, allow specification of a arbitrary nonlinear transform.  Set at the same time as range so
      //  they are in sync. So we can make log plots, etc., which would show up in the gridlines and data sets, etc.
      modelXRange: new Range( -1, 1 ),
      modelYRange: new Range( -1, 1 )
    }, options );

    this.transformChangedEmitter = new Emitter();

    // @public (read-only)
    this.width = options.width;
    this.height = options.height;
    this.modelXRange = options.modelXRange;
    this.modelYRange = options.modelYRange;
  }

  /**
   * @param {Orientation} orientation
   * @param {number} spacing - model separation
   * @param {number} origin - where one is guaranteed to land
   * @param {boolean} clipped - if something is clipped elsewhere, we allow slack so it doesn't disappear from view like a flicker
   * @param {function} callback
   * @public
   */
  forEachSpacing( orientation, spacing, origin, clipped, callback ) {

    const modelRange = this.getModelRange( orientation );

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
      const viewPosition = this.modelToView( orientation, modelPosition );
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
   * @param listener
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
   * Transforms a model position {number} to a view position {number} for the specified Orientation
   * @param {Orientation} orientation
   * @param {number} value
   * @returns {number}
   * @public
   */
  modelToView( orientation, value ) {
    assert && assert( orientation === Orientation.VERTICAL || orientation === Orientation.HORIZONTAL );
    const modelRange = orientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = orientation === Orientation.HORIZONTAL ? this.width : this.height;

    // For vertical, +y is usually up
    return orientation === Orientation.HORIZONTAL ?
           Util.linear( modelRange.min, modelRange.max, 0, viewDimension, value ) :
           Util.linear( modelRange.max, modelRange.min, 0, viewDimension, value );
  }

  /**
   * @param {Orientation} orientation
   * @returns {Range}
   * @private
   */
  getModelRange( orientation ) {
    assert && assert( orientation === Orientation.VERTICAL || orientation === Orientation.HORIZONTAL );
    return orientation === Orientation.VERTICAL ? this.modelYRange : this.modelXRange;
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
   * @param {number} modelXRange
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
   * @param {number} modelYRange
   * @public
   */
  setModelYRange( modelYRange ) {
    if ( !modelYRange.equals( this.modelYRange ) ) {
      this.modelYRange = modelYRange;
      this.transformChangedEmitter.emit();
    }
  }
}

griddle.register( 'ChartModel', ChartModel );
export default ChartModel;