// Copyright 2020-2022, University of Colorado Boulder

/**
 * QUnit tests for ChartTransform
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BarPlot from './BarPlot.js';
import ChartTransform from './ChartTransform.js';

QUnit.module( 'ChartModel' );

QUnit.test( 'basic tests', assert => {
  assert.ok( true, 'first test' );
  assert.ok( new BarPlot( new ChartTransform(), [] ), 'another simple test' );
} );