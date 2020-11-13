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

    const nodes = data.map( dataPoint => {
      return new Circle( 2, {
        fill: 'blue',
        center: chartModel.modelViewTransform.modelToViewPosition( dataPoint )
      } );
    } );

    nodes.forEach( node => {
      this.addChild( node );
    } );
  }
}

griddle.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;