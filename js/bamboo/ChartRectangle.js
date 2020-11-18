// Copyright 2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import griddle from '../griddle.js';

class ChartRectangle extends Rectangle {
  constructor( chartModel, options ) {
    super( 0, 0, 0, 0, options );
    chartModel.link( () => this.setRect( 0, 0, chartModel.width, chartModel.height ) );
  }
}

griddle.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;