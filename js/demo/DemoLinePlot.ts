// Copyright 2020-2022, University of Colorado Boulder

/**
 * Demonstrates LinePlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import SpanNode from '../../../bamboo/js/SpanNode.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import PlusMinusZoomButtonGroup from '../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import { Node, NodeOptions, Text } from '../../../scenery/js/imports.js';
import AxisArrowNode from '../AxisArrowNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import GridLineSet from '../GridLineSet.js';
import TickLabelSet from '../TickLabelSet.js';
import LinePlot from '../LinePlot.js';
import TickMarkSet from '../TickMarkSet.js';

class DemoLinePlot extends Node {

  public constructor( options?: NodeOptions ) {

    super();

    const createDataSet = ( min: number, max: number, frequency: number, delta = 0.005 ) => {
      const dataSet = [];
      for ( let x = min; x <= max; x += delta ) {
        dataSet.push( new Vector2( x, Math.sin( x * frequency ) ) );
      }
      return dataSet;
    };

    const chartTransform = new ChartTransform( {
      viewWidth: 700,
      viewHeight: 300,
      modelXRange: new Range( -Math.PI / 8, Math.PI / 8 ),
      modelYRange: new Range( -4 / Math.PI, 4 / Math.PI )
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const zoomLevelProperty = new NumberProperty( 1, { range: new Range( 1, 4 ) } );

    const zoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      left: chartRectangle.right + 10,
      bottom: chartRectangle.bottom
    } );
    zoomLevelProperty.link( zoomLevel => {
      chartTransform.setModelXRange(
        zoomLevel === 1 ? new Range( -Math.PI / 8, Math.PI / 8 ) :
        zoomLevel === 2 ? new Range( -Math.PI / 4, Math.PI / 4 ) :
        zoomLevel === 3 ? new Range( -Math.PI / 3, Math.PI / 3 ) :
        new Range( -Math.PI / 2, Math.PI / 2 )
      );
    } );

    // Anything you want clipped goes in here
    this.children = [

      // Background
      chartRectangle,

      // span that shows PI/8, at bottom-left of chart
      new SpanNode( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, new Text( `${MathSymbols.PI}/8`, {
        font: new PhetFont( 14 )
      } ), {
        left: chartRectangle.left,
        top: chartRectangle.bottom + 25
      } ),

      // Clipped contents
      new Node( {
        // TODO https://github.com/phetsims/bamboo/issues/15 what if the chart area changes, then clip needs to change
        clipArea: chartRectangle.getShape(),
        children: [

          // Minor grid lines
          new GridLineSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 32, { stroke: 'lightGray' } ),
          new GridLineSet( chartTransform, Orientation.VERTICAL, 0.5, { stroke: 'lightGray' } ),

          // Axes nodes are clipped in the chart
          new AxisArrowNode( chartTransform, Orientation.HORIZONTAL ),
          new AxisArrowNode( chartTransform, Orientation.VERTICAL ),

          // Some data
          new LinePlot( chartTransform, createDataSet( -2, 2, 5 ), { stroke: 'red', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 10 ), { stroke: 'green', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 20 ), { stroke: 'blue', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 30 ), { stroke: 'orange', lineWidth: 2 } )
        ]
      } ),

      // Tick marks outside the chart
      new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickLabelSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, { edge: 'min' } ),
      new TickLabelSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, {
        edge: 'min',
        createLabel: ( value: number ) => new Text( Math.abs( value ) < 1E-6 ? Utils.toFixed( value, 0 ) : Utils.toFixed( value, 2 ), {
          fontSize: 12
        } )
      } ),
      new Text( 'x', { leftCenter: chartRectangle.rightCenter.plusXY( 4, 0 ), fontSize: 18 } ),

      zoomButtonGroup
    ];

    this.mutate( options );
  }
}

bamboo.register( 'DemoLinePlot', DemoLinePlot );
export default DemoLinePlot;