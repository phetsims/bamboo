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
import Paintable from '../../scenery/js/nodes/Paintable.js';
import bamboo from './bamboo.js';

// constants
const DEFAULT_PAINTABLE_OPTIONS = { fill: 'black' };

class UpDownArrowPlot extends Node {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Vector2[]} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform, dataSet, options ) {

    options = merge( {

      // {Object} - Options passed along to each ArrowNode to set its Shape. Can not
      // include Paintable options, those should be provided by pointToPaintableFields.
      arrowNodeOptions: {},

      // {function(vector:Vector2):ColorDef} maps a {Vector2} point to an object containing ArrowNode options
      // NOTE: cannot use the "Options" suffix because merge will try to merge that as nested options.
      pointToPaintableFields: point => DEFAULT_PAINTABLE_OPTIONS
    }, options );

    super( options );

    assert && assert(
      Object.keys( options.arrowNodeOptions ).filter( key => Object.keys( Paintable.DEFAULT_OPTIONS ).includes( key ) ).length === 0,
      'arrowNodeOptions should not include Paintable options, use pointToPaintableFields instead'
    );

    // @private
    this.chartTransform = chartTransform;

    // @public - if you change this directly, you are responsible for calling update
    this.dataSet = dataSet;

    // @private
    this.pointToPaintableFields = options.pointToPaintableFields;
    this.arrowNodeOptions = options.arrowNodeOptions;

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

    // add one rectangle per data point
    while ( this.arrowNodes.length < this.dataSet.length ) {
      const arrowNode = new ArrowNode( 0, 0, 0, 0, this.arrowNodeOptions );
      this.arrowNodes.push( arrowNode );
      this.addChild( arrowNode );
    }

    // if any data points were removed, remove any extra ArrowNodes
    while ( this.arrowNodes.length > this.dataSet.length ) {
      const arrowNode = this.arrowNodes.pop();
      this.removeChild( arrowNode );
    }

    for ( let i = 0; i < this.arrowNodes.length; i++ ) {
      const dataPoint = this.dataSet[ i ];

      const tail = this.chartTransform.modelToViewPosition( new Vector2( dataPoint.x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( dataPoint );
      this.arrowNodes[ i ].setTailAndTip( tail.x, tail.y, tip.x, tip.y );

      const providedOptions = this.pointToPaintableFields( dataPoint );
      assert && assert(
        Object.keys( providedOptions ).filter( key => !Object.keys( Paintable.DEFAULT_OPTIONS ).includes( key ) ).length === 0,
        'options contain keys that could be dangerous for mutate'
      );
      this.arrowNodes[ i ].mutate( providedOptions );
    }
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
