// Copyright 2020, University of Colorado Boulder

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

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to an object containing Paintable options
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
   * Sets dataSet and redraws the plot.
   * @param {Vector2[]} dataSet
   * @public
   */
  setDataSet( dataSet ) {
    this.rectangles.forEach( rectangle => this.removeChild( rectangle ) );

    this.dataSet = dataSet;

    this.rectangles = dataSet.map( () => new Rectangle( 0, 0, 0, 0 ) );
    this.rectangles.forEach( rectangle => this.addChild( rectangle ) );

    this.update();
  }

  /**
   * @public
   */
  update() {
    for ( let i = 0; i < this.rectangles.length; i++ ) {
      const tail = this.chartTransform.modelToViewPosition( new Vector2( this.dataSet[ i ].x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );

      // rectangles cannot have negative height, construct the rectangle then move its 'tail' to the origin
      // if it extends in the -y direction in view coordinates
      const rectHeight = tip.y - tail.y;
      this.rectangles[ i ].setRect( tail.x - this.barWidth / 2, tail.y, this.barWidth, Math.abs( rectHeight ) );
      if ( rectHeight < 0 ) {
        this.rectangles[ i ].bottom = this.chartTransform.modelToViewY( 0 );
      }

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