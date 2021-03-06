# raml-validator-loader

A webpack plugin that converts RAML rules into pure javascript-only validation routines

## Usage

```js
import TypeValidators from './ramls/myTypes.raml';

// The raml-validator-loader will convert the RAML document into an object with
// a validation function for every type defined in your RAML.

var userInput = read_user_input();
var validationErrors = TypeValidators.MyType(userInput);

// Display errors
validationErrors.forEach((error) => {
  console.log('Error message: /' + error.path.join('/'));
  console.log('  Error path : ' + error.message);
});

```

## Installation

First install the module

```
npm install --save-dev raml-validator-loader
```

And then use it in your `webpack.config.js` like so:

```js
    module: {
        loaders: [
            { test: /\.raml$/, loader: "raml-validator-loader" }
        ]
    }
```

## API Reference

When you are importing a `.raml` document you will end-up loading a module that looks like this:

```js
module.exports = {

  /**
   * For every type in the RAML document, an equivalent validation function
   * will be generated by the loader.
   */
  RamlTypeName: function( validatorInput ) {

    ...

    // Each validation function will return an array of RAMLError objects
    // with the information for the validation errors occured.
    return [ RAMLError() ];
  },

}
```

The `RAMLError` class exposes the following properties:

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <th><code>.path</code></th>
    <td><code>Array</code></td>
    <td>Returns the path in the object where the error is located. <br />For example <code>['arrayProperty', 3, 'childProperty']</code></td>
  </tr>
  <tr>
    <th><code>.message</code></th>
    <td><code>String</code></td>
    <td>Returns the human-readable error message.</td>
  </tr>
</table>

## Work in progress

The following **facets** are not yet implemented:

- `discriminator` in [Unions](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#using-discriminator)
- `discriminatorValue` [Unions](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#using-discriminator)

The following **types** are not yet implemented:

- [`date-only`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#date)
- [`time-only `](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#date)
- [`datetime-only `](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#date)
- [`datetime`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#date)
- [`file`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#file)

The following **concepts** are not yet implemented:

- [Multiple Inheritance](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#multiple-inheritance)
