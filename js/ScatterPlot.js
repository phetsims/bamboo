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
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartModel, dataSet, options ) {

    options = merge( {
      fill: 'black',
      radius: 2
    }, options );

    super( null, options );

    // @private
    this.chartModel = chartModel;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.radius = options.radius;

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeScatterPlot = () => {
      chartModel.unlink( update );
    };
  }

  /**
   * Sets dataSet and redraws the plot.
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  // TODO: renders 2x/frame if a point is added and the chart scrolls
  /**
   * @public
   */
  update() {
    const shape = new Shape();
    for ( let i = 0; i < this.dataSet.length; i++ ) {

      // NaN or Infinite components draw nothing
      if ( this.dataSet[ i ].isFinite() ) {
        const viewPoint = this.chartModel.modelToViewPosition( this.dataSet[ i ] );
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