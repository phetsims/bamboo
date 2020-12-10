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
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartModel, dataSet, options ) {

    options = merge( {

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to a color
      pointToColor: point => 'black'
    }, options );

    super( options );

    // @private
    this.chartModel = chartModel;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.pointToColor = options.pointToColor;

    // @private {Line[]}
    this.lines = dataSet.map( () => new Line( 0, 0, 0, 0, { lineWidth: 10 } ) );
    this.lines.forEach( node => this.addChild( node ) );

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeBarPlot = () => {
      chartModel.unlink( update );
    };
  }

  /**
   * Sets dataSet and redraws the plot.
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * @public
   */
  update() {
    for ( let i = 0; i < this.lines.length; i++ ) {
      const tail = this.chartModel.modelToViewPosition( new Vector2( this.dataSet[ i ].x, 0 ) );
      const tip = this.chartModel.modelToViewPosition( this.dataSet[ i ] );
      this.lines[ i ].setLine( tail.x, tail.y, tip.x, tip.y );
      this.lines[ i ].stroke = this.pointToColor( this.dataSet[ i ] );
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