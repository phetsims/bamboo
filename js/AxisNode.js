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
   * @param {ChartModel} chartModel
   * @param {Orientation} axisOrientation - which axis is represented
   * @param {Object} [options]
   */
  constructor( chartModel, axisOrientation, options ) {

    options = merge( {
      value: 0, // by default the axis in on the 0, but you can put it somewhere else
      extension: 20, // in view coordinates, how far the axis goes past the edge of the chart
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );

    super( 0, 0, 0, 0, options );

    chartModel.link( () => {
      const viewValue = chartModel.modelToView( axisOrientation.opposite, options.value );

      if ( axisOrientation === Orientation.VERTICAL ) {
        this.setTailAndTip( viewValue, 0 - options.extension, viewValue, chartModel.height + options.extension );
        this.setVisible( viewValue >= 0 && viewValue <= chartModel.width );
      }
      else {
        this.setTailAndTip( 0 - options.extension, viewValue, chartModel.width + options.extension, viewValue );
        this.setVisible( viewValue >= 0 && viewValue <= chartModel.height );
      }
    } );
  }
}

bamboo.register( 'AxisNode', AxisNode );
export default AxisNode;