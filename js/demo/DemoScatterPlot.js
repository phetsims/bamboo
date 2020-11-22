// Copyright 2020, University of Colorado Boulder

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Node from '../../../scenery/js/nodes/Node.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import HSlider from '../../../sun/js/HSlider.js';
import AxisNode from '../AxisNode.js';
import BarPlot from '../BarPlot.js';
import ChartModel from '../ChartModel.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import LinePlot from '../LinePlot.js';
import ScatterPlot from '../ScatterPlot.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class DemoScatterPlot extends VBox {

  constructor( options ) {

    const data = [];
    for ( let i = -3; i < 3; i += 0.01 ) {
      phet.joist.random.nextDouble() < 0.3 && data.push( new Vector2( i, Math.sin( i * 2 ) ) );
    }

    const chartModel = new ChartModel( 600, 400, {
      modelXRange: new Range( -1, 1 ),
      modelYRange: new Range( -1, 1 )
    } );

    const chartRectangle = new ChartRectangle( chartModel, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Anything you want clipped goes in here
    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        // Minor grid lines
        new GridLineSet( chartModel, Orientation.HORIZONTAL, 0.1, { stroke: 'lightGray' } ),
        new GridLineSet( chartModel, Orientation.VERTICAL, 0.1, { stroke: 'lightGray' } ),

        // Major grid lines
        new GridLineSet( chartModel, Orientation.HORIZONTAL, 0.2, { stroke: 'darkGray', clipped: true } ),
        new GridLineSet( chartModel, Orientation.VERTICAL, 0.2, { stroke: 'darkGray', clipped: true } ),

        // Tick labels along the axes
        new TickMarkSet( chartModel, Orientation.HORIZONTAL, 0.2, { clipped: true } ),
        new TickMarkSet( chartModel, Orientation.VERTICAL, 0.2, { clipped: true } ),

        // Some data
        new BarPlot( chartModel, data, { opacity: 0.2 } ),
        new LinePlot( chartModel, data, {
          stroke: 'red',
          lineWidth: 2
        } ),
        new ScatterPlot( chartModel, data, {
          fill: 'blue'
        } )
      ]
    } );

    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Clipped contents
        chartClip,

        // axes nodes not clipped
        new AxisNode( chartModel, Orientation.VERTICAL ),
        new AxisNode( chartModel, Orientation.HORIZONTAL ),

        // Tick marks outside the chart
        new TickMarkSet( chartModel, Orientation.VERTICAL, 0.2, { edge: 'min' } ),
        new TickMarkSet( chartModel, Orientation.HORIZONTAL, 0.2, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.VERTICAL, 0.2, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.HORIZONTAL, 0.2, { edge: 'min' } )
      ]
    } );

    // Controls
    const centerXProperty = new NumberProperty( 0 );
    centerXProperty.link( centerX => chartModel.setModelXRange( new Range( -1 - centerX, 1 - centerX ) ) );
    const controls = new HSlider( centerXProperty, new Range( -1.25, 1.25 ), {
      trackSize: new Dimension2( 500, 5 )
    } );
    super( {
      resize: false,
      children: [ chartNode, controls ]
    } );

    this.mutate( options );
  }
}

bamboo.register( 'DemoScatterPlot', DemoScatterPlot );
export default DemoScatterPlot;