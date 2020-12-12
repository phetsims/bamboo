// Copyright 2020, University of Colorado Boulder

/**
 * CanvasPainter is the abstract base class for bamboo components that use the Canvas API. Typically this would
 * render something, but some implementations may just change the context state (such as transform or stroke).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import bamboo from './bamboo.js';

class CanvasPainter {

  // Modeled as a class for readability because JavaScript does not have interfaces
  constructor( options ) {
    options = merge( { visible: true }, options );

    // @public {boolean} - if changed, you should probably invalidate the parent ChartCanvasNode
    this.visible = options.visible;
  }

  // @public @abstract - override to paint or change the canvas context state.  Only called if this.visible is true
  paintCanvas( context ) {
    assert && assert( false, 'should be overridden in subclasses' );
  }
}

bamboo.register( 'CanvasPainter', CanvasPainter );
export default CanvasPainter;