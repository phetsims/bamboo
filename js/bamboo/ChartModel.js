// Copyright 2020, University of Colorado Boulder

import Property from '../../../axon/js/Property.js';
import merge from '../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
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
      modelViewTransform: ModelViewTransform2.createIdentity()
    }, options );

    // Where data will be displayed in views
    // this.viewArea = new Bounds2( 0, 0, 100, 100 );

    // Possible to change dimensions, say, if a window or containing panel is resized.
    // this.widthProperty = new NumberProperty( 400 );
    // this.heightProperty = new NumberProperty( 400 );

    // Use a reference and an Emitter so that we can mutate the modelViewTransform in-place
    // for scrolling
    // TODO: Maybe this should be an arbitrary function in the x direction and in the y direction
    // TODO: So we can make log plots, etc., which would show up in the gridlines
    this.modelViewTransformProperty = new Property( options.modelViewTransform );

    // TODO: Support mutable chart dimensions
    this.width = options.width;
    this.height = options.height;
  }
}

griddle.register( 'ChartModel', ChartModel );
export default ChartModel;