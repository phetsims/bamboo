// Copyright 2020, University of Colorado Boulder

/**
 * Demonstrates a ChartCanvasNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import ZoomButtonGroup from '../../../scenery-phet/js/ZoomButtonGroup.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Color from '../../../scenery/js/util/Color.js';
import AxisNode from '../AxisNode.js';
import ChartCanvasNode from '../ChartCanvasNode.js';
import CanvasLinePlot from '../CanvasLinePlot.js';
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

class DemoChartCanvasNode extends Node {

  constructor( emitter, options ) {

    super();

    const createDataSet = ( min, max, frequency, offset, delta = 0.005 ) => {
      const dataSet = [];
      for ( let x = min; x <= max; x += delta ) {
        dataSet.push( new Vector2( x, Math.sin( x * frequency + offset ) ) );
      }
      return dataSet;
    };

    const chartTransform = new ChartTransform( 700, 300, {
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

    const zoomButtonGroup = new ZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      left: chartRectangle.right + 10,
      bottom: chartRectangle.bottom
    } );
    zoomLevelProperty.link( zoomLevel => {
      chartTransform.setModelXRange( zoomLevel === 1 ? new Range( -Math.PI / 8, Math.PI / 8 ) :
                                     zoomLevel === 2 ? new Range( -Math.PI / 4, Math.PI / 4 ) :
                                     zoomLevel === 3 ? new Range( -Math.PI / 3, Math.PI / 3 ) :
                                     zoomLevel === 4 ? new Range( -Math.PI / 2, Math.PI / 2 ) : null );
    } );

    const painters = [];

    const p = new Property( new Color( 128, 128, 128 ) );

    const colors = [ 'red', 'blue', 'green',
      'violet', new Color( 'pink' ), new Property( null ), p
    ];

    for ( let i = 0; i < colors.length; i++ ) {
      const d = createDataSet( -2, 2, 5 + i / 10 + phet.joist.random.nextDouble() / 10, phet.joist.random.nextDouble() * 2 );
      painters.push( new CanvasLinePlot( chartTransform, d, {
        stroke: colors[ i % colors.length ],
        lineWidth: i
      } ) );
    }

    // Anything you want clipped goes in here
    const chartCanvasNode = new ChartCanvasNode( chartTransform, painters );

    let time = 0;
    emitter.addListener( dt => {
      time += dt;
      const a = 255 * Math.sin( time * 4 );
      p.set( new Color( a, a / 2, a / 4 ) );
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

          // Minor grid lines
          new GridLineSet( chartTransform, Orientation.HORIZONTAL, Math.PI / 32, { stroke: 'lightGray' } ),
          new GridLineSet( chartTransform, Orientation.VERTICAL, 0.5, { stroke: 'lightGray' } ),

          // Axes nodes are clipped in the chart
          new AxisNode( chartTransform, Orientation.HORIZONTAL ),
          new AxisNode( chartTransform, Orientation.VERTICAL ),

          // Some data
          chartCanvasNode
        ]
      } ),

      // Tick marks outside the chart
      new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
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

bamboo.register( 'DemoChartCanvasNode', DemoChartCanvasNode );
export default DemoChartCanvasNode;