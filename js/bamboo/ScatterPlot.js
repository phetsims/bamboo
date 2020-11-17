// Copyright 2020, University of Colorado Boulder

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class ScatterPlot extends Path {

  constructor( chartModel, data, options ) {
    options = merge( {
      radius: 2
    }, options );
    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.data = data;
    this.radius = options.radius;

    chartModel.link( () => this.update() );
  }

  // @public
  // TODO: renders 2x/frame if a data point is added and the chart scrolls
  update() {
    const shape = new Shape();
    for ( let i = 0; i < this.data.length; i++ ) {

      // NaN or Infinite components draw nothing
      if ( this.data[ i ].isFinite() ) {
        const viewPoint = this.chartModel.modelToViewPosition( this.data[ i ] );
        shape.moveToPoint( viewPoint );
        shape.circle( viewPoint.x, viewPoint.y, this.radius );
      }
    }
    this.shape = shape;
  }
}

griddle.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;