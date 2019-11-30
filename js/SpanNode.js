// Copyright 2019, University of Colorado Boulder

/**
 * Shows an double headed arrow arrow pointing to parallel bars, and a text label.  Shown under a chart to indicate the
 * distance between gridlines.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const griddle = require( 'GRIDDLE/griddle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class SpanNode extends Node {

    /**
     * @param {Node} scaleIndicatorTextNode
     * @param {number} width
     * @param {Object} [options]
     */
    constructor( scaleIndicatorTextNode, width, options ) {
      super();

      // Create double-headed arrow with bars to show the time between gridlines
      const createBar = centerX => new Line( 0, 0, 0, 6, { stroke: 'white', centerX: centerX } );
      const leftBar = createBar( 0 );
      const rightBar = createBar( width );
      const arrowNode = new ArrowNode( leftBar.right + 1, leftBar.centerY, rightBar.left - 1, rightBar.centerY, {
        fill: 'white',
        stroke: 'white',
        doubleHead: true,
        headHeight: 3,
        headWidth: 3.5,
        tailWidth: 0.5
      } );
      const arrowWithBars = new Node( {
        children: [ leftBar, rightBar, arrowNode ]
      } );

      // Prevent the scale indicator text from being wider than the corresponding arrow
      scaleIndicatorTextNode.maxWidth = arrowWithBars.width;

      const lengthScaleIndicatorNode = new VBox( {
        spacing: -2,
        children: [ arrowWithBars, scaleIndicatorTextNode ]
      } );
      this.children = [ arrowNode, lengthScaleIndicatorNode ];

      this.mutate( options );
    }
  }

  return griddle.register( 'SpanNode', SpanNode );
} );