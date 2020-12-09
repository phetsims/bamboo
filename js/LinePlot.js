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
   * @param {Vector2[]} points
   * @param {Object} [options]
   */
  constructor( chartModel, points, options ) {

    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.points = points;

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeLinePlot = () => chartModel.unlink( update );
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
    let moveToNextPoint = true;
    for ( let i = 0; i < this.points.length; i++ ) {

      // NaN or Infinite components "pen up" and stop drawing
      if ( this.points[ i ].isFinite() ) {
        const viewPoint = this.chartModel.modelToViewPosition( this.points[ i ] );
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

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeLinePlot();
    super.dispose();
  }
}

bamboo.register( 'LinePlot', LinePlot );
export default LinePlot;