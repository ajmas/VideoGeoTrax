var test = require('tape');
var multipolygon = require('./')

test('multipolygon', function(t){
  t.deepEqual(multipolygon([[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]), {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]
    }
  }, 'takes coordinates');

  t.deepEqual(multipolygon([[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]], {test: 23}), {
    "type": "Feature",
    "properties": {
      test: 23
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [[[[94,57],[78,49],[94,43],[94,57]]],[[[93,19],[63,7],[79,0],[93,19]]]]
    }
  }, 'takes properties');


  t.throws(function(err){
    multipolygon();
  }, 'throws error with no coordinates');

  t.end();
});