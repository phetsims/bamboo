// Copyright 2021, University of Colorado Boulder

/**
 * Shows a plot with arrows for numerical data (where the x-value of the bar is a number).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import ArrowNode from '../../scenery-phet/js/ArrowNode.js';
import Node from '../../scenery/js/nodes/Node.js';
import bamboo from './bamboo.js';

// constants
// default options for each ArrowNode of the plot, just using ArrowNode defaults
const DEFAULT_ARROW_NODE_OPTIONS = {};

class UpDownArrowPlot extends Node {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to an object containing ArrowNode options
      // NOTE: cannot use the "Options" suffix because merge will try to merge that as nested options.
      pointToArrowNodeFields: point => DEFAULT_ARROW_NODE_OPTIONS
    }, options );

    super( options );

    // @private
    this.chartTransform = chartTransform;

    // @public - if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.pointToArrowNodeFields = options.pointToArrowNodeFields;

    // @private {ArrowNode[]}
    this.arrowNodes = [];

    this.setDataSet( dataSet );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeUpDownArrowPLot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot.
   * @public
   *
   * @param {Vector2[]} dataSet
   */
  setDataSet( dataSet ) {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * Redraw the plot. Called automatically if you update the dataSet with setDataSet(). But you can call this
   * yourself if you want to set the dataSet directly and then update later (presumably for performance).
   * @public
   */
  update() {

    // first remove all old arrows, we will create and add new ones every update
    this.arrowNodes.forEach( arrowNode => this.removeChild( arrowNode ) );

    this.dataSet.forEach( dataPoint => {
      const tail = this.chartTransform.modelToViewPosition( new Vector2( dataPoint.x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( dataPoint );

      const arrowNode = new ArrowNode( tail.x, tail.y, tip.x, tip.y, this.pointToArrowNodeFields( dataPoint ) );

      this.arrowNodes.push( arrowNode );
      this.addChild( arrowNode );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeUpDownArrowPLot();
    super.dispose();
  }
}

bamboo.register( 'UpDownArrowPlot', UpDownArrowPlot );
export default UpDownArrowPlot;
