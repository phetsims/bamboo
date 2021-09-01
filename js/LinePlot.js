// Copyright 2020-2021, University of Colorado Boulder

/**
 * LinePlot renders a {Array.<Vector2|null>} dataSet by connecting the points with line segments.
 *
 * Null values are skipped and allow you to create gaps in a plot. Examples:
 * dataset [ (0,0), (0,1), (0,2), (0,3) ] => 3 lines segments, connecting consecutive points
 * dataset [ (0,0), (0,1), null, (0,2), (0,3) ] => 2 lines segments, connecting the first 2 and last 2 points
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';

class LinePlot extends Path {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // Path options
      stroke: 'black'
    }, options );

    super( null, options );

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * Recomputes the rendered shape.
   * @public
   */
  update() {
    const shape = new Shape();
    let moveToNextPoint = true;
    for ( let i = 0; i < this.dataSet.length; i++ ) {

      assert && assert( this.dataSet[ i ] === null || this.dataSet[ i ].isFinite(), 'data points must be finite Vector2 or null' );

      // Draw a line segment to the next non-null value. Null values result in a gap (via move) in the plot.
      if ( this.dataSet[ i ] ) {
        const viewPoint = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
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
    this.shape = shape.makeImmutable();
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