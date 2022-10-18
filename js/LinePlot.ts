// Copyright 2020-2022, University of Colorado Boulder

/**
 * LinePlot renders a {Array.<Vector2|null>} dataSet by connecting the points with line segments.
 *
 * Null values are skipped and allow you to create gaps in a plot. Examples:
 * dataset [ (0,0), (0,1), (0,2), (0,3) ] => 3 lines segments, connecting consecutive points
 * dataset [ (0,0), (0,1), null, (0,2), (0,3) ] => 2 lines segments, connecting the first 2 and last 2 points
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { Path, PathOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

type SelfOptions = EmptySelfOptions;
export type LinePlotOptions = SelfOptions & PathOptions;

class LinePlot extends Path {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update
  public dataSet: ( Vector2 | null )[];
  private readonly disposeLinePlot: () => void;

  public constructor( chartTransform: ChartTransform, dataSet: ( Vector2 | null )[], providedOptions?: LinePlotOptions ) {

    const options = optionize<LinePlotOptions, SelfOptions, PathOptions>()( {

      // Path options
      stroke: 'black'
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.dataSet = dataSet;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the dataSet and redraws the plot. If instead the dataSet array is mutated, it is the client's responsibility
   * to call `update` or make sure `update` is called elsewhere (say, if the chart scrolls in that frame).
   */
  public setDataSet( dataSet: ( Vector2 | null )[] ): void {
    this.dataSet = dataSet;
    this.update();
  }

  // Recomputes the rendered shape.
  public update(): void {
    const shape = new Shape();
    let moveToNextPoint = true;
    for ( let i = 0; i < this.dataSet.length; i++ ) {

      const dataPoint = this.dataSet[ i ];
      assert && assert( dataPoint === null || dataPoint.isFinite(), 'data points must be finite Vector2 or null' );

      // Draw a line segment to the next non-null value. Null values result in a gap (via move) in the plot.
      if ( dataPoint ) {
        const viewPoint = this.chartTransform.modelToViewPosition( dataPoint );
        if ( moveToNextPoint ) {
          shape.moveToPoint( viewPoint );
          moveToNextPoint = false;
        }
        else {
          shape.lineToPoint( viewPoint );
        }
      }
      else {
        moveToNextPoint = true;
      }
    }
    this.shape = shape.makeImmutable();
  }

  public override dispose(): void {
    this.disposeLinePlot();
    super.dispose();
  }
}

bamboo.register( 'LinePlot', LinePlot );
export default LinePlot;