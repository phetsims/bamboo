// Copyright 2020-2022, University of Colorado Boulder

/**
 * SpanNode shows a double-headed arrow pointing to parallel bars, and a text label. It is shown under a chart to
 * indicate the distance between gridlines.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../phet-core/js/optionize.js';
import Orientation from '../../phet-core/js/Orientation.js';
import ArrowNode, { ArrowNodeOptions } from '../../scenery-phet/js/ArrowNode.js';
import { Color, FlowBox, FlowBoxOptions, Line, Node } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

// Same as the value in Node's validateBounds
const notificationThreshold = 1e-13;

type SelfOptions = {
  color?: string | Color;
  spacing?: number;
  outerLineLength?: number;
  arrowNodeOptions?: ArrowNodeOptions;
};
type SpanNodeOptions = SelfOptions & FlowBoxOptions;

class SpanNode extends FlowBox {

  private chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private delta: number;
  private readonly labelNode: Node;
  private readonly color: string | Color;
  private readonly outerLineLength: number;
  private viewWidth: number;
  private readonly arrowNodeOptions: ArrowNodeOptions;
  private readonly disposeSpanNode: () => void;

  /**
   * @param chartTransform
   * @param axisOrientation
   * @param delta - in model coordinates
   * @param labelNode
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, delta: number, labelNode: Node,
                      providedOptions?: SpanNodeOptions ) {

    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && assert( axisOrientation instanceof Orientation, 'invalid axisOrientation' );
    assert && assert( typeof delta === 'number', 'invalid delta' );
    assert && assert( labelNode instanceof Node, 'invalid labelNode' );

    //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL
    assert && assert( axisOrientation !== Orientation.VERTICAL, 'Orientation.VERTICAL is not yet supported' );

    const options = optionize<SpanNodeOptions, SelfOptions, FlowBoxOptions>()( {
      color: 'black',
      spacing: 0, // between arrow and labelNode (option passed to supertype FlowBox)
      outerLineLength: 6, // length of the bars at the ends of each arrow
      arrowNodeOptions: {
        doubleHead: true,
        headHeight: 4.5,
        headWidth: 5,
        tailWidth: 1.5,
        stroke: null // Not supported since it throws off the dimensions, use fill instead
      }
    }, providedOptions );

    assert && assert( !options.children, 'SpanNode sets children' );
    assert && assert( !options.orientation, 'SpanNode sets orientation' );
    assert && assert( options.arrowNodeOptions.stroke === null, 'SpanNode sets arrowNodeOptions.stroke' );
    options.orientation = ( axisOrientation === Orientation.HORIZONTAL ) ? 'vertical' : 'horizontal';

    // Arrow node color options default to the color of the SpanNode, but can be overridden independently
    options.arrowNodeOptions.fill = options.arrowNodeOptions.fill || options.color;

    super();

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

    this.disposeSpanNode = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets delta and updates.
   * @param delta - in model coordinates
   */
  public setDelta( delta: number ): void {
    if ( delta !== this.delta ) {
      this.delta = delta;
      this.update();
    }
  }

  private update(): void {

    const viewWidth = this.chartTransform.modelToViewDelta( this.axisOrientation, this.delta );

    // If the view width changes a 'noticeable amount', then update.
    if ( Math.abs( viewWidth - this.viewWidth ) > notificationThreshold ) {
      this.viewWidth = viewWidth;

      //TODO https://github.com/phetsims/bamboo/issues/21 support Orientation.VERTICAL

      // Create double-headed arrow with perpendicular lines at ends to show modelDelta
      const createBar = ( centerX: number ) => new Line( 0, 0, 0, this.outerLineLength, { stroke: this.color, centerX: centerX } );
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

  public override dispose(): void {
    this.disposeSpanNode();
    super.dispose();
  }
}

bamboo.register( 'SpanNode', SpanNode );
export default SpanNode;