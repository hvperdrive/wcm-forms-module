'use strict';

// Set default envs
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.APP = process.env.APP || 'default';

require('rootpath')();
var Q = require('q');
var _ = require('lodash');
var mongoose = require('mongoose');
var packageConfig = require('../../package.json');
// var config = require('config')();

// Get mongo url parameter
var argvIndex = _.findIndex(process.argv, function (val) {
	return val.indexOf('mongodb://') !== -1;
});

if (argvIndex < 0 || argvIndex >= process.argv.length) {
	console.log('No mongo path specified. Please use --mongo [mongoPath]');
	return process.exit(1);
}

var mongoUrl = process.argv[argvIndex];

// Start mongoose connection
mongoose.connect(mongoUrl);
mongoose.Promise = require('q').Promise;

var FieldTypeModel = require('app/models/fieldType');

// jscs:disable maximumLineLength
var fieldTypes = {
	formFieldType: {
		key: 'form-select',
		label: 'Form',
		type: 'form-select',
		dataType: 'array',
		isQueryable: false,
		isTranslate: false,
		isMultiple: true,
		source: 'external',
		requestHookFile: 'app/modules/modules/' + packageConfig.name + '_' + packageConfig.version + '/app/helpers/requestHooks',
		operators: []
	}
};

var createFieldType = function createFieldType(data) {
	var d = Q.defer();
	if (data.uuid) {
		FieldTypeModel.update({ uuid: data.uuid }, data)
			.exec()
			.then(
			function onSuccess() {
				d.resolve(true);
			},
			function onError(error) {
				d.reject(error);
			}
			);
	} else {
		FieldTypeModel.create(data)
			.then(
			function onSuccess() {
				d.resolve(true);
			},
			function onError(error) {
				d.reject(error);
			}
			);
	}

	return d.promise;
};

var checkIfFieldTypeAlreadyExists = function checkIfFieldTypeAlreadyExists(fieldtype) {
	var d = Q.defer();

	FieldTypeModel.findOne({ key: fieldtype.key })
		.exec()
		.then(
		function onSuccess(response) {
			if (response) {
				fieldtype.uuid = response.uuid;
			}
			d.resolve(fieldtype);
		},
		function onError(err) {
			d.reject(err);
		}
		);

	return d.promise;
};

var init = function init() {
	var promises = [];

	_.forEach(fieldTypes, function (ft) {
		promises.push(
			checkIfFieldTypeAlreadyExists(ft)
				.then(
				createFieldType,
				function (err) {
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
