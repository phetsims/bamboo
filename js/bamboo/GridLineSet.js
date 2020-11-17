// Copyright 2020, University of Colorado Boulder

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Path from '../../../scenery/js/nodes/Path.js';
import griddle from '../griddle.js';

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 * @author Sam Reid (PhET Interactive Simulations)
 */

class GridLineSet extends Path {

  /**
   * @param chartModel
   * @param orientation
   * @param {number} spacing - in model coordinates
   * @param options
   */
  constructor( chartModel, orientation, spacing, options ) {
    options = merge( {
      origin: 0,
      stroke: 'black',
      clipped: false
    }, options );

    super( null );

    // @private
    this.chartModel = chartModel;
    this.orientation = orientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.clipped = options.clipped;

    // TODO: Dispose
    chartModel.link( () => this.updateGridLineSet() );

    this.mutate( options );
  }

  /**
   * @private
   */
  updateGridLineSet() {
    const shape = new Shape();
    this.chartModel.forEachSpacing( this.orientation, this.spacing, this.origin, this.clipped, ( modelPosition, viewPosition ) => {
      if ( this.orientation === Orientation.HORIZONTAL ) {
        shape.moveTo( viewPosition, 0 );
        shape.lineTo( viewPosition, this.chartModel.height );
      }
      else {
        shape.moveTo( 0, viewPosition );
        shape.lineTo( this.chartModel.width, viewPosition );
      }
    } );
    this.shape = shape;
  }

  /**
   * @param {number} spacing
   * @public
   */
  setSpacing( spacing ) {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.updateGridLineSet();
    }
  }
}

griddle.register( 'GridLineSet', GridLineSet );
export default GridLineSet;