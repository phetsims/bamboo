// Copyright 2020, University of Colorado Boulder

/**
 * CanvasPainter is the abstract base class for bamboo components that use the Canvas API. Typically this would
 * render something, but some implementations may just change the context state (such as transform or stroke).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import bamboo from './bamboo.js';

class CanvasPainter {

  // Modeled as a class for readability because JavaScript does not have interfaces
  constructor() {
  }

  // @public @abstract - override to paint or change the canvas context state
  paintCanvas( context ) {
    assert && assert( false, 'should be overridden in subclasses' );
  }
}

bamboo.register( 'CanvasPainter', CanvasPainter );
export default CanvasPainter;