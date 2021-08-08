// Copyright 2020-2021, University of Colorado Boulder

/**
 * Shows bars for numerical data (where the x-value of the bar is a number). Does not support categorical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Paintable from '../../scenery/js/nodes/Paintable.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import bamboo from './bamboo.js';

// constants
const DEFAULT_PAINTABLE_OPTIONS = { fill: 'black' };

class BarPlot extends Node {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // {number} - width in view coordinates of each bar in the plot
      barWidth: 10,

      // {function(vector:Vector2):Object} maps a {Vector2} point to an {Object} containing Paintable options
      // NOTE: cannot use the "Options" suffix because merge will try to merge that as nested options.
      pointToPaintableFields: point => DEFAULT_PAINTABLE_OPTIONS
    }, options );

    super( options );

    // @private
    this.chartTransform = chartTransform;

    // @public if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.barWidth = options.barWidth;

    // @private
    this.pointToPaintableFields = options.pointToPaintableFields;

    // @private {Rectangle[]}
    this.rectangles = [];
    this.setDataSet( dataSet );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeBarPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
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

    // Add one rectangle per data point.
    while ( this.rectangles.length < this.dataSet.length ) {
      const rectangle = new Rectangle( 0, 0, 0, 0 );
      this.rectangles.push( rectangle );
      this.addChild( rectangle );
    }

    // If any data points were removed, remove any extra rectangles.
    while ( this.rectangles.length > this.dataSet.length ) {
      const rectangle = this.rectangles.pop();
      this.removeChild( rectangle );
    }

    for ( let i = 0; i < this.rectangles.length; i++ ) {
      const tail = this.chartTransform.modelToViewPosition( new Vector2( this.dataSet[ i ].x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );

      // rectangles cannot have negative height, determine the bottom so its "tail" is at the origin
      const rectHeight = tip.y - tail.y;
      const bottom = Math.min( tail.y, tip.y );
      this.rectangles[ i ].setRect( tail.x - this.barWidth / 2, bottom, this.barWidth, Math.abs( rectHeight ) );

      const providedOptions = this.pointToPaintableFields( this.dataSet[ i ] );
      assert && assert(
        Object.keys( providedOptions ).filter( key => !Object.keys( Paintable.DEFAULT_OPTIONS ).includes( key ) ).length === 0,
        'options contain keys that could be dangerous for mutate'
      );

      this.rectangles[ i ].mutate( providedOptions );
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