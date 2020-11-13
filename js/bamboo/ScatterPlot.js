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

    const childLayer = new Node();
    this.addChild( childLayer );
    chartModel.modelViewTransformProperty.link( modelViewTransform => {
      childLayer.children = data.map( dataPoint => {
        return new Circle( 2, {
          fill: 'blue',
          center: modelViewTransform.modelToViewPosition( dataPoint )
        } );
      } );
    } );
  }
}

griddle.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;