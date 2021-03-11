// Copyright 2020, University of Colorado Boulder

/**
 * Demonstrates LinePlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import SpanNode from '../../../bamboo/js/SpanNode.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import PlusMinusZoomButtonGroup from '../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AxisNode from '../AxisNode.js';
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import LinePlot from '../LinePlot.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

class DemoLinePlot extends Node {

  constructor( options ) {

    super();

    const createDataSet = ( min, max, frequency, delta = 0.005 ) => {
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
        zoomLevel === 4 ? new Range( -Math.PI / 2, Math.PI / 2 ) : null
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
          new AxisNode( chartTransform, Orientation.HORIZONTAL ),
          new AxisNode( chartTransform, Orientation.VERTICAL ),

          // Some data
          new LinePlot( chartTransform, createDataSet( -2, 2, 5 ), { stroke: 'red', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 10 ), { stroke: 'green', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 20 ), { stroke: 'blue', lineWidth: 2 } ),
          new LinePlot( chartTransform, createDataSet( -2, 2, 30 ), { stroke: 'orange', lineWidth: 2 } )
        ]
      } ),

      // Tick marks outside the chart
      new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new LabelSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, { edge: 'min' } ),
      new LabelSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 8, {
        edge: 'min',
        createLabel: value => new Text( Math.abs( value ) < 1E-6 ? value.toFixed( 0 ) : value.toFixed( 2 ), {
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