# turf-multipolygon

[![build status](https://secure.travis-ci.org/Turfjs/turf-multipolygon.png)](http://travis-ci.org/Turfjs/turf-multipolygon)

turf multipolygon module


### `turf.multipolygon(coordinates, properties)`

Creates a Feature based on a
coordinate array. Properties can be added optionally.


### Parameters

| parameter     | type                         | description                                                   |
| ------------- | ---------------------------- | ------------------------------------------------------------- |
| `coordinates` | Array\.\<Array\.\<Number\>\> | an array of Positions                                         |
| `properties`  | Object                       | _optional:_ an Object of key-value pairs to add as properties |


### Example

```js
var multiPoly = turf.multipolygon([[0,0],[10,10]]);

//=multiPoly
```


**Returns** `Feature.<MultiPolygon>`, a multipolygon feature

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-multipolygon
```

## Tests

```sh
$ npm test
```


