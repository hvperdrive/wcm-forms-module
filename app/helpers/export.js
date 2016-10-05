'use strict';

var _ = require('lodash');
var excelExport = require('excel-export');

var generateColumns = function generateColumns(jsonArr, colIsObject) {
    var cols = _.reduce(jsonArr, function(result, obj) {
        result.push(_.keys(obj));
        return result;
    }, []);

    cols = _(cols)
        .flattenDeep()
        .uniq()
        .map(function(key) {
            if(colIsObject) {
                return {
                    caption: key,
                    type: 'string',
                };
            }

            return key;
        })
        .value();

    return cols;
};

var generateColumnsRows = function generateColumnsRows(jsonArr, cols, colIsObject) {
    var rows = [];

    _.forEach(jsonArr, function(obj) {
        var row = [];

        row.length = cols.length;
        row.fill(null);

        _.forEach(obj, function(val, key) {
            var index = -1;

            if(colIsObject) {
                index = _.findIndex(cols, {caption: key});
            } else {
                index = cols.indexOf(key);
            }


            if(index !== -1) {
                row[index] = val;
            }
        });

        rows.push(row);
    });

    return rows;
};

var createCSVExport = function createCSVExport(jsonArr) {
    var columns = generateColumns(jsonArr);
    var rows = generateColumnsRows(jsonArr, columns);

    var csvContent = '"' + columns.join('";"') + '"';

    _.forEach(rows, function(row) {
        csvContent += '\n"' + row.join('";"') + '"';
    });

    return csvContent;
};
module.exports.csv = createCSVExport;


var createExcelExport = function createExcelExport(jsonArr) {
    var columns = generateColumns(jsonArr, true);
    var rows = generateColumnsRows(jsonArr, columns, true);

    var configuration = {
        cols: columns,
        rows: rows
    };

    return excelExport.execute(configuration);
};
module.exports.xls = createExcelExport;
