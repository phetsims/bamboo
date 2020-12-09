// Copyright 2020, University of Colorado Boulder

import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import AxisNode from '../AxisNode.js';
import BarPlot from '../BarPlot.js';
import ChartModel from '../ChartModel.js';
import ChartRectangle from '../ChartRectangle.js';
import ClippingType from '../ClippingType.js';
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

class DemoLogPlot extends VBox {

  constructor( options ) {

    const dataSet = [];
    for ( let x = 2; x < 10; x += 0.1 ) {
      dataSet.push( new Vector2( x, Math.exp( x ) + phet.joist.random.nextDouble() * 1000 ) );
    }

    const chartModel = new ChartModel( 600, 400, {
      modelXRange: new Range( 2, 10 ),
      modelYRange: new Range( Math.exp( 2 ), Math.exp( 10 ) ),
      yScale: Math.log
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

        // Major grid lines
        new GridLineSet( chartModel, Orientation.HORIZONTAL, 2, { stroke: 'darkGray', clippingType: ClippingType.LOOSE } ),
        new GridLineSet( chartModel, Orientation.VERTICAL, 5000, { stroke: 'darkGray', clippingType: ClippingType.LOOSE } ),

        // Tick labels along the axes
        new TickMarkSet( chartModel, Orientation.HORIZONTAL, 2, { clippingType: ClippingType.LOOSE } ),
        new TickMarkSet( chartModel, Orientation.VERTICAL, 5000, { clippingType: ClippingType.LOOSE } ),

        // Some data
        new BarPlot( chartModel, dataSet, {
          opacity: 0.1
        } ),
        new LinePlot( chartModel, dataSet, {
          stroke: 'red',
          lineWidth: 2
        } ),
        new ScatterPlot( chartModel, dataSet, {
          fill: 'blue',
          radius: 3
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
        new TickMarkSet( chartModel, Orientation.HORIZONTAL, 2, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.HORIZONTAL, 2, { edge: 'min' } ),

        new TickMarkSet( chartModel, Orientation.VERTICAL, 5000, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.VERTICAL, 5000, { edge: 'min' } )
      ]
    } );

    const linear = x => x;
    const logProperty = new Property( linear );
    const controls = new VerticalAquaRadioButtonGroup( logProperty, [
      { node: new Text( 'linear', { fontSize: 14 } ), value: linear },
      { node: new Text( 'log', { fontSize: 14 } ), value: Math.log },
      { node: new Text( 'log10', { fontSize: 14 } ), value: Math.log10 },
      { node: new Text( 'sin', { fontSize: 14 } ), value: Math.sin }
    ] );
    logProperty.link( type => chartModel.setYScale( type ) );

    // Controls
    super( {
      resize: false,
      spacing: 20,
      children: [ chartNode, controls ]
    } );

    this.mutate( options );
  }
}

bamboo.register( 'DemoLogPlot', DemoLogPlot );
export default DemoLogPlot;