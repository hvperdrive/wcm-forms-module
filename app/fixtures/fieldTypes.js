'use strict';

// Set default envs
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.APP = process.env.APP || 'default';
// Set envs to lowercase
process.env.NODE_ENV = process.env.NODE_ENV.toLowerCase();
process.env.APP = process.env.APP.toLowerCase();

require('rootpath')();
var Q = require('q');
var _ = require('lodash');
var mongoose = require('mongoose');
var config = require('config')();

// Start mongoose connection
mongoose.connect(config.server.mongo.url + '/' + config.server.mongo.db);

var FieldTypeModel = require('app/models/fieldType');

// jscs:disable maximumLineLength
var fieldTypes = {
    formFieldType: {
        key: 'form',
        label: 'Form',
        type: 'Form',
        dataType: 'array',
        isQueryable: false,
        isTranslate: false,
        isMultiple: true,
        operators: [],
        uuid: 'db0dd755-83f1-4fc1-8bc6-2f2d3f279170'
    }
};

var createFieldType = function createFieldType(data) {
    if(data === null) {
        return Q.when(null);
    }

    var d = Q.defer();

    FieldTypeModel.create(data)
        .then(
            function onSuccess() {
                d.resolve(true);
            },
            function onError(error) {
                d.reject(error);
            }
        );

    return d.promise;
};

var checkIfFieldTypeAlreadyExists = function checkIfFieldTypeAlreadyExists(fieldtype) {
    var d = Q.defer();

    FieldTypeModel.find({uuid: fieldtype.uuid})
        .lean()
        .exec(
            function onSuccess(err, response) {
                console.log(response);
                if(response && response.length) {
                    d.resolve(null);
                } else {
                    d.resolve(fieldtype);
                }
            },
            function onError(err) {
                d.reject(err);
            }
        );

    return d.promise;
};

var init = function init() {
    var promises = [];

    _.forEach(fieldTypes, function(ft) {
        promises.push(
            checkIfFieldTypeAlreadyExists(ft)
                .then(
                    createFieldType,
                    function(err) {
                        return Q.reject(err);
                    }
                )
        );


    });

    Q.all(promises).then(
        function onSuccess() {
            console.log('Form fieldtypes added');
            process.exit(0);
        },
        function onError(err) {
            console.log('There was a error while adding a fieldtype for a form');
            console.log(err);
            process.exit(1);
        }
    );
};

init();
