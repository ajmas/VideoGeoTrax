/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @module turf/multipolygon
 * @category helper
 * @param {Array<Array<Number>>} coordinates an array of Positions
 * @param {Object=} properties an Object of key-value pairs to add as properties
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multipolygon([[0,0],[10,10]]);
 *
 * //=multiPoly
 *
 */
turf.multipolygon = function(coordinates, properties) {
  if (!coordinates) {
    throw new Error('No coordinates passed');
  }
  return {
    "type": "Feature",
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": coordinates
    },
    "properties": properties || {}
  };
};