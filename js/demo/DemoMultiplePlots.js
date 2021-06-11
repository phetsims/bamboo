// Copyright 2020-2021, University of Colorado Boulder

/**
 * Demonstrates multiple types of plots.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Transform1 from '../../../dot/js/Transform1.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import DragListener from '../../../scenery/js/listeners/DragListener.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
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
      dataSet.push( new Vector2( x, Math.exp( x ) + dotRandom.nextDouble() * 1000 ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 600,
      viewHeight: 400,
      modelXRange: new Range( 2, 10 ),
      modelYRange: new Range( Math.exp( 2 ), Math.exp( 10 ) ),
      yScale: new Transform1( Math.log, Math.exp, {
        domain: new Range( 1E-6, Number.POSITIVE_INFINITY ),
        range: new Range( 0, Number.POSITIVE_INFINITY )
      } )
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

    const linear = new Transform1( x => x, x => x );
    const logProperty = new Property( linear );
    const controls = new VerticalAquaRadioButtonGroup( logProperty, [
      { node: new Text( 'linear', { fontSize: 14 } ), value: linear },
      {
        node: new Text( 'log', { fontSize: 14 } ), value: new Transform1( Math.log, Math.exp, {
          range: new Range( 0, Number.POSITIVE_INFINITY ),
          domain: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      },
      {
        node: new Text( 'log10', { fontSize: 14 } ), value: new Transform1( Math.log10, x => Math.pow( 10, x ), {
          range: new Range( 0, Number.POSITIVE_INFINITY ),
          domain: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      }
    ] );
    logProperty.link( type => chartTransform.setYTransform( type ) );

    const readout = new Text( 'Press/Drag to show point', {
      fontSize: 30,
      fill: 'black'
    } );

    const update = event => {

      const point = event.pointer.point;
      const parentPoint = chartRectangle.globalToParentPoint( point );
      const modelPt = chartTransform.viewToModelPoint( parentPoint );

      readout.text = `x: ${Utils.toFixed( modelPt.x, 1 )}, y: ${Utils.toFixed( modelPt.y, 1 )}`;
    };
    chartRectangle.addInputListener( new DragListener( {
      press: update,
      drag: update
    } ) );

    // Controls
    super( {
      resize: false,
      spacing: 20,
      children: [
        chartNode,
        new HBox( { spacing: 100, children: [ controls, readout ] } )
      ]
    } );

    this.mutate( options );
  }
}

bamboo.register( 'DemoMultiplePlots', DemoMultiplePlots );
export default DemoMultiplePlots;