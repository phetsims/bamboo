// Copyright 2020-2022, University of Colorado Boulder

import bamboo from './bamboo.js';

/**
 * Indicates whether objects will be truncated right at the edge of the chart, or beyond the edge of the chart.
 *
 * For objects within the chart, you may need a lenient ClippingStyle so it doesn't flicker off and disappear
 * abruptly when scrolling out of view.
 *
 * For objects outside the chart, you may need a strict ClippingStyle so they don't exceed the bounds of the chart.
 * @author Sam Reid (PhET Interactive Simulations)
 */

const ClippingTypeValues = [ 'strict', 'lenient' ] as const;
type ClippingType = typeof ClippingTypeValues[number];

bamboo.register( 'ClippingTypeValues', ClippingTypeValues );

export { ClippingTypeValues };
export default ClippingType;