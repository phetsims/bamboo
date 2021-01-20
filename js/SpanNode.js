// Copyright 2019-2020, University of Colorado Boulder

/**
 * SpanNode shows a double-headed arrow pointing to parallel bars, and a text label. It is shown under a chart to
 * indicate the distance between gridlines.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import ArrowNode from '../../scenery-phet/js/ArrowNode.js';
import LayoutBox from '../../scenery/js/nodes/LayoutBox.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

// Same as the value in Node's validateBounds
const notificationThreshold = 1e-13;

//TODO https://github.com/phetsims/bamboo/issues/21 VBox only works for Orientation.HORIZONTAL
class SpanNode extends LayoutBox {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Orientation} axisOrientation
   * @param {number} delta - in model coordinates
   * @param {Node} labelNode
   * @param {Object} [options]
   */
  constructor( chartTransform, axisOrientation, delta, labelNode, options ) {

    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && assert( Orientation.includes( axisOrientation ), 'invalid axisOrientation' );
    assert && assert( typeof delta === 'number', 'invalid delta' );
    assert && assert( labelNode instanceof Node, 'invalid labelNode' );

    //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL
    assert && assert( axisOrientation !== Orientation.VERTICAL, 'Orientation.VERTICAL is not yet supported' );

    options = merge( {
      color: 'black',
      spacing: -2, // between arrow and labelNode
      outerLineLength: 6 // length of the bars at the ends of each arrow
    }, options );

    assert && assert( !options.children, 'SpanNode sets children' );
    assert && assert( !options.orientation, 'SpanNode sets orientation' );
    options.orientation = ( axisOrientation === Orientation.HORIZONTAL ) ? 'vertical' : 'horizontal';

    super();

    // @private
    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.delta = delta;
    this.labelNode = labelNode;
    this.color = options.color;
    this.outerLineLength = options.outerLineLength;
    this.viewWidth = 0;

    // Initialize
    this.update();

    // mutate after initializing, so that transform options work correctly
    this.mutate( options );

    // Update when the range of the associated axis changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeSpanNode = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets delta and updates.
   * @param {number} delta - in model coordinates
   * @public
   */
  setDelta( delta ) {
    if ( delta !== this.delta ) {
      this.delta = delta;
      this.update();
    }
  }

  // @private
  update() {

    const viewWidth = this.chartTransform.modelToViewDelta( this.axisOrientation, this.delta );

    // If the view width changes a 'noticeable amount', then update.
    if ( Math.abs( viewWidth - this.viewWidth ) > notificationThreshold ) {
      this.viewWidth = viewWidth;

      //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL
      // Create double-headed arrow with bars at to show modelDelta
      const createBar = centerX => new Line( 0, 0, 0, this.outerLineLength, { stroke: this.color, centerX: centerX } );
      const leftBar = createBar( 0 );
      const rightBar = createBar( viewWidth );
      //TODO https://github.com/phetsims/bamboo/issues/22 parameterize ArrowNode options
      const arrowNode = new ArrowNode( leftBar.right + 1, leftBar.centerY, rightBar.left - 1, rightBar.centerY, {
        fill: this.color,
        stroke: this.color,
        doubleHead: true,
        headHeight: 3,
        headWidth: 3.5,
        tailWidth: 0.5
      } );
      const arrowWithBars = new Node( {
        children: [ leftBar, rightBar, arrowNode ]
      } );

      //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL
      // Prevent labelNode from being wider than arrowWithBars
      this.labelNode.maxWidth = arrowWithBars.width;

      this.children = [ arrowWithBars, this.labelNode ];
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeSpanNode();
    super.dispose();
  }
}

bamboo.register( 'SpanNode', SpanNode );
export default SpanNode;