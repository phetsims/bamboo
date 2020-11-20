// Copyright 2020, University of Colorado Boulder

/**
 * Shows the background and border for a chart, and updates when the chart dimensions change.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import bamboo from './bamboo.js';

class ChartRectangle extends Rectangle {
  constructor( chartModel, options ) {
    super( 0, 0, 0, 0, options );
    chartModel.link( () => this.setRect( 0, 0, chartModel.width, chartModel.height ) );
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;