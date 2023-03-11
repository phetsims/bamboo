// Copyright 2020-2023, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] using circles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

type SelfOptions = {
  radius?: number;
};

//TODO https://github.com/phetsims/bamboo/issues/63 If 'fill' and 'stroke' are different, overlapping points will not look correct.
export type ScatterPlotOptions = SelfOptions & PathOptions;

class ScatterPlot extends Path {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update
  public dataSet: Vector2[];
  private readonly radius: number;
  private readonly disposeScatterPlot: () => void;

  public constructor( chartTransform: ChartTransform, dataSet: Vector2[], providedOptions?: ScatterPlotOptions ) {

    const options = optionize<ScatterPlotOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      radius: 2,

      // Path options
      fill: 'black'
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;

    this.dataSet = dataSet;

    this.radius = options.radius;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeScatterPlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setDataSet( dataSet: Vector2[] ): void {
    this.dataSet = dataSet;
    this.update();
  }

  // Recomputes the rendered shape.
  public update(): void {
    const shape = new Shape();
    const length = this.dataSet.length;
    for ( let i = 0; i < length; i++ ) {

      // NaN or Infinite components draw nothing
      const dataPoint = this.dataSet[ i ];
      if ( dataPoint.isFinite() ) {
        const viewPoint = this.chartTransform.modelToViewPosition( dataPoint );
        shape.moveTo( viewPoint.x + this.radius, viewPoint.y ); // need to move to where circle actually starts
        shape.circle( viewPoint.x, viewPoint.y, this.radius );
      }
    }
    this.shape = shape.makeImmutable();
  }

  public override dispose(): void {
    this.disposeScatterPlot();
    super.dispose();
  }
}

bamboo.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;