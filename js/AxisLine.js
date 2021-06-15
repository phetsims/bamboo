// Copyright 2020, University of Colorado Boulder

/**
 * AxisLine is an axis that consists of a line, with no arrow heads.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import Line from '../../scenery/js/nodes/Line.js';
import bamboo from './bamboo.js';

class AxisLine extends Line {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Orientation} axisOrientation - which axis is represented
   * @param {Object} [options]
   */
  constructor( chartTransform, axisOrientation, options ) {

    options = merge( {
      value: 0, // by default the axis is at 0, but you can put it somewhere else
      extension: 0, // in view coordinates, how far the axis goes past the edge of the ChartRectangle
      stroke: 'black',
      lineWidth: 2
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
    this.disposeAxisLine = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // @private
  update() {
    const viewValue = this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );

    // Move the axis to viewValue.
    if ( this.axisOrientation === Orientation.VERTICAL ) {
      this.setLine( viewValue, 0 - this.extension, viewValue, this.chartTransform.viewHeight + this.extension );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewWidth );
    }
    else {
      this.setLine( 0 - this.extension, viewValue, this.chartTransform.viewWidth + this.extension, viewValue );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewHeight );
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeAxisLine();
    super.dispose();
  }
}

bamboo.register( 'AxisLine', AxisLine );
export default AxisLine;