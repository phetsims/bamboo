// Copyright 2020-2022, University of Colorado Boulder

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
import { Node, NodeOptions, Text } from '../../../scenery/js/imports.js';
import AxisArrowNode from '../AxisArrowNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import GridLineSet, { GridLineSetOptions } from '../GridLineSet.js';
import TickLabelSet, { TickLabelSetOptions } from '../TickLabelSet.js';
import TickMarkSet, { TickMarkSetOptions } from '../TickMarkSet.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';

const MAX_X_RANGE = new Range( -5, 5 );
const MAX_Y_RANGE = new Range( -5, 5 );
const GRID_X_SPACING = 1;
const GRID_Y_SPACING = 1;

type SelfOptions = EmptySelfOptions;

type DemoAreaPlotOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class DemoAreaPlot extends Node {

  public constructor( providedOptions?: DemoAreaPlotOptions ) {

    const options = optionize<DemoAreaPlotOptions, SelfOptions, NodeOptions>()( {
      // We're setting options.children below.
    }, providedOptions );

    const chartTransform = new ChartTransform( {
      viewWidth: 700,
      viewHeight: 300,
      modelXRange: MAX_X_RANGE,
      modelYRange: MAX_Y_RANGE
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const xZoomLevelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, chartTransform.modelXRange.max )
    } );

    // The value of xZoomLevelProperty is used as the x-axis range.
    xZoomLevelProperty.link( zoomLevel => chartTransform.setModelXRange( new Range( -zoomLevel, zoomLevel ) ) );

    const xZoomButtonGroup = new PlusMinusZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      left: chartRectangle.right + 10,
      bottom: chartRectangle.bottom
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

    options.children = [

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

          // Some data
          new AreaPlot( chartTransform, createSineDataSet( MAX_X_RANGE, 1, MAX_Y_RANGE.max - 1 ), {
            fill: 'red'
          } )
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
    ];

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