// Copyright 2020-2021, University of Colorado Boulder

/**
 * Renders a dataset of Vector2[] using circles.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import merge from '../../phet-core/js/merge.js';
import { Path } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

class ScatterPlot extends Path {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update
  dataSet: Vector2[];
  private radius: number;
  private disposeScatterPlot: () => void;

  constructor( chartTransform: ChartTransform, dataSet: Vector2[], options?: any ) {

    options = merge( {
      radius: 2,

      // Path options
      fill: 'black'
    }, options );

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
  setDataSet( dataSet: Vector2[] ) {
    this.dataSet = dataSet;
    this.update();
  }

  // Recomputes the rendered shape.
  update() {
    const shape = new Shape();
    const length = this.dataSet.length;
    for ( let i = 0; i < length; i++ ) {

      // NaN or Infinite components draw nothing
      const dataPoint = this.dataSet[ i ];
      if ( dataPoint.isFinite() ) {
        const viewPoint = this.chartTransform.modelToViewPosition( dataPoint );
        shape.moveToPoint( viewPoint );
        shape.circle( viewPoint.x, viewPoint.y, this.radius );
      }
    }
    this.shape = shape.makeImmutable();
  }

  dispose() {
    this.disposeScatterPlot();
    super.dispose();
  }
}

bamboo.register( 'ScatterPlot', ScatterPlot );
export default ScatterPlot;