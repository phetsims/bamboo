// Copyright 2023, University of Colorado Boulder

/**
 * Demonstrates AreaPlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import AreaPlot from '../AreaPlot.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import PlusMinusZoomButtonGroup from '../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import { HBoxOptions, Node, Text } from '../../../scenery/js/imports.js';
import AxisArrowNode from '../AxisArrowNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import GridLineSet, { GridLineSetOptions } from '../GridLineSet.js';
import TickLabelSet, { TickLabelSetOptions } from '../TickLabelSet.js';
import TickMarkSet, { TickMarkSetOptions } from '../TickMarkSet.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import VSlider from '../../../sun/js/VSlider.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

const MAX_X_RANGE = new Range( -5, 5 );
const MAX_Y_RANGE = new Range( -5, 5 );
const GRID_X_SPACING = 1;
const GRID_Y_SPACING = 1;

type SelfOptions = EmptySelfOptions;

type DemoAreaPlotOptions = SelfOptions & StrictOmit<HBoxOptions, 'children'>;

export default class DemoAreaPlot extends Node {

  public constructor( providedOptions?: DemoAreaPlotOptions ) {

    const options = optionize<DemoAreaPlotOptions, SelfOptions, HBoxOptions>()( {
      // We're setting options.children below
    }, providedOptions );

    const chartTransform = new ChartTransform( {
      viewWidth: 700,
      viewHeight: 300,
      modelXRange: MAX_X_RANGE,
      modelYRange: MAX_Y_RANGE
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black'
    } );

    const xZoomLevelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, chartTransform.modelXRange.max )
    } );

    // The value of xZoomLevelProperty is used as the x-axis range.
    xZoomLevelProperty.link( zoomLevel => chartTransform.setModelXRange( new Range( -zoomLevel, zoomLevel ) ) );

    const xZoomButtonGroup = new PlusMinusZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      right: chartRectangle.right,
      top: chartRectangle.bottom + 25
    } );

    const gridLineSetOptions: GridLineSetOptions = {
      stroke: 'lightGray'
    };

    const tickMarkSetOptions: TickMarkSetOptions = {
      edge: 'min'
    };

    const tickLabelSetOptions: TickLabelSetOptions = {
      edge: 'min',
      createLabel: ( value: number ) => new Text( Utils.toFixed( value, 0 ), {
        fontSize: 12
      } )
    };

    const areaPlot = new AreaPlot( chartTransform, createSineDataSet( MAX_X_RANGE, 1, MAX_Y_RANGE.max ), {
      fill: 'rgba( 255, 0, 0, 0.7 )'
    } );

    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Clipped contents - anything you want clipped goes in here.
        new Node( {
          clipArea: chartRectangle.getShape(),
          children: [

            // Minor grid lines
            new GridLineSet( chartTransform, Orientation.HORIZONTAL, GRID_Y_SPACING, gridLineSetOptions ),
            new GridLineSet( chartTransform, Orientation.VERTICAL, GRID_X_SPACING, gridLineSetOptions ),

            // Axes nodes are clipped in the chart
            new AxisArrowNode( chartTransform, Orientation.HORIZONTAL ),
            new AxisArrowNode( chartTransform, Orientation.VERTICAL ),

            // AreaPlot
            areaPlot
          ]
        } ),

        // x-axis label
        new Text( 'x', {
          leftCenter: chartRectangle.rightCenter.plusXY( 4, 0 ),
          fontSize: 18
        } ),

        // x-axis ticks and labels
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, tickMarkSetOptions ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 1, tickLabelSetOptions ),

        // y-axis ticks and labels
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 1, tickMarkSetOptions ),
        new TickLabelSet( chartTransform, Orientation.VERTICAL, 1, tickLabelSetOptions ),

        xZoomButtonGroup
      ]
    } );

    const baselineRange = new Range( MAX_Y_RANGE.min, MAX_Y_RANGE.max );
    const baselineProperty = new NumberProperty( 0, {
      range: baselineRange
    } );

    const baselineSlider = new VSlider( baselineProperty, baselineProperty.range, {

      // Snap to integer when thumb is released.
      endDrag: () => {
        baselineProperty.value = Utils.toFixedNumber( baselineProperty.value, 0 );
      },
      trackSize: new Dimension2( 5, chartRectangle.height ),
      majorTickStroke: 'gray',
      left: chartNode.right + 20,
      top: chartNode.top
    } );
    for ( let i = baselineRange.min; i <= baselineRange.max; i++ ) {
      baselineSlider.addMajorTick( i );
    }

    const baselineText = new Text( '', {
      font: new PhetFont( 14 ),
      left: baselineSlider.left,
      bottom: baselineSlider.top - 6
    } );

    baselineProperty.link( baseline => {
      areaPlot.setBaseline( baseline );
      baselineText.string = `baseline = ${Utils.toFixedNumber( baseline, 2 )}`;
    } );

    options.children = [ chartNode, baselineSlider, baselineText ];

    super( options );
  }
}

/**
 * Creates the data set for a sine wave.
 */
const createSineDataSet = ( xRange: Range, period: number, amplitude: number, delta = 0.01 ) => {
  const dataSet = [];
  const frequency = 2 * Math.PI / period;
  for ( let x = xRange.min; x <= xRange.max; x += delta ) {
    dataSet.push( new Vector2( x, amplitude * Math.sin( x * frequency ) ) );
  }
  return dataSet;
};

bamboo.register( 'DemoAreaPlot', DemoAreaPlot );