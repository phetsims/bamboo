// Copyright 2020, University of Colorado Boulder

import Shape from '../../../kite/js/Shape.js';
import Path from '../../../scenery/js/nodes/Path.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class LinePlot extends Path {

  constructor( chartModel, data, options ) {
    super( null, options );

    chartModel.link( () => {
      const shape = new Shape();
      for ( let i = 0; i < data.length; i++ ) {
        i === 0 && shape.moveToPoint( chartModel.modelToViewPosition( data[ i ] ) );
        i !== 0 && shape.lineToPoint( chartModel.modelToViewPosition( data[ i ] ) );
      }
      this.shape = shape;
    } );
  }
}

griddle.register( 'LinePlot', LinePlot );
export default LinePlot;