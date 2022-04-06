// Copyright 2021, University of Colorado Boulder

/**
 * LinearEquationPlot plots a straight line, described by y = mx + b.
 * This was created for the Google Group discussion in
 * https://groups.google.com/g/developing-interactive-simulations-in-html5/c/k9P78WZivJ4.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import { Line } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

class LinearEquationPlot extends Line {
  chartTransform: ChartTransform;
  private _b: number;
  private _m: number;
  private disposeStraightLinePlot: () => void;

  /**
   * @param chartTransform
   * @param m - the slope, use Infinity or -Infinity for infinite (aka undefined) slope, a vertical line
   * @param b - the y-intercept
   * @param [options]
   */
  constructor( chartTransform: ChartTransform, m: number, b: number, options?: any ) {

    options = merge( {

      // Path options
      stroke: 'black',
      lineWidth: 1
    }, options );

    super( 0, 0, 1, 1, options );

    this.chartTransform = chartTransform;
    this._m = m;
    this._b = b;

    // initial state
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeStraightLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // Sets the slope and redraws the plot
  setSlope( m: number ): void {
    this._m = m;
    this.update();
  }

  set m( value ) {
    this.setSlope( value );
  }

  get m(): number {
    return this._m;
  }

  // Sets the y-intercept and redraws the plot.
  setYIntercept( b: number ): void {
    this._b = b;
    this.update();
  }

  set b( value ) {
    this.setYIntercept( value );
  }

  get b(): number {
    return this._b;
  }

  // Solves for y.
  solve( x: number ): number {
    return ( this._m * x ) + this._b;
  }

  // Recomputes the endpoints of the line.
  update() {

    if ( this._m === Infinity || this._m === -Infinity ) {

      // Slope is infinite, draw a vertical line.
      const modelX = 0;
      const modelMinY = this.chartTransform.modelYRange.min;
      const modelMaxY = this.chartTransform.modelYRange.max;

      // Convert to view coordinates.
      const viewX = this.chartTransform.modelToViewX( modelX );
      const viewMinY = this.chartTransform.modelToViewY( modelMinY );
      const viewMaxY = this.chartTransform.modelToViewY( modelMaxY );

      this.setLine( viewX, viewMinY, viewX, viewMaxY );
    }
    else {

      // Determine the endpoints, in model coordinates.
      const modelMinX = this.chartTransform.modelXRange.min;
      const modelMinY = this.solve( modelMinX );
      const modelMaxX = this.chartTransform.modelXRange.max;
      const modelMaxY = this.solve( modelMaxX );

      // Convert to view coordinates.
      const viewMinX = this.chartTransform.modelToViewX( modelMinX );
      const viewMinY = this.chartTransform.modelToViewY( modelMinY );
      const viewMaxX = this.chartTransform.modelToViewX( modelMaxX );
      const viewMaxY = this.chartTransform.modelToViewY( modelMaxY );

      this.setLine( viewMinX, viewMinY, viewMaxX, viewMaxY );
    }
  }

  override dispose() {
    this.disposeStraightLinePlot();
    super.dispose();
  }
}

bamboo.register( 'LinearEquationPlot', LinearEquationPlot );
export default LinearEquationPlot;