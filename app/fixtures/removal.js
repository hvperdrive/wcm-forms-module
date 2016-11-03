'use strict';

// Set default envs
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.APP = process.env.APP || 'default';

require('rootpath')();
var _ = require('lodash');
var mongoose = require('mongoose');

// Get mongo url parameter
var argvIndex = _.findIndex(process.argv, function(val) {
    return val.indexOf('mongodb://') !== -1;
});

if(argvIndex < 0 || argvIndex >= process.argv.length) {
    console.log('No mongo path specified. Please use --mongo [mongoPath]');
    return process.exit(1);
}

var mongoUrl = process.argv[argvIndex];

// Start mongoose connection
mongoose.connect(mongoUrl);
mongoose.Promise = require('q').Promise;

var RemovalHelper = require('app/helpers/modules/lib/removal');

RemovalHelper.removeFromFieldTypes('form-select')
    .then(
        function onSuccess() {
            return RemovalHelper.removeFromContentTypes('form-select');
        },
        function onError(responseError) {
            throw responseError;
        }
    )
    .then(
        function onSuccess() {
            process.exit(0);
        },
        function onError(responseError) {
            console.log('There was a problem while removing the forms data.');
            console.log(responseError);
            process.exit(1);
        }
    );
