// Copyright 2020-2022, University of Colorado Boulder

/**
 * Demonstrates a BarPlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import { Color, Node, NodeOptions, Text, VBox } from '../../../scenery/js/imports.js';
import TextPushButton from '../../../sun/js/buttons/TextPushButton.js';
import bamboo from '../bamboo.js';
import BarPlot from '../BarPlot.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import GridLineSet from '../GridLineSet.js';
import TickLabelSet from '../TickLabelSet.js';
import TickMarkSet from '../TickMarkSet.js';

class DemoBarPlot extends Node {

  public constructor( options?: NodeOptions ) {
    super();

    const createDataSet = ( randomX: number, randomY: number ) => {
      const dataSet = [];
      for ( let i = 0; i <= 24; i++ ) {
        const x = Math.PI * i;
        const arg = x - Math.PI * 12;
        const c = 10;
        const y = 0.13 * Math.exp( -arg * arg / 2 / c / c );
        dataSet.push( new Vector2( x + randomX * dotRandom.nextDouble(), y + randomY * dotRandom.nextDouble() ) );
      }
      return dataSet;
    };
    const dataSet = createDataSet( 0, 0 );

    const chartTransform = new ChartTransform( {
      viewWidth: 700,
      viewHeight: 300,
      modelXRange: new Range( 0, Math.PI * 24 ),
      modelYRange: new Range( 0, 0.14 )
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Anything you want clipped goes in here
    const barPlot = new BarPlot( chartTransform, dataSet, {
      pointToPaintableFields: ( point: Vector2 ) => {
        const c = Utils.linear( 0, 24 * Math.PI, 0, 240, point.x );
        return { fill: new Color( c, c, c ) };
      }
    } );

    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // Minor grid lines
        new GridLineSet( chartTransform, Orientation.VERTICAL, 0.05, { stroke: 'lightGray' } ),

        // Some data
        barPlot
      ]
    } );

    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Clipped contents
        chartClip,

        // Minor ticks on the y-axis
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.01, {
          stroke: 'darkGray',
          edge: 'min'
        } ),

        // Major ticks on the y-axis
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.05, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.VERTICAL, 0.05, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value, 2 ), { fontSize: 12 } )
        } ),

        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI * 2, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, Math.PI * 2, {
          edge: 'min',
          createLabel: ( value: number ) => new Text( Utils.toFixed( value / Math.PI, 0 ) + MathSymbols.PI, { fontSize: 12 } )
        } )
      ]
    } );

    const randomDataSetButton = new TextPushButton( 'Random Data Set', {
      listener: () => {
        barPlot.setDataSet( createDataSet( 2, 0.1 ) );
      }
    } );

    this.children = [
      new VBox( {
        align: 'left',
        resize: false,
        spacing: 20,
        children: [ chartNode, randomDataSetButton ]
      } )
    ];
    this.mutate( options );
  }
}

bamboo.register( 'DemoBarPlot', DemoBarPlot );
export default DemoBarPlot;