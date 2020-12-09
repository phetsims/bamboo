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
   * @param {Vector2[]} points
   * @param {Object} [options]
   */
  constructor( chartModel, points, options ) {

    options = merge( {

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to a color
      pointToColor: point => 'blue'
    }, options );

    super( options );

    // @private
    this.chartModel = chartModel;
    this.points = points;
    this.pointToColor = options.pointToColor;

    // @private {Line[]}
    this.lines = points.map( () => new Line( 0, 0, 0, 0, { lineWidth: 10 } ) );
    this.lines.forEach( node => this.addChild( node ) );

    const update = () => this.update();
    chartModel.link( update );

    // @private
    this.disposeBarPlot = () => {
      chartModel.unlink( update );
    };
  }

  /**
   * Sets points and redraws the plot.
   * @param {Vector2[]} points
   * @public
   */
  setPoints( points ) {
    this.points = points;
    this.update();
  }

  /**
   * @public
   */
  update() {
    for ( let i = 0; i < this.lines.length; i++ ) {
      const tail = this.chartModel.modelToViewPosition( new Vector2( this.points[ i ].x, 0 ) );
      const tip = this.chartModel.modelToViewPosition( this.points[ i ] );
      this.lines[ i ].setLine( tail.x, tail.y, tip.x, tip.y );
      this.lines[ i ].stroke = this.pointToColor( this.points[ i ] );
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