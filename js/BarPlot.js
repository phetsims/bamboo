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
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to a color
      pointToColor: point => 'black'
    }, options );

    super( options );

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.pointToColor = options.pointToColor;

    // @private {Line[]}
    this.lines = [];
    this.setDataSet( dataSet );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeBarPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets dataSet and redraws the plot.
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.lines.forEach( line => this.removeChild( line ) );

    this.dataSet = dataSet;

    this.lines = dataSet.map( () => new Line( 0, 0, 0, 0, { lineWidth: 10 } ) );
    this.lines.forEach( line => this.addChild( line ) );

    this.update();
  }

  /**
   * @public
   */
  update() {
    for ( let i = 0; i < this.lines.length; i++ ) {
      const tail = this.chartTransform.modelToViewPosition( new Vector2( this.dataSet[ i ].x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );
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