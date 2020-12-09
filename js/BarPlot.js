// Copyright 2020, University of Colorado Boulder

/**
 * Shows bars for numerical data (where the x-value of the bar is a number). Does not support categorical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import Line from '../../scenery/js/nodes/Line.js';
import bamboo from './bamboo.js';
import Node from '../../scenery/js/nodes/Node.js';

class BarPlot extends Node {

  /**
   * @param {ChartModel} chartModel
   * @param {Vector2[]} data
   * @param {Object} [options]
   */
  constructor( chartModel, data, options ) {

    options = merge( {
      valueToColor: ( x, y ) => 'blue'
    }, options );

    super( options );

    // @private
    this.chartModel = chartModel;
    this.data = data;
    this.valueToColor = options.valueToColor;
    this.nodes = data.map( () => new Line( 0, 0, 0, 0, { lineWidth: 10 } ) );
    this.nodes.forEach( node => this.addChild( node ) );

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeBarPlot = () => {
      chartModel.unlink( update );
    };
  }

  /**
   * @public
   */
  update() {
    for ( let i = 0; i < this.nodes.length; i++ ) {
      const tail = this.chartModel.modelToViewPosition( new Vector2( this.data[ i ].x, 0 ) );
      const tip = this.chartModel.modelToViewPosition( this.data[ i ] );
      this.nodes[ i ].setLine( tail.x, tail.y, tip.x, tip.y );
      this.nodes[ i ].stroke = this.valueToColor( this.data[ i ].x, this.data[ i ].y );
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeBarPlot();
    super.dispose();
  }
}

bamboo.register( 'BarPlot', BarPlot );
export default BarPlot;