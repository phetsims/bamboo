// Copyright 2020, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] using Path lineTo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';

class LinePlot extends Path {

  /**
   * @param {ChartModel} chartModel
   * @param {Vector2[]} data
   * @param {Object} [options]
   */
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

bamboo.register( 'LinePlot', LinePlot );
export default LinePlot;