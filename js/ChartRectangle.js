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
   * @param {ChartModel} chartModel
   * @param {Object} [options]
   */
  constructor( chartModel, options ) {
    super( 0, 0, 0, 0, options );
    chartModel.link( () => this.setRect( 0, 0, chartModel.width, chartModel.height ) );
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;