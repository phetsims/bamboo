// Copyright 2020-2021, University of Colorado Boulder

/**
 * AxisArrowNode shows an axis with arrows at one or both ends. An axis is typically bolder than any grid line (if any),
 * and typically at x=0 or y=0, but those defaults can be overridden with options.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../phet-core/js/merge.js';
import Orientation from '../../phet-core/js/Orientation.js';
import ArrowNode from '../../scenery-phet/js/ArrowNode.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';

class AxisArrowNode extends ArrowNode {
  private readonly chartTransform: ChartTransform;
  private readonly value: number;
  private readonly extension: number;
  private readonly axisOrientation: Orientation;
  private disposeAxisNode: () => void;

  constructor( chartTransform: ChartTransform, axisOrientation: Orientation, options?: any ) {

    options = merge( {
      value: 0, // by default the axis is at 0, but you can put it somewhere else
      extension: 20, // in view coordinates, how far the axis goes past the edge of the ChartRectangle

      // ArrowNode options
      doubleHead: true,
      headHeight: 10,
      headWidth: 10,
      tailWidth: 2
    }, options );

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

    this.disposeAxisNode = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  private update(): void {
    const viewValue = this.chartTransform.modelToView( this.axisOrientation.opposite, this.value );

    // Move the axis to viewValue.
    if ( this.axisOrientation === Orientation.VERTICAL ) {
      this.setTailAndTip( viewValue, 0 - this.extension, viewValue, this.chartTransform.viewHeight + this.extension );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewWidth );
    }
    else {
      this.setTailAndTip( 0 - this.extension, viewValue, this.chartTransform.viewWidth + this.extension, viewValue );
      this.setVisible( viewValue >= 0 && viewValue <= this.chartTransform.viewHeight );
    }
  }

  override dispose(): void {
    this.disposeAxisNode();
    super.dispose();
  }
}

bamboo.register( 'AxisArrowNode', AxisArrowNode );
export default AxisArrowNode;