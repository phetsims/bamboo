// Copyright 2020-2023, University of Colorado Boulder

/**
 * Shows bars for numerical data (where the x-value of the bar is a number). Does not support categorical data.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import optionize from '../../phet-core/js/optionize.js';
import { Node, NodeOptions, PAINTABLE_DEFAULT_OPTIONS, PaintableOptions, Rectangle } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

// constants
const DEFAULT_PAINTABLE_OPTIONS = { fill: 'black' };

type SelfOptions = {

  // width in view coordinates of each bar in the plot
  barWidth?: number;
  barTailValue?: number;

  // maps a point to a containing Paintable options
  // NOTE: cannot use the "Options" suffix because merge will try to merge that as nested options.
  pointToPaintableFields?: ( point: Vector2 ) => PaintableOptions;
};
export type BarPlotOptions = SelfOptions & NodeOptions;

class BarPlot extends Node {
  private chartTransform: ChartTransform;
  private barTailValue: number;

  // if you change this directly, you are responsible for calling update
  public dataSet: Vector2[];
  public barWidth: number;
  private readonly pointToPaintableFields: ( point: Vector2 ) => PaintableOptions;
  public rectangles: Rectangle[];
  private readonly disposeBarPlot: () => void;

  public constructor( chartTransform: ChartTransform, dataSet: Vector2[], providedOptions?: BarPlotOptions ) {

    const options = optionize<BarPlotOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      barWidth: 10,
      barTailValue: 0,
      pointToPaintableFields: ( point: Vector2 ) => DEFAULT_PAINTABLE_OPTIONS
    }, providedOptions );

    super( options );

    this.chartTransform = chartTransform;
    this.barTailValue = options.barTailValue;
    this.dataSet = dataSet;

    this.barWidth = options.barWidth;
    this.pointToPaintableFields = options.pointToPaintableFields;

    this.rectangles = [];
    this.setDataSet( dataSet );

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeBarPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setDataSet( dataSet: Vector2[] ): void {
    this.dataSet = dataSet;
    this.update();
  }

  public update(): void {

    // Add one rectangle per data point.
    while ( this.rectangles.length < this.dataSet.length ) {
      const rectangle = new Rectangle( 0, 0, 0, 0 );
      this.rectangles.push( rectangle );
      this.addChild( rectangle );
    }

    // If any data points were removed, remove any extra rectangles.
    while ( this.rectangles.length > this.dataSet.length ) {
      const rectangle = this.rectangles.pop()!;
      this.removeChild( rectangle );
    }

    for ( let i = 0; i < this.rectangles.length; i++ ) {
      const tail = this.chartTransform.modelToViewPosition( new Vector2( this.dataSet[ i ].x, this.barTailValue ) );
      const tip = this.chartTransform.modelToViewPosition( this.dataSet[ i ] );

      // rectangles cannot have negative height, determine the bottom so its "tail" is at the origin
      const rectHeight = tip.y - tail.y;
      const bottom = Math.min( tail.y, tip.y );
      this.rectangles[ i ].setRect( tail.x - this.barWidth / 2, bottom, this.barWidth, Math.abs( rectHeight ) );

      const paintableFields = this.pointToPaintableFields( this.dataSet[ i ] );
      assert && assert(
        Object.keys( paintableFields ).filter( key => !Object.keys( PAINTABLE_DEFAULT_OPTIONS ).includes( key ) ).length === 0,
        'options contain keys that could be dangerous for mutate'
      );

      this.rectangles[ i ].mutate( paintableFields );
    }
  }

  public override dispose(): void {
    this.disposeBarPlot();
    super.dispose();
  }
}

bamboo.register( 'BarPlot', BarPlot );
export default BarPlot;
