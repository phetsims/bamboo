// Copyright 2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';

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

bamboo.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;