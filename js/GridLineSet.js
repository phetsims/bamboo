// Copyright 2020, University of Colorado Boulder

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';

class GridLineSet extends Path {

  /**
   * @param {ChartModel} chartModel
   * @param {Orientation} axisOrientation - axis along which successive grid lines appear.  For example,
   *                                      - grid lines that are drawn horizontally progress up the Orientation.VERTICAL axis
   * @param {number} spacing - in model coordinates
   * @param {Object} [options]
   */
  constructor( chartModel, axisOrientation, spacing, options ) {

    options = merge( {
      origin: 0,
      clippingType: ClippingType.STRICT,

      // Path options
      stroke: 'black'
    }, options );

    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.clippingType = options.clippingType;

    const update = () => this.updateGridLineSet();
    chartModel.link( update );

    // @private
    this.disposeGridLineSet = () => chartModel.unlink( update );
  }

  /**
   * @private
   */
  updateGridLineSet() {
    const shape = new Shape();
    this.chartModel.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType, ( modelPosition, viewPosition ) => {
      if ( this.axisOrientation === Orientation.VERTICAL ) {
        shape.moveTo( 0, viewPosition );
        shape.lineTo( this.chartModel.width, viewPosition );
      }
      else {
        shape.moveTo( viewPosition, 0 );
        shape.lineTo( viewPosition, this.chartModel.height );
      }
    } );
    this.shape = shape;
  }

  /**
   * @param {number} spacing
   * @public
   */
  setSpacing( spacing ) {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.updateGridLineSet();
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeGridLineSet();
    super.dispose();
  }
}

bamboo.register( 'GridLineSet', GridLineSet );
export default GridLineSet;