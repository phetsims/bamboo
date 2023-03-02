// Copyright 2021-2023, University of Colorado Boulder

/**
 * Shows a plot with arrows for numerical data (where the x-value of the bar is a number).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import optionize from '../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../scenery-phet/js/ArrowNode.js';
import { Node, NodeOptions, PAINTABLE_DEFAULT_OPTIONS, PaintableOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

// constants
const DEFAULT_ARROW_PAINTABLE_OPTIONS = { fill: 'black' };

type SelfOptions = {
  arrowNodeOptions?: ArrowNodeOptions;
  pointToPaintableFields?: ( point: Vector2 ) => PaintableOptions;
};

export type UpDownArrowPlotOptions = SelfOptions & NodeOptions;

class UpDownArrowPlot extends Node {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update
  public dataSet: Vector2[];
  private readonly pointToPaintableFields: ( point: Vector2 ) => PaintableOptions;
  private arrowNodes: ArrowNode[];
  private readonly arrowNodeOptions: ArrowNodeOptions;
  private readonly disposeUpDownArrowPLot: () => void;

  public constructor( chartTransform: ChartTransform, dataSet: Vector2[], providedOptions?: UpDownArrowPlotOptions ) {

    const options = optionize<UpDownArrowPlotOptions, SelfOptions, NodeOptions>()( {

      // {Object} - Options passed along to each ArrowNode to set its Shape. Can not
      // include Paintable options, those should be provided by pointToPaintableFields.
      arrowNodeOptions: {},

      // NOTE: cannot use the "Options" suffix because merge will try to merge that as nested options.
      // A function that will return the Paintable options for the ArrowNode at the provided point in model coordinates.
      pointToPaintableFields: ( point: Vector2 ) => DEFAULT_ARROW_PAINTABLE_OPTIONS
    }, providedOptions );

    super( options );

    assert && assert(
      Object.keys( options.arrowNodeOptions ).filter( key => Object.keys( PAINTABLE_DEFAULT_OPTIONS ).includes( key ) ).length === 0,
      'arrowNodeOptions should not include Paintable options, use pointToPaintableFields instead'
    );

    this.chartTransform = chartTransform;

    this.dataSet = dataSet;

    this.pointToPaintableFields = options.pointToPaintableFields;
    this.arrowNodeOptions = options.arrowNodeOptions;
    this.arrowNodes = [];

    this.setDataSet( dataSet );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeUpDownArrowPLot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // Sets the dataSet and redraws the plot.
  public setDataSet( dataSet: Vector2[] ): void {
    this.dataSet = dataSet;
    this.update();
  }

  /**
   * Redraw the plot. Called automatically if you update the dataSet with setDataSet(). But you can call this
   * yourself if you want to set the dataSet directly and then update later (presumably for performance).
   */
  public update(): void {

    // add one rectangle per data point
    while ( this.arrowNodes.length < this.dataSet.length ) {
      const arrowNode = new ArrowNode( 0, 0, 0, 0, this.arrowNodeOptions );
      this.arrowNodes.push( arrowNode );
      this.addChild( arrowNode );
    }

    // if any data points were removed, remove any extra ArrowNodes
    while ( this.arrowNodes.length > this.dataSet.length ) {
      const arrowNode = this.arrowNodes.pop()!;
      this.removeChild( arrowNode );
    }

    for ( let i = 0; i < this.arrowNodes.length; i++ ) {
      const dataPoint = this.dataSet[ i ];

      const tail = this.chartTransform.modelToViewPosition( new Vector2( dataPoint.x, 0 ) );
      const tip = this.chartTransform.modelToViewPosition( dataPoint );
      this.arrowNodes[ i ].setTailAndTip( tail.x, tail.y, tip.x, tip.y );

      const providedOptions = this.pointToPaintableFields( dataPoint );
      assert && assert(
        Object.keys( providedOptions ).filter( key => !Object.keys( PAINTABLE_DEFAULT_OPTIONS ).includes( key ) ).length === 0,
        'options contain keys that could be dangerous for mutate'
      );

      this.arrowNodes[ i ].mutate( providedOptions );
    }
  }

  public override dispose(): void {
    this.disposeUpDownArrowPLot();
    super.dispose();
  }
}

bamboo.register( 'UpDownArrowPlot', UpDownArrowPlot );
export default UpDownArrowPlot;
