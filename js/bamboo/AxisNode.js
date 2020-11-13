// Copyright 2020, University of Colorado Boulder

import merge from '../../../phet-core/js/merge.js';
import ArrowNode from '../../../scenery-phet/js/ArrowNode.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class AxisNode extends ArrowNode {

  constructor( chartModel, x1, y1, x2, y2, options ) {

    options = merge( {
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );
    const viewX1 = chartModel.modelViewTransform.modelToViewX( x1 );
    const viewY1 = chartModel.modelViewTransform.modelToViewY( y1 );
    const viewX2 = chartModel.modelViewTransform.modelToViewX( x2 );
    const viewY2 = chartModel.modelViewTransform.modelToViewX( y2 );

    super( viewX1, viewY1, viewX2, viewY2, options );
  }
}

griddle.register( 'AxisNode', AxisNode );
export default AxisNode;