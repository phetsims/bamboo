// Copyright 2020, University of Colorado Boulder

/**
 * Shows a line that depicts an axis.  This is typically bolder than any grid line (if any), and typically at x=0 or
 * y=0, but those defaults can be overridden with options.  It has a double sided arrow, but those won't be shown if
 * this is added to the clipping area of a chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import ArrowNode from '../../scenery-phet/js/ArrowNode.js';
import bamboo from './bamboo.js';

class AxisNode extends ArrowNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Orientation} axisOrientation - which axis is represented
   * @param {Object} [options]
   */
  constructor( chartTransform, axisOrientation, options ) {

    options = merge( {
      value: 0, // by default the axis is at 0, but you can put it somewhere else
      extension: 20, // in view coordinates, how far the axis goes past the edge of the ChartRectangle

      // ArrowNode options
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );

    super( 0, 0, 0, 0, options );

    // @private
    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.value = options.value;
    this.extension = options.extension;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeAxisNode = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // @private
  update() {
    const viewValue = this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );

    // Move the axis to viewValue.
    if ( this.axisOrientation === Orientation.VERTICAL ) {
      this.setTailAndTip( viewValue, 0 - this.extension, viewValue, this.chartTransform.viewHeight + this.extension );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewWidth );
    }
    else {
      this.setTailAndTip( 0 - this.extension, viewValue, this.chartTransform.viewWidth + this.extension, viewValue );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewHeight );
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeAxisNode();
    super.dispose();
  }
}

bamboo.register( 'AxisNode', AxisNode );
export default AxisNode;