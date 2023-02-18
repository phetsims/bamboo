// Copyright 2020-2023, University of Colorado Boulder

/**
 * CanvasPainter is the abstract base class for bamboo components that use the Canvas API. Typically this would
 * render something, but some implementations may just change the context state (such as transform or stroke).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import bamboo from './bamboo.js';

type SelfOptions = {
  visible?: boolean;
};
export type CanvasPainterOptions = SelfOptions;

abstract class CanvasPainter {

  // if changed, you should probably invalidate the parent ChartCanvasNode
  public visible: boolean;
  protected isDisposed: boolean;

  // Modeled as a class for readability because JavaScript does not have interfaces
  protected constructor( providedOptions?: CanvasPainterOptions ) {
    const options = optionize<CanvasPainterOptions, SelfOptions>()( {

      // SelfOptions
      visible: true
    }, providedOptions );

    this.visible = options.visible;
    this.isDisposed = false;
  }

  // override to paint or change the canvas context state.  Only called if this.visible is true
  public abstract paintCanvas( context: CanvasRenderingContext2D ): void;
}

bamboo.register( 'CanvasPainter', CanvasPainter );
export default CanvasPainter;