// Copyright 2020, University of Colorado Boulder

/**
 * Shows the background and border for a chart, and updates when the chart dimensions change.  This is also often used
 * for clipping via myChartRectangle.getShape()
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import bamboo from './bamboo.js';

class ChartRectangle extends Rectangle {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Object} [options]
   */
  constructor( chartTransform, options ) {

    super( 0, 0, 0, 0, options );

    // @private
    this.chartTransform = chartTransform;

    const update = () => this.updateChartRectangle();
    chartTransform.link( update );

    // @private
    this.disposeChartRectangle = () => chartTransform.unlink( update );
  }

  // @private
  updateChartRectangle() {
    this.setRect( 0, 0, this.chartTransform.width, this.chartTransform.height );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeChartRectangle();
    super.dispose();
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;