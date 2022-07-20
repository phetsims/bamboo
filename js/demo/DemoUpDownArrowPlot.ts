// Copyright 2021-2022, University of Colorado Boulder

/**
 * Demonstrates an UpDownArrowPlot.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import AxisArrowNode from '../AxisArrowNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import { Color, Node, NodeOptions } from '../../../scenery/js/imports.js';
import UpDownArrowPlot from '../UpDownArrowPlot.js';

class DemoUpDownArrowPlot extends Node {
  public constructor( options?: NodeOptions ) {
    super();

    const modelXRange = new Range( 0, 10 );
    const modelYRange = new Range( -100, 100 );

    // one data point for each integer point in the model, y values interpolated along the x range from min to max
    const dataSet = [];
    for ( let i = 0; i <= modelXRange.max; i++ ) {
      dataSet.push( new Vector2( i, modelYRange.min + ( modelYRange.getLength() / modelXRange.getLength() ) * i ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 500,
      viewHeight: 400,
      modelXRange: modelXRange,
      modelYRange: modelYRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const barPlot = new UpDownArrowPlot( chartTransform, dataSet, {
      arrowNodeOptions: {
        headWidth: 15,
        headHeight: 15
      },
      pointToPaintableFields: ( point: Vector2 ) => {

        // interpolate from red at modelYRange.min, green at modelYRange.max
        const distance = 1 / ( modelYRange.getLength() ) * ( point.y - modelYRange.min );
        const c = Color.interpolateRGBA( new Color( 'red' ), new Color( 'lawngreen' ), distance );
        return { fill: c };
      }
    } );
    const xAxis = new AxisArrowNode( chartTransform, Orientation.HORIZONTAL );

    // anything you want clipped goes in here
    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        barPlot,
        xAxis
      ]
    } );

    this.children = [ chartRectangle, chartClip ];

    // for positioning in the demo
    this.mutate( options );
  }
}

bamboo.register( 'DemoUpDownArrowPlot', DemoUpDownArrowPlot );
export default DemoUpDownArrowPlot;
