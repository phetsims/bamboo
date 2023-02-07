// Copyright 2020-2023, University of Colorado Boulder

/**
 * Shows the background and border for a chart, and updates when the chart dimensions change.  This is also often used
 * for clipping via myChartRectangle.getShape()
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { Rectangle, RectangleOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

type SelfOptions = EmptySelfOptions;

export type ChartRectangleOptions = SelfOptions & RectangleOptions;

class ChartRectangle extends Rectangle {

  private readonly chartTransform: ChartTransform;
  private readonly disposeChartRectangle: () => void;

  public constructor( chartTransform: ChartTransform, options?: ChartRectangleOptions ) {

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

  public override dispose(): void {
    this.disposeChartRectangle();
    super.dispose();
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;