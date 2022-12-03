// Copyright 2020-2022, University of Colorado Boulder

/**
 * Demonstrates a ChartCanvasNode.  One of the data sets demonstrates missing data and color mutation.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import PlusMinusZoomButtonGroup from '../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import { Color, Node, NodeOptions, Text } from '../../../scenery/js/imports.js';
import AxisLine from '../AxisLine.js';
import bamboo from '../bamboo.js';
import CanvasLinePlot from '../CanvasLinePlot.js';
import ChartCanvasNode from '../ChartCanvasNode.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import TickLabelSet from '../TickLabelSet.js';
import TickMarkSet from '../TickMarkSet.js';
import CanvasGridLineSet from '../CanvasGridLineSet.js';
import CanvasPainter from '../CanvasPainter.js';
import TEmitter from '../../../axon/js/TEmitter.js';

class DemoChartCanvasNode extends Node {

  public constructor( emitter: TEmitter<[ number ]>, options?: NodeOptions ) {

    super();

    const createDataSet = ( min: number, max: number, frequency: number, offset: number, delta: number, missingData = false ) => {
      const dataSet = [];
      for ( let x = min; x <= max; x += delta ) {

        // Test holes in the data
        const data = ( missingData && Math.abs( x ) < 0.1 && x < 0 ) ? null :
                     new Vector2( x, Math.sin( x * frequency + offset ) );
        dataSet.push( data );
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
      chartTransform.setModelXRange( zoomLevel === 1 ? new Range( -Math.PI / 8, Math.PI / 8 ) :
                                     zoomLevel === 2 ? new Range( -Math.PI / 4, Math.PI / 4 ) :
                                     zoomLevel === 3 ? new Range( -Math.PI / 3, Math.PI / 3 ) :
                                     new Range( -Math.PI / 2, Math.PI / 2 ) );
    } );

    const painters: CanvasPainter[] = [

      // Minor grid lines
      new CanvasGridLineSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 32, { stroke: 'lightGray' } ),
      new CanvasGridLineSet( chartTransform, Orientation.VERTICAL, 0.5, { stroke: 'lightGray' } )
    ];
    const colors = [ 'red', 'blue', 'green', 'violet', 'pink', null, 'blue' ];

    const canvasLinePlots: CanvasLinePlot[] = [];
    for ( let i = 0; i < colors.length; i++ ) {
      const d = createDataSet( -2, 2, 5 + i / 10 + dotRandom.nextDouble() / 10, dotRandom.nextDouble() * 2, 0.005, i === colors.length - 1 );
      const canvasLinePlot = new CanvasLinePlot( chartTransform, d, {
        stroke: colors[ i % colors.length ]!,
        lineWidth: i
      } );
      canvasLinePlots.push( canvasLinePlot );
      painters.push( canvasLinePlot );
    }

    // Anything you want clipped goes in here
    const chartCanvasNode = new ChartCanvasNode( chartTransform, painters );

    let time = 0;
    emitter.addListener( dt => {
      time += dt;
      const a = 255 * Math.sin( time * 4 );
      canvasLinePlots[ canvasLinePlots.length - 1 ].stroke = new Color( a, a / 2, a / 4 );
      chartCanvasNode.update();
    } );

    this.children = [

      // Background
      chartRectangle,

      // Clipped contents
      new Node( {
        // TODO https://github.com/phetsims/bamboo/issues/15 what if the chart area changes, then clip needs to change
        clipArea: chartRectangle.getShape(),
        children: [

          // Some data
          chartCanvasNode
        ]
      } ),

      // Axes and labels outside the chart
      new AxisLine( chartTransform, Orientation.HORIZONTAL ),
      new Text( 'x', { leftCenter: chartRectangle.rightCenter.plusXY( 8, 0 ), fontSize: 18 } ),
      new AxisLine( chartTransform, Orientation.VERTICAL ),
      new Text( 'y', { centerBottom: chartRectangle.centerTop.minusXY( 0, 4 ), fontSize: 18 } ),

      // Tick marks outside the chart
      new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, { edge: 'min' } ),
      new TickLabelSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, {
        edge: 'min',
        createLabel: ( value: number ) => new Text( Math.abs( value ) < 1E-6 ? Utils.toFixed( value, 0 ) : Utils.toFixed( value, 2 ), {
          fontSize: 12
        } )
      } ),

      zoomButtonGroup
    ];

    this.mutate( options );
  }
}

bamboo.register( 'DemoChartCanvasNode', DemoChartCanvasNode );
export default DemoChartCanvasNode;