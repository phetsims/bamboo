// Copyright 2020, University of Colorado Boulder

import Circle from '../../../scenery/js/nodes/Circle.js';
import griddle from '../griddle.js';
import Node from '../../../scenery/js/nodes/Node.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class ScatterPlot extends Node {

  constructor( chartModel, data, options ) {
    super();

    const nodes = data.map( () => new Circle( 2, { fill: 'blue' } ) );

    nodes.forEach( node => this.addChild( node ) );

    chartModel.link( () => {
      for ( let i = 0; i < nodes.length; i++ ) {
        nodes[ i ].center = chartModel.modelToViewPosition( data[ i ] );
      }
    } );
  }
}

griddle.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;