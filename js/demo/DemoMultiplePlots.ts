// Copyright 2020-2023, University of Colorado Boulder

/**
 * Demonstrates multiple types of plots.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Transform1 from '../../../dot/js/Transform1.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import { DragListener, HBox, Node, SceneryEvent, Text, VBox, VBoxOptions } from '../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import BarPlot from '../BarPlot.js';
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import TickLabelSet from '../TickLabelSet.js';
import LinePlot from '../LinePlot.js';
import ScatterPlot from '../ScatterPlot.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';
import Tandem from '../../../tandem/js/Tandem.js';

class DemoMultiplePlots extends VBox {

  public constructor( options?: VBoxOptions ) {

    const dataSet = [];
    for ( let x = 2; x < 10; x += 0.1 ) {
      dataSet.push( new Vector2( x, Math.exp( x ) + dotRandom.nextDouble() * 1000 ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 600,
      viewHeight: 400,
      modelXRange: new Range( 2, 10 ),
      modelXRangeInverted: true,
      modelYRange: new Range( 1, 22000 )
      // yTransform is set in link() below
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
        new GridLineSet( chartTransform, Orientation.HORIZONTAL, 2, { stroke: 'darkGray', clippingType: 'strict' } ),
        new GridLineSet( chartTransform, Orientation.VERTICAL, 5000, { stroke: 'darkGray', clippingType: 'strict' } ),

        // Some data
        new BarPlot( chartTransform, dataSet, {
          opacity: 0.1,

          // So that log plot doesn't compute Math.log(0) = -Infinity
          barTailValue: 1E-8
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

        // Tick marks outside the chart
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } ),

        new TickMarkSet( chartTransform, Orientation.VERTICAL, 5000, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.VERTICAL, 5000, { edge: 'min' } )
      ]
    } );

    const linear = new Transform1( x => x, x => x );
    const transformProperty = new Property( linear );
    const controls = new VerticalAquaRadioButtonGroup( transformProperty, [
      { createNode: ( tandem: Tandem ) => new Text( 'linear', { fontSize: 14 } ), value: linear },
      {
        createNode: ( tandem: Tandem ) => new Text( 'log', { fontSize: 14 } ), value: new Transform1( Math.log, Math.exp, {
          range: new Range( 0, Number.POSITIVE_INFINITY ),
          domain: new Range( 0, Number.POSITIVE_INFINITY )
        } )
      }
    ] );
    transformProperty.link( type => chartTransform.setYTransform( type ) );

    const readout = new Text( 'Press/Drag to show point', {
      fontSize: 30,
      fill: 'black'
    } );

    const update = ( event: SceneryEvent ) => {

      const point = event.pointer.point;
      const parentPoint = chartRectangle.globalToParentPoint( point );
      const constrainedParentPoint = new Bounds2( 0, 0, chartTransform.viewWidth, chartTransform.viewHeight ).closestPointTo( parentPoint );
      const modelPt = chartTransform.viewToModelPosition( constrainedParentPoint );

      readout.string = `x: ${Utils.toFixed( modelPt.x, 1 )}, y: ${Utils.toFixed( modelPt.y, 1 )}`;
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