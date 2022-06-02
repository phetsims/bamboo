// Copyright 2020-2021, University of Colorado Boulder

/**
 * Shows the background and border for a chart, and updates when the chart dimensions change.  This is also often used
 * for clipping via myChartRectangle.getShape()
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Rectangle } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

class ChartRectangle extends Rectangle {
  private chartTransform: ChartTransform;
  private disposeChartRectangle: () => void;

  constructor( chartTransform: ChartTransform, options?: any ) {

    super( 0, 0, 0, 0, options );

    this.chartTransform = chartTransform;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeChartRectangle = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  private update(): void {
    this.setRect( 0, 0, this.chartTransform.viewWidth, this.chartTransform.viewHeight );
  }

  override dispose(): void {
    this.disposeChartRectangle();
    super.dispose();
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;