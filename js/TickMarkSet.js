// Copyright 2020, University of Colorado Boulder

/**
 * Shows tick marks within or next to a chart.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import Path from '../../scenery/js/nodes/Path.js';
import bamboo from './bamboo.js';
import ClippingType from './ClippingType.js';

class TickMarkSet extends Path {

  /**
   * @param {ChartModel} chartModel
   * @param {Orientation} axisOrientation - the progression of the ticks.  For instance HORIZONTAL has ticks at x=0,1,2, etc.
   * @param {number} spacing - in model coordinates
   * @param {Object} [options]
   */
  constructor( chartModel, axisOrientation, spacing, options ) {

    options = merge( {
      value: 0, // appear on the axis by default
      edge: null, // 'min' or 'max' put the ticks on that edge of the chart (takes precedence over value)
      origin: 0,
      stroke: 'black',
      lineWidth: 1,
      extent: 10,

      // determines whether the rounding is loose, see ChartModel
      clippingType: ClippingType.STRICT
    }, options );

    if ( options.edge ) {
      assert && assert( options.value === 0, 'value and edge are mutually exclusive' );
    }

    super( null, options );

    // @private
    this.chartModel = chartModel;
    this.axisOrientation = axisOrientation;
    this.spacing = spacing;
    this.value = options.value;
    this.edge = options.edge;
    this.origin = options.origin;
    this.extent = options.extent;
    this.clippingType = options.clippingType;

    const update = () => this.updateTickMarkSet();
    chartModel.link( update );

    // @private
    this.disposeTickMarkSet = () => chartModel.unlink( update );
  }

  /**
   * @param {number} spacing
   * @public
   */
  setSpacing( spacing ) {
    if ( spacing !== this.spacing ) {
      this.spacing = spacing;
      this.updateTickMarkSet();
    }
  }

  // @private
  updateTickMarkSet() {
    const shape = new Shape();

    this.chartModel.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clippingType, ( modelPosition, viewPosition ) => {
      const tickBounds = new Bounds2( 0, 0, 0, 0 );
      if ( this.axisOrientation === Orientation.HORIZONTAL ) {
        const viewY = this.edge === 'min' ? this.chartModel.height :
                      this.edge === 'max' ? 0 :
                      this.chartModel.modelToView( this.axisOrientation.opposite, this.value );
        shape.moveTo( viewPosition, viewY - this.extent / 2 );
        shape.lineTo( viewPosition, viewY + this.extent / 2 );
        tickBounds.setMinMax( viewPosition, viewY - this.extent / 2, viewPosition, viewY + this.extent / 2 );
      }
      else {
        const viewX = this.edge === 'min' ? 0 :
                      this.edge === 'max' ? this.chartModel.width :
                      this.chartModel.modelToView( this.axisOrientation.opposite, this.value );
        shape.moveTo( viewX - this.extent / 2, viewPosition );
        shape.lineTo( viewX + this.extent / 2, viewPosition );
        tickBounds.setMinMax( viewX - this.extent / 2, viewPosition, viewX + this.extent / 2, viewPosition );
      }
    } );

    this.shape = shape;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeTickMarkSet();
    super.dispose();
  }
}

bamboo.register( 'TickMarkSet', TickMarkSet );
export default TickMarkSet;