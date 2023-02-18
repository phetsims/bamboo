// Copyright 2020-2023, University of Colorado Boulder

/**
 * AxisLine is an axis that consists of a line, with no arrow heads.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../phet-core/js/optionize.js';
import Orientation from '../../phet-core/js/Orientation.js';
import { Line, LineOptions } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

type SelfOptions = {
  value?: number; // Value where the axis lies
  extension?: number; // in view coordinates, how far the axis goes past the edge of the ChartRectangle
};
export type AxisLineOptions = SelfOptions & LineOptions;

class AxisLine extends Line {
  private readonly chartTransform: ChartTransform;
  private readonly axisOrientation: Orientation;
  private readonly value: number;
  private readonly extension: number;
  private disposeAxisLine: () => void;

  public constructor( chartTransform: ChartTransform, axisOrientation: Orientation, providedOptions?: AxisLineOptions ) {

    const options = optionize<AxisLineOptions, SelfOptions, LineOptions>()( {

      // SelfOptions
      value: 0, // by default the axis is at 0, but you can put it somewhere else
      extension: 0,

      // Line options
      stroke: 'black',
      lineWidth: 2
    }, providedOptions );

    super( 0, 0, 0, 0, options );

    this.chartTransform = chartTransform;
    this.axisOrientation = axisOrientation;
    this.value = options.value;
    this.extension = options.extension;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeAxisLine = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  private update(): void {
    const viewValue = this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );

    // Move the axis to viewValue.
    if ( this.axisOrientation === Orientation.VERTICAL ) {
      this.setLine( viewValue, 0 - this.extension, viewValue, this.chartTransform.viewHeight + this.extension );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewWidth );
    }
    else {
      this.setLine( 0 - this.extension, viewValue, this.chartTransform.viewWidth + this.extension, viewValue );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewHeight );
    }
  }

  public override dispose(): void {
    this.disposeAxisLine();
    super.dispose();
  }
}

bamboo.register( 'AxisLine', AxisLine );
export default AxisLine;