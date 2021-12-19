// Copyright 2020, University of Colorado Boulder

/**
 * CanvasPainter is the abstract base class for bamboo components that use the Canvas API. Typically this would
 * render something, but some implementations may just change the context state (such as transform or stroke).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import bamboo from './bamboo.js';

abstract class CanvasPainter {

  // if changed, you should probably invalidate the parent ChartCanvasNode
  visible: boolean;
  protected isDisposed: boolean;

  // Modeled as a class for readability because JavaScript does not have interfaces
  constructor( options?: any ) {
    options = merge( { visible: true }, options );

    this.visible = options.visible;
    this.isDisposed = false;
  }

  // override to paint or change the canvas context state.  Only called if this.visible is true
  abstract paintCanvas( context: CanvasRenderingContext2D ): void;
}

bamboo.register( 'CanvasPainter', CanvasPainter );
export default CanvasPainter;