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

    if ( assert && options && options.arrowNodeOptions ) {
      assert && assert( !options.arrowNodeOptions.hasOwnProperty( 'stroke' ), 'Stroke not supported for inner arrow, use fill' );
      assert && assert( !options.arrowNodeOptions.hasOwnProperty( 'lineWidth' ), 'lineWidth not supported for inner arrow, use fill' );
    }

    //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL
    assert && assert( axisOrientation !== Orientation.VERTICAL, 'Orientation.VERTICAL is not yet supported' );

    options = merge( {
      color: 'black',
      spacing: -2, // between arrow and labelNode (option passed to supertype LayoutBox)
      outerLineLength: 6, // length of the bars at the ends of each arrow
      arrowNodeOptions: {
        doubleHead: true,
        headHeight: 4.5,
        headWidth: 5,
        tailWidth: 1.5,
        lineWidth: 0, // Not supported since it throws off the dimensions, use fill instead
        stroke: null // Not supported since it throws off the dimensions, use fill instead
      }
    }, options );

    assert && assert( !options.children, 'SpanNode sets children' );
    assert && assert( !options.orientation, 'SpanNode sets orientation' );
    options.orientation = ( axisOrientation === Orientation.HORIZONTAL ) ? 'vertical' : 'horizontal';

    // Arrow node color options default to the color of the SpanNode, but can be overridden independently
    options.arrowNodeOptions.fill = options.arrowNodeOptions.fill || options.color;

    super();

    // @private
    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.delta = delta;
    this.labelNode = labelNode;
    this.color = options.color;
    this.outerLineLength = options.outerLineLength;
    this.viewWidth = 0;
    this.arrowNodeOptions = options.arrowNodeOptions;

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
      const arrowNode = new ArrowNode(
        leftBar.right,
        leftBar.centerY,
        rightBar.left,
        rightBar.centerY,
        this.arrowNodeOptions
      );
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