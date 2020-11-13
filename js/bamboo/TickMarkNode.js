// Copyright 2020, University of Colorado Boulder

import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Line from '../../../scenery/js/nodes/Line.js';
import griddle from '../griddle.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class TickMarkNode extends Line {

  constructor( chartModel, x, y, orientation, options ) {

    options = merge( {
      extent: 4,
      lineWidth: 3,
      stroke: 'black'
    }, options );

    const viewX = chartModel.modelViewTransform.modelToViewX( x );
    const viewY = chartModel.modelViewTransform.modelToViewY( y );

    const x1 = orientation === Orientation.VERTICAL ? viewX : viewX + options.extent;
    const x2 = orientation === Orientation.VERTICAL ? viewX : viewX - options.extent;

    const y1 = orientation === Orientation.VERTICAL ? viewY - options.extent : viewY;
    const y2 = orientation === Orientation.VERTICAL ? viewY + options.extent : viewY;

    super( x1, y1, x2, y2, options );
  }
}

griddle.register( 'TickMarkNode', TickMarkNode );
export default TickMarkNode;