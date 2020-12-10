// Copyright 2020, University of Colorado Boulder

/**
 * Demonstrates a CanvasLinePlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import ZoomButtonGroup from '../../../scenery-phet/js/ZoomButtonGroup.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AxisNode from '../AxisNode.js';
import CanvasLinePlot from '../CanvasLinePlot.js';
import ChartModel from '../ChartModel.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

class DemoCanvasLinePlot extends Node {

  constructor( options ) {

    super();

    const createDataSet = ( min, max, frequency, offset, delta = 0.005 ) => {
      const dataSet = [];
      for ( let x = min; x <= max; x += delta ) {
        dataSet.push( new Vector2( x, Math.sin( x * frequency + offset ) ) );
      }
      return dataSet;
    };

    const chartModel = new ChartModel( 700, 300, {
      modelXRange: new Range( -Math.PI / 8, Math.PI / 8 ),
      modelYRange: new Range( -4 / Math.PI, 4 / Math.PI )
    } );

    const chartRectangle = new ChartRectangle( chartModel, {
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
      chartModel.setModelXRange( zoomLevel === 1 ? new Range( -Math.PI / 8, Math.PI / 8 ) :
                                 zoomLevel === 2 ? new Range( -Math.PI / 4, Math.PI / 4 ) :
                                 zoomLevel === 3 ? new Range( -Math.PI / 3, Math.PI / 3 ) :
                                 zoomLevel === 4 ? new Range( -Math.PI / 2, Math.PI / 2 ) : null );
    } );

    const dataSets = [];

    for ( let i = 0; i < 500; i++ ) {
      // plots.push( new LinePlot( chartModel, createDataSet( -2, 2, 5 + i / 10 + phet.joist.random.nextDouble() / 10, phet.joist.random.nextDouble() * 2 ), { stroke: 'red', lineWidth: 2 } ) )
      const d = createDataSet( -2, 2, 5 + i / 10 + phet.joist.random.nextDouble() / 10, phet.joist.random.nextDouble() * 2 );
      dataSets.push( d );
    }

    // Anything you want clipped goes in here
    this.children = [

      // Background
      chartRectangle,

      // Clipped contents
      new Node( {
        // TODO https://github.com/phetsims/bamboo/issues/15 what if the chart area changes, then clip needs to change
        clipArea: chartRectangle.getShape(),
        children: [

          // Minor grid lines
          new GridLineSet( chartModel, Orientation.HORIZONTAL, Math.PI / 32, { stroke: 'lightGray' } ),
          new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, { stroke: 'lightGray' } ),

          // Axes nodes are clipped in the chart
          new AxisNode( chartModel, Orientation.HORIZONTAL ),
          new AxisNode( chartModel, Orientation.VERTICAL ),

          // Some data
          new CanvasLinePlot( chartModel, dataSets )
        ]
      } ),

      // Tick marks outside the chart
      new TickMarkSet( chartModel, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickMarkSet( chartModel, Orientation.HORIZONTAL, Math.PI / 8, { edge: 'min' } ),
      new LabelSet( chartModel, Orientation.HORIZONTAL, Math.PI / 8, {
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

bamboo.register( 'DemoCanvasLinePlot', DemoCanvasLinePlot );
export default DemoCanvasLinePlot;