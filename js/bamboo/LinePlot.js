// Copyright 2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import Path from '../../../scenery/js/nodes/Path.js';
import griddle from '../griddle.js';

class LinePlot extends Path {

  constructor( chartModel, data, options ) {
    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.data = data;
    chartModel.link( () => this.update() );
  }

  // @public
  // TODO: renders 2x/frame if a data point is added and the chart scrolls
  update() {
    const shape = new Shape();
    let moveToNextPoint = true;
    for ( let i = 0; i < this.data.length; i++ ) {

      // NaN or Infinite components "pen up" and stop drawing
      if ( this.data[ i ].isFinite() ) {
        const viewPoint = this.chartModel.modelToViewPosition( this.data[ i ] );
        if ( moveToNextPoint ) {
          shape.moveToPoint( viewPoint );
          moveToNextPoint = false;
        }
        else {
          shape.lineToPoint( viewPoint );
        }
      }
      else {
        moveToNextPoint = true;
      }
    }
    this.shape = shape;
  }
}

griddle.register( 'LinePlot', LinePlot );
export default LinePlot;