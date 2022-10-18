// Copyright 2021-2022, University of Colorado Boulder

/**
 * LinearEquationPlot plots a straight line, described by y = mx + b.
 * This was created for the Google Group discussion in
 * https://groups.google.com/g/developing-interactive-simulations-in-html5/c/k9P78WZivJ4.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../phet-core/js/optionize.js';
import { Line, LineOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

type SelfOptions = EmptySelfOptions;
export type LinearEquationPlotOptions = SelfOptions & LineOptions;

class LinearEquationPlot extends Line {

  private chartTransform: ChartTransform;
  private _b: number;
  private _m: number;
  private readonly disposeStraightLinePlot: () => void;

  /**
   * @param chartTransform
   * @param m - the slope, use Infinity or -Infinity for infinite (aka undefined) slope, a vertical line
   * @param b - the y-intercept
   * @param [providedOptions]
   */
  public constructor( chartTransform: ChartTransform, m: number, b: number, providedOptions?: LinearEquationPlotOptions ) {

    const options = optionize<LinearEquationPlotOptions, SelfOptions, LineOptions>()( {

      // Path options
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

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
  public setSlope( m: number ): void {
    this._m = m;
    this.update();
  }

  public set m( value: number ) {
    this.setSlope( value );
  }

  public get m(): number {
    return this._m;
  }

  // Sets the y-intercept and redraws the plot.
  public setYIntercept( b: number ): void {
    this._b = b;
    this.update();
  }

  public set b( value: number ) {
    this.setYIntercept( value );
  }

  public get b(): number {
    return this._b;
  }

  // Solves for y.
  public solve( x: number ): number {
    return ( this._m * x ) + this._b;
  }

  // Recomputes the endpoints of the line.
  private update(): void {

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

  public override dispose(): void {
    this.disposeStraightLinePlot();
    super.dispose();
  }
}

bamboo.register( 'LinearEquationPlot', LinearEquationPlot );
export default LinearEquationPlot;