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
      stroke: 'black'
    }, options );

    super( null );

    chartModel.link( () => {

      const shape = new Shape();
      chartModel.forEachSpacing( orientation, spacing, options.origin, ( modelPosition, viewPosition ) => {
        if ( orientation === Orientation.HORIZONTAL ) {
          shape.moveTo( viewPosition, 0 );
          shape.lineTo( viewPosition, chartModel.height );
        }
        else {
          shape.moveTo( 0, viewPosition );
          shape.lineTo( chartModel.width, viewPosition );
        }
      } );
      this.shape = shape;
    } );

    this.mutate( options );
  }
}

griddle.register( 'GridLineSet', GridLineSet );
export default GridLineSet;