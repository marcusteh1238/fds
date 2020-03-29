This is how a response from a query usually looks like if its successful!
No rows:
```json
Result {
  command: 'SELECT',
  rowCount: 0,
  oid: null,
  rows: [],
  fields: [
    Field {
      name: '?column?',
      tableID: 0,
      columnID: 0,
      dataTypeID: 23,
      dataTypeSize: 4,
      dataTypeModifier: -1,
      format: 'text'
    }
  ],
  _parsers: [ [Function: parseInteger] ],
  _types: TypeOverrides {
    _types: {
      getTypeParser: [Function: getTypeParser],
      setTypeParser: [Function: setTypeParser],
      arrayParser: [Object],
      builtins: [Object]
    },
    text: {},
    binary: {}
  },
  RowCtor: null,
  rowAsArray: false
}
```
if there are rows, rowCount will be more than 1.
rows will look like this:
```json
rows: [
    {
        colName1: colvalue1,
        colName2: colvalue2
    }
]
```