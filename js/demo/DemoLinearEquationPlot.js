// Copyright 2021, University of Colorado Boulder

/**
 * Demonstrates LinearEquationPlot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import merge from '../../../phet-core/js/merge.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import NumberDisplay from '../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RichText from '../../../scenery/js/nodes/RichText.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import VSlider from '../../../sun/js/VSlider.js';
import AxisArrowNode from '../AxisArrowNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import LinearEquationPlot from '../LinearEquationPlot.js';
import TickMarkSet from '../TickMarkSet.js';

class DemoLinearEquationPlot extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, options );

    const modelXRange = new Range( -50, 50 );
    const modelYRange = new Range( -50, 50 );
    const tickXSpacing = 10;
    const tickYSpacing = 10;

    // Keep the same aspect ratio for view range
    const viewScale = 3;
    const viewWidth = viewScale * modelXRange.getLength();
    const viewHeight = viewScale * modelYRange.getLength();

    // Properties for slope (m) and y-intercept (b).
    const mProperty = new NumberProperty( 1, {
      range: new Range( -10, 10 )
    } );
    const bProperty = new NumberProperty( 0, {
      range: modelYRange
    } );

    // Add some markup, so they these like math symbols.
    const xSymbol = MathSymbolFont.getRichTextMarkup( 'x' );
    const ySymbol = MathSymbolFont.getRichTextMarkup( 'y' );
    const mSymbol = MathSymbolFont.getRichTextMarkup( 'm' );
    const bSymbol = MathSymbolFont.getRichTextMarkup( 'b' );

    // Equation
    const equationText = new RichText( `${ySymbol} = ${mSymbol}${xSymbol} + ${bSymbol}`, {
      font: new PhetFont( 20 )
    } );

    // Slope slider
    const mDisplay = new NumberDisplay( mProperty, mProperty.range, {
      valuePattern: `${mSymbol} = {{value}}`,
      useRichText: true,
      decimalPlaces: 1,
      align: 'center'
    } );
    const mSlider = new VSlider( mProperty, mProperty.range, {
      constrainValue: value => Utils.roundToInterval( value, 0.1 ) // 1 decimal place
    } );
    const mControl = new VBox( {
      spacing: 4,
      children: [ mDisplay, mSlider ]
    } );

    // Y-intercept slider
    const bDisplay = new NumberDisplay( bProperty, bProperty.range, {
      valuePattern: `${bSymbol} = {{value}}`,
      useRichText: true,
      decimalPlaces: 0,
      align: 'center'
    } );
    const bSlider = new VSlider( bProperty, bProperty.range, {
      constrainValue: value => Utils.roundSymmetric( value )  // integers
    } );
    const bControl = new VBox( {
      spacing: 4,
      children: [ bDisplay, bSlider ]
    } );

    // Everything that's not part of the chart
    const controlsNode = new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      spacing: 20,
      children: [
        equationText,
        new HBox( {
          excludeInvisibleChildrenFromBounds: false,
          spacing: 20,
          children: [ mControl, bControl ]
        } )
      ]
    } );

    const chartTransform = new ChartTransform( {
      modelXRange: modelXRange,
      modelYRange: modelYRange,
      viewWidth: viewWidth,
      viewHeight: viewHeight
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black'
    } );

    const straightLinePlot = new LinearEquationPlot( chartTransform, 1, 1, {
      stroke: 'red',
      lineWidth: 2
    } );

    // Axes
    const axisFont = new PhetFont( 16 );
    const xAxis = new AxisArrowNode( chartTransform, Orientation.HORIZONTAL );
    const xAxisLabel = new RichText( xSymbol, {
      font: axisFont,
      leftCenter: chartRectangle.rightCenter.plusXY( 4, 0 )
    } );
    const yAxis = new AxisArrowNode( chartTransform, Orientation.VERTICAL );
    const yAxisLabel = new RichText( ySymbol, {
      font: axisFont,
      centerBottom: chartRectangle.centerTop.minusXY( 0, 4 )
    } );

    // Grid lines
    const xGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, tickXSpacing, { stroke: 'lightGray' } );
    const yGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, tickYSpacing, { stroke: 'lightGray' } );

    // Tick marks & labels
    const xTickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, tickXSpacing, {
      edge: 'min'
    } );
    const xTickLabelSet = new LabelSet( chartTransform, Orientation.HORIZONTAL, tickXSpacing, {
      edge: 'min',
      createLabel: value => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
    } );
    const yTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, tickYSpacing, {
      edge: 'min'
    } );
    const yTickLabelSet = new LabelSet( chartTransform, Orientation.VERTICAL, tickYSpacing, {
      edge: 'min',
      createLabel: value => new Text( Utils.toFixed( value, 0 ), { fontSize: 12 } )
    } );

    // All the parts of the chart
    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Components that will be clipped to chartRectangle
        new Node( {
          clipArea: chartRectangle.getShape(),
          children: [

            // Grid lines
            xGridLines,
            yGridLines,

            // Axes
            xAxis,
            yAxis,

            // Plots
            straightLinePlot
          ]
        } ),

        // Axes
        xAxisLabel,
        yAxisLabel,

        // Ticks
        xTickMarkSet,
        xTickLabelSet,
        yTickMarkSet,
        yTickLabelSet
      ]
    } );

    assert && assert( !options.children, 'DemoLinearEquationPlot sets children' );
    options.children = [
      new HBox( {
        excludeInvisibleChildrenFromBounds: false,
        spacing: 30,
        children: [ chartNode, controlsNode ]
      } )
    ];

    super( options );

    // Update plot when slope or y-intercept changes.
    mProperty.link( m => {
      straightLinePlot.m = m;
    } );
    bProperty.link( b => {
      straightLinePlot.b = b;
    } );
  }
}

bamboo.register( 'DemoLinearEquationPlot', DemoLinearEquationPlot );
export default DemoLinearEquationPlot;