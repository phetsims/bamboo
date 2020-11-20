// Copyright 2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import bamboo from '../bamboo.js';

class AxisNode extends ArrowNode {

  constructor( chartModel, axisOrientation, options ) {

    options = merge( {
      value: 0, // by default the axis in on the 0, but you can put it somewhere else
      extension: 20, // in view coordinates, how far the axis goes past the edge of the chart
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );

    super( 0, 0, 0, 0, options );

    chartModel.link( () => {
      const viewValue = chartModel.modelToView( axisOrientation.opposite, options.value );

      if ( axisOrientation === Orientation.VERTICAL ) {
        this.setTailAndTip( viewValue, 0 - options.extension, viewValue, chartModel.height + options.extension );
        this.setVisible( viewValue >= 0 && viewValue <= chartModel.width );
      }
      else {
        this.setTailAndTip( 0 - options.extension, viewValue, chartModel.width + options.extension, viewValue );
        this.setVisible( viewValue >= 0 && viewValue <= chartModel.height );
      }
    } );
  }
}

bamboo.register( 'AxisNode', AxisNode );
export default AxisNode;