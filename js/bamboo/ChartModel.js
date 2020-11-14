// Copyright 2020, University of Colorado Boulder

import Emitter from '../../../axon/js/Emitter.js';
import Range from '../../../dot/js/Range.js';
import Util from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class ChartModel {
  constructor( options ) {

    options = merge( {
      width: 400,
      height: 400,

      // must be invertible to back-compute model region, which may be used to compute gridlines?
      // modelViewTransform: ModelViewTransform2.createIdentity()

      // TODO: allow specification of a nonlinear transform.  Set at the same time as range so they are in sync
      modelXRange: new Range( -1, 1 ),
      modelYRange: new Range( -1, 1 )
    }, options );

    // TODO: Maybe this should be an arbitrary function in the x direction and in the y direction
    // TODO: So we can make log plots, etc., which would show up in the gridlines
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

  // @public - called when the chart transform has changed, and right away for initialization
  link( listener ) {
    this.transformChangedEmitter.addListener( listener );
    listener();
  }

  // @public
  modelToViewPosition( vector ) {
    return new Vector2(
      this.modelToView( Orientation.HORIZONTAL, vector.x ),
      this.modelToView( Orientation.VERTICAL, vector.y )
    );
  }

  // @public
  modelToView( orientation, value ) {
    assert && assert( orientation === Orientation.VERTICAL || orientation === Orientation.HORIZONTAL );
    const modelRange = orientation === Orientation.HORIZONTAL ? this.modelXRange : this.modelYRange;
    const viewDimension = orientation === Orientation.HORIZONTAL ? this.width : this.height;

    // For vertical, +y is usually up
    return orientation === Orientation.HORIZONTAL ?
           Util.linear( modelRange.min, modelRange.max, 0, viewDimension, value ) :
           Util.linear( modelRange.max, modelRange.min, 0, viewDimension, value );
  }

  // @public
  getModelRange( orientation ) {
    assert && assert( orientation === Orientation.VERTICAL || orientation === Orientation.HORIZONTAL );
    return orientation === Orientation.VERTICAL ? this.modelYRange : this.modelXRange;
  }

  // @public
  setWidth( width ) {
    if ( width !== this.width ) {
      this.width = width;
      this.transformChangedEmitter.emit();
    }
  }

  // @public
  setHeight( height ) {
    if ( height !== this.height ) {
      this.height = height;
      this.transformChangedEmitter.emit();
    }
  }

  // @public
  setModelXRange( modelXRange ) {
    if ( modelXRange !== this.modelXRange ) {
      this.modelXRange = modelXRange;
      this.transformChangedEmitter.emit();
    }
  }

  // @public
  setModelYRange( modelYRange ) {
    if ( modelYRange !== this.modelYRange ) {
      this.modelYRange = modelYRange;
      this.transformChangedEmitter.emit();
    }
  }
}

griddle.register( 'ChartModel', ChartModel );
export default ChartModel;