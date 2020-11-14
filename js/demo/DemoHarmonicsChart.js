// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import ZoomButtonGroup from '../../../scenery-phet/js/ZoomButtonGroup.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import AxisNode from '../bamboo/AxisNode.js';
import ChartModel from '../bamboo/ChartModel.js';
import ChartRectangle from '../bamboo/ChartRectangle.js';
import GridLineSet from '../bamboo/GridLineSet.js';
import LinePlot from '../bamboo/LinePlot.js';
import TickMarkSet from '../bamboo/TickMarkSet.js';
import griddle from '../griddle.js';

/**
 * @author Sam Reid (PhET Interactive Simulations)
 */

class DemoHarmonicsChart extends Node {

  constructor( options ) {

    super();

    const createDataSet = ( min, max, frequency, delta = 0.005 ) => {
      const data = [];
      for ( let x = min; x <= max; x += delta ) {
        data.push( new Vector2( x, Math.sin( x * frequency ) ) );
      }
      return data;
    };

    const chartModel = new ChartModel( {
      width: 700,
      height: 300,
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

    // TODO: Should this be part of the "chart" or not?
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

    // Anything you want clipped goes in here
    // TODO: Or we could clip each child instead of having one clipped node?
    this.children = [

      // Background
      chartRectangle,

      // Clipped contents
      new Node( {
        clipArea: chartRectangle.getShape(), // TODO: what if the chart area changes, then clip needs to change
        children: [

          // Minor grid lines
          new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, { stroke: 'lightGray' } ),
          new GridLineSet( chartModel, Orientation.HORIZONTAL, Math.PI / 32, { stroke: 'lightGray' } ),

          // Axes nodes are clipped in the chart
          new AxisNode( chartModel, Orientation.VERTICAL ),
          new AxisNode( chartModel, Orientation.HORIZONTAL ),

          // Some data
          new LinePlot( chartModel, createDataSet( -2, 2, 5 ), { stroke: 'red', lineWidth: 2 } ),
          new LinePlot( chartModel, createDataSet( -2, 2, 10 ), { stroke: 'green', lineWidth: 2 } ),
          new LinePlot( chartModel, createDataSet( -2, 2, 20 ), { stroke: 'blue', lineWidth: 2 } ),
          new LinePlot( chartModel, createDataSet( -2, 2, 30 ), { stroke: 'orange', lineWidth: 2 } )
        ]
      } ),

      // Tick marks outside the chart
      new TickMarkSet( chartModel, Orientation.VERTICAL, 0.5, { edge: 'min' } ),
      new TickMarkSet( chartModel, Orientation.HORIZONTAL, Math.PI / 8, {
        edge: 'max', // TODO: should be min
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

griddle.register( 'DemoHarmonicsChart', DemoHarmonicsChart );
export default DemoHarmonicsChart;