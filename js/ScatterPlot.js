// Copyright 2020, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] using circles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';

class ScatterPlot extends Path {

  /**
   * @param {ChartModel} chartModel
   * @param {Vector2[]} points
   * @param {Object} [options]
   */
  constructor( chartModel, points, options ) {

    options = merge( {
      radius: 2
    }, options );

    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.points = points;
    this.radius = options.radius;

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeScatterPlot = () => {
      chartModel.unlink( update );
    };
  }

  /**
   * Sets points and redraws the plot.
   * @param {Vector2[]} points
   * @public
   */
  setPoints( points ) {
    this.points = points;
    this.update();
  }

  // TODO: renders 2x/frame if a point is added and the chart scrolls
  /**
   * @public
   */
  update() {
    const shape = new Shape();
    for ( let i = 0; i < this.points.length; i++ ) {

      // NaN or Infinite components draw nothing
      if ( this.points[ i ].isFinite() ) {
        const viewPoint = this.chartModel.modelToViewPosition( this.points[ i ] );
        shape.moveToPoint( viewPoint );
        shape.circle( viewPoint.x, viewPoint.y, this.radius );
      }
    }
    this.shape = shape;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeScatterPlot();
    super.dispose();
  }
}

bamboo.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;