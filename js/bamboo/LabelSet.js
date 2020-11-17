// Copyright 2020, University of Colorado Boulder

import Bounds2 from '../../../dot/js/Bounds2.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import griddle from '../griddle.js';

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */
class LabelSet extends Path {

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

      // act as if there is a tick with this extent, for positioning the label relatively
      // TODO: This seems critical to get right, if it is shared by TickMarkNode.  Also, is it odd to put this to 0 (or a small number)
      // when you don't have ticks?
      extent: 10,

      // determines whether the rounding is loose, see ChartModel
      clipped: false,

      // or return null if no label for that value
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

    if ( options.edge ) {
      assert && assert( options.value === 0, 'value and edge are mutually exclusive' );
    }

    super( null );

    // @private
    this.chartModel = chartModel;
    this.orientation = orientation;
    this.spacing = spacing;
    this.origin = options.origin;
    this.extent = options.extent;
    this.value = options.value;
    this.clipped = options.clipped;
    this.edge = options.edge;
    this.createLabel = options.createLabel;
    this.positionLabel = options.positionLabel;

    // cache labels for quick reuse
    this.labelMap = new Map();

    // TODO: Dispose
    chartModel.link( () => this.updateLabelSet() );

    this.mutate( options );
  }

  /**
   * @param {number} spacing
   * @public
   */
  setSpacing( spacing ) {
    if ( this.spacing !== spacing ) {
      this.spacing = spacing;
      this.updateLabelSet();
    }
  }

  /**
   * @private
   */
  updateLabelSet() {
    const children = [];
    const used = new Set();

    this.chartModel.forEachSpacing( this.orientation, this.spacing, this.origin, this.clipped, ( modelPosition, viewPosition ) => {
      const tickBounds = new Bounds2( 0, 0, 0, 0 );
      if ( this.orientation === Orientation.HORIZONTAL ) {
        const viewY = this.edge === 'min' ? this.chartModel.height :
                      this.edge === 'max' ? 0 :
                      this.chartModel.modelToView( this.orientation.opposite, this.value );
        tickBounds.setMinMax( viewPosition, viewY - this.extent / 2, viewPosition, viewY + this.extent / 2 );
      }
      else {
        const viewX = this.edge === 'min' ? 0 :
                      this.edge === 'max' ? this.chartModel.width :
                      this.chartModel.modelToView( this.orientation.opposite, this.value );
        tickBounds.setMinMax( viewX - this.extent / 2, viewPosition, viewX + this.extent / 2, viewPosition );
      }

      const label = this.labelMap.has( modelPosition ) ? this.labelMap.get( modelPosition ) :
                    this.createLabel ? this.createLabel( modelPosition ) :
                    null;
      this.labelMap.set( modelPosition, label );
      label && this.positionLabel( label, tickBounds, this.orientation );
      label && children.push( label );
      used.add( modelPosition );
    } );

    // empty cache of unused values
    const toRemove = [];
    for ( const key of this.labelMap.keys() ) {
      if ( !used.has( key ) ) {
        toRemove.push( key );
      }
    }
    toRemove.forEach( t => {
      this.labelMap.delete( t );
    } );

    this.children = children;

  }
}

griddle.register( 'LabelSet', LabelSet );
export default LabelSet;