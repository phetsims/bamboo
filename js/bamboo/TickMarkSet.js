// Copyright 2020, University of Colorado Boulder

import Bounds2 from '../../../dot/js/Bounds2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Path from '../../../scenery/js/nodes/Path.js';
import griddle from '../griddle.js';

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 * @author Sam Reid (PhET Interactive Simulations)
 */
class TickMarkSet extends Path {

  /**
   * @param chartModel
   * @param {Orientation} orientation - the progression of the ticks.  For instance HORIZONTAL has ticks at x=0,1,2, etc.
   * @param {number} spacing - in model coordinates
   * @param options
   */
  constructor( chartModel, orientation, spacing, options ) {
    options = merge( {
      value: 0, // appear on the axis by default
      edge: null, // 'min' or 'max' put the ticks on that edge of the chart (takes precedence over value)
      origin: 0,
      stroke: 'black',
      lineWidth: 1,
      extent: 10,

      // determines whether the rounding is loose, see ChartModel
      clipped: false
    }, options );

    if ( options.edge ) {
      assert && assert( options.value === 0, 'value and edge are mutually exclusive' );
    }

    super( null );

    chartModel.link( () => {

      const shape = new Shape();

      const children = [];
      const used = new Set();

      chartModel.forEachSpacing( orientation, spacing, options.origin, options.clipped, ( modelPosition, viewPosition ) => {
        const tickBounds = new Bounds2( 0, 0, 0, 0 );
        if ( orientation === Orientation.HORIZONTAL ) {
          const viewY = options.edge === 'min' ? chartModel.height :
                        options.edge === 'max' ? 0 :
                        chartModel.modelToView( orientation.opposite, options.value );
          shape.moveTo( viewPosition, viewY - options.extent / 2 );
          shape.lineTo( viewPosition, viewY + options.extent / 2 );
          tickBounds.setMinMax( viewPosition, viewY - options.extent / 2, viewPosition, viewY + options.extent / 2 );
        }
        else {
          const viewX = options.edge === 'min' ? 0 :
                        options.edge === 'max' ? chartModel.width :
                        chartModel.modelToView( orientation.opposite, options.value );
          shape.moveTo( viewX - options.extent / 2, viewPosition );
          shape.lineTo( viewX + options.extent / 2, viewPosition );
          tickBounds.setMinMax( viewX - options.extent / 2, viewPosition, viewX + options.extent / 2, viewPosition );
        }

        used.add( modelPosition );
      } );

      this.shape = shape;
      this.children = children;
    } );

    this.mutate( options );
  }
}

griddle.register( 'TickMarkSet', TickMarkSet );
export default TickMarkSet;