// Copyright 2020, University of Colorado Boulder

import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class AxisNode extends ArrowNode {

  constructor( chartModel, orientation, options ) {

    options = merge( {
      value: 0, // by default the axis in on the 0, but you can put it somewhere else
      extension: 20, // in view coordinates, how far the axis goes past the edge of the chart
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );

    super( 0, 0, 0, 0, options );

    chartModel.modelViewTransformProperty.link( modelViewTransform => {
      const viewValue = orientation.opposite.modelToView( modelViewTransform, options.value );

      if ( orientation === Orientation.VERTICAL ) {
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

griddle.register( 'AxisNode', AxisNode );
export default AxisNode;