// Copyright 2020, University of Colorado Boulder

/**
 * Demonstrates multiple types of plots.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

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
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import ClippingType from '../ClippingType.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import LinePlot from '../LinePlot.js';
import ScatterPlot from '../ScatterPlot.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

class DemoMultiplePlots extends VBox {

  constructor( options ) {

    const dataSet = [];
    for ( let x = 2; x < 10; x += 0.1 ) {
      dataSet.push( new Vector2( x, Math.exp( x ) + phet.joist.random.nextDouble() * 1000 ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 600,
      viewHeight: 400,
      modelXRange: new Range( 2, 10 ),
      modelYRange: new Range( Math.exp( 2 ), Math.exp( 10 ) ),
      yScale: Math.log
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
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
        new GridLineSet( chartTransform, Orientation.HORIZONTAL, 2, { stroke: 'darkGray', clippingType: ClippingType.LOOSE } ),
        new GridLineSet( chartTransform, Orientation.VERTICAL, 5000, { stroke: 'darkGray', clippingType: ClippingType.LOOSE } ),

        // Tick labels along the axes
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 2, { clippingType: ClippingType.LOOSE } ),
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 5000, { clippingType: ClippingType.LOOSE } ),

        // Some data
        new BarPlot( chartTransform, dataSet, {
          opacity: 0.1
        } ),
        new LinePlot( chartTransform, dataSet, {
          stroke: 'red',
          lineWidth: 2
        } ),
        new ScatterPlot( chartTransform, dataSet, {
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
        new AxisNode( chartTransform, Orientation.VERTICAL ),
        new AxisNode( chartTransform, Orientation.HORIZONTAL ),

        // Tick marks outside the chart
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } ),
        new LabelSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } ),

        new TickMarkSet( chartTransform, Orientation.VERTICAL, 5000, { edge: 'min' } ),
        new LabelSet( chartTransform, Orientation.VERTICAL, 5000, { edge: 'min' } )
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
    logProperty.link( type => chartTransform.setYScale( type ) );

    // Controls
    super( {
      resize: false,
      spacing: 20,
      children: [ chartNode, controls ]
    } );

    this.mutate( options );
  }
}

bamboo.register( 'DemoMultiplePlots', DemoMultiplePlots );
export default DemoMultiplePlots;