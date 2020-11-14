// Copyright 2020, University of Colorado Boulder

import Vector2 from '../../../dot/js/Vector2.js';
import Line from '../../../scenery/js/nodes/Line.js';
import griddle from '../griddle.js';
import Node from '../../../scenery/js/nodes/Node.js';

/**
 * Numerical, not categorical.
 * @author Sam Reid (PhET Interactive Simulations)
 */

class BarPlot extends Node {

  constructor( chartModel, data, options ) {
    super();

    const nodes = data.map( () => new Line( 0, 0, 0, 0, { lineWidth: 5, stroke: 'green' } ) );

    nodes.forEach( node => this.addChild( node ) );

    chartModel.link( modelViewTransform => {
      for ( let i = 0; i < nodes.length; i++ ) {
        const tail = chartModel.modelToViewPosition( new Vector2( data[ i ].x, 0 ) );
        const tip = chartModel.modelToViewPosition( data[ i ] );
        nodes[ i ].setLine( tail.x, tail.y, tip.x, tip.y );
      }
    } );
  }
}

griddle.register( 'BarPlot', BarPlot );
export default BarPlot;