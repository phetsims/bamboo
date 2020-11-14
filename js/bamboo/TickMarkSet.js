// Copyright 2020, University of Colorado Boulder

import Bounds2 from '../../../dot/js/Bounds2.js';
import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import griddle from '../griddle.js';

/**
 * Draws a set of lines within a graph.  For example, the minor horizontal lines.  Back-computes the model
 * locations given the view area.
 * @author Sam Reid (PhET Interactive Simulations)
 */

// TODO: Shared code with GridLineSet
class TickMarkSet extends Path {

  /**
   * @param chartModel
   * @param orientation
   * @param {number} spacing - in model coordinates
   * @param options
   */
  constructor( chartModel, orientation, spacing, options ) {
    options = merge( {
      value: 0, // appear on the axis by default
      origin: 0,
      stroke: 'black',
      lineWidth: 2,
      extent: 10,
      createLabel: value => new Text( value.toFixed( 1 ), { fontSize: 12 } ),
      positionLabel: ( label, tickBounds, orientation ) => {
        if ( orientation === Orientation.HORIZONTAL ) {

          // ticks flow horizontally, so tick labels should be below
          label.centerTop = tickBounds.centerBottom.plusXY( 0, 1 );
        }
        else {
          label.rightCenter = tickBounds.leftCenter.plusXY( -1, 0 );
        }
        return label;
      }
    }, options );

    super( null );

    // cache labels for quick reuse
    const labelMap = new Map();

    chartModel.link( () => {

      const shape = new Shape();

      const children = [];
      const used = new Set();

      chartModel.forEachSpacing( orientation, spacing, options.origin, ( modelPosition, viewPosition ) => {
        const tickBounds = new Bounds2( 0, 0, 0, 0 );
        if ( orientation === Orientation.HORIZONTAL ) {
          const viewY = chartModel.modelToView( orientation.opposite, options.value );
          shape.moveTo( viewPosition, viewY - options.extent / 2 );
          shape.lineTo( viewPosition, viewY + options.extent / 2 );
          tickBounds.setMinMax( viewPosition, viewY - options.extent / 2, viewPosition, viewY + options.extent / 2 );
        }
        else {
          const viewX = chartModel.modelToView( orientation.opposite, options.value );
          shape.moveTo( viewX - options.extent / 2, viewPosition );
          shape.lineTo( viewX + options.extent / 2, viewPosition );
          tickBounds.setMinMax( viewX - options.extent / 2, viewPosition, viewX + options.extent / 2, viewPosition );
        }

        const label = labelMap.has( modelPosition ) ? labelMap.get( modelPosition ) : options.createLabel( modelPosition );
        labelMap.set( modelPosition, label );
        options.positionLabel( label, tickBounds, orientation );
        children.push( label );
        used.add( modelPosition );
      } );

      // empty cache of unused values
      const toRemove = [];
      for ( const key of labelMap.keys() ) {
        if ( !used.has( key ) ) {
          toRemove.push( key );
        }
      }
      toRemove.forEach( t => {
        labelMap.delete( t );
      } );

      this.shape = shape;
      this.children = children;
    } );

    this.mutate( options );
  }
}

griddle.register( 'TickMarkSet', TickMarkSet );
export default TickMarkSet;