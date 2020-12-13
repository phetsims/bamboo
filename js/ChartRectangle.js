// Copyright 2020, University of Colorado Boulder

/**
 * Shows the background and border for a chart, and updates when the chart dimensions change.  This is also often used
 * for clipping via myChartRectangle.getShape()
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import bamboo from './bamboo.js';

class ChartRectangle extends Rectangle {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Object} [options]
   */
  constructor( chartTransform, options ) {

    super( 0, 0, 0, 0, options );

    // @private
    this.chartTransform = chartTransform;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeChartRectangle = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // @private
  update() {
    this.setRect( 0, 0, this.chartTransform.viewWidth, this.chartTransform.viewHeight );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeChartRectangle();
    super.dispose();
  }
}

bamboo.register( 'ChartRectangle', ChartRectangle );
export default ChartRectangle;