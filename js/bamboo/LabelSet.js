// Copyright 2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Utils from '../../../dot/js/Utils.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import bamboo from '../bamboo.js';

class LabelSet extends Path {

  /**
   * @param chartModel
   * @param {Orientation} axisOrientation - the progression of the ticks.  For instance HORIZONTAL has ticks at x=0,1,2, etc.
   * @param {number} spacing - in model coordinates
   * @param options
   */
  constructor( chartModel, axisOrientation, spacing, options ) {
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
      createLabel: value => new Text( Utils.toFixed( value, 1 ), { fontSize: 12 } ),
      positionLabel: ( label, tickBounds, axisOrientation ) => {
        if ( axisOrientation === Orientation.HORIZONTAL ) {

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
    this.axisOrientation = axisOrientation;
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

    this.chartModel.forEachSpacing( this.axisOrientation, this.spacing, this.origin, this.clipped, ( modelPosition, viewPosition ) => {
      const tickBounds = new Bounds2( 0, 0, 0, 0 );
      if ( this.axisOrientation === Orientation.HORIZONTAL ) {
        const viewY = this.edge === 'min' ? this.chartModel.height :
                      this.edge === 'max' ? 0 :
                      this.chartModel.modelToView( this.axisOrientation.opposite, this.value );
        tickBounds.setMinMax( viewPosition, viewY - this.extent / 2, viewPosition, viewY + this.extent / 2 );
      }
      else {
        const viewX = this.edge === 'min' ? 0 :
                      this.edge === 'max' ? this.chartModel.width :
                      this.chartModel.modelToView( this.axisOrientation.opposite, this.value );
        tickBounds.setMinMax( viewX - this.extent / 2, viewPosition, viewX + this.extent / 2, viewPosition );
      }

      const label = this.labelMap.has( modelPosition ) ? this.labelMap.get( modelPosition ) :
                    this.createLabel ? this.createLabel( modelPosition ) :
                    null;
      this.labelMap.set( modelPosition, label );
      label && this.positionLabel( label, tickBounds, this.axisOrientation );
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

bamboo.register( 'LabelSet', LabelSet );
export default LabelSet;