// Copyright 2020, University of Colorado Boulder

import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import Line from '../../../scenery/js/nodes/Line.js';
import griddle from '../griddle.js';
import Node from '../../../scenery/js/nodes/Node.js';

/**
 * Numerical, not categorical.
 * @author Sam Reid (PhET Interactive Simulations)
 */

class BarPlot extends Node {

  constructor( chartModel, data, options ) {
    options = merge( {
      valueToColor: ( x, y ) => 'blue'
    }, options );
    super( options );

    const nodes = data.map( () => new Line( 0, 0, 0, 0, { lineWidth: 10 } ) );

    nodes.forEach( node => this.addChild( node ) );

    chartModel.link( () => {
      for ( let i = 0; i < nodes.length; i++ ) {
        const tail = chartModel.modelToViewPosition( new Vector2( data[ i ].x, 0 ) );
        const tip = chartModel.modelToViewPosition( data[ i ] );
        nodes[ i ].setLine( tail.x, tail.y, tip.x, tip.y );
        nodes[ i ].stroke = options.valueToColor( data[ i ].x, data[ i ].y );
      }
    } );
  }
}

griddle.register( 'BarPlot', BarPlot );
export default BarPlot;