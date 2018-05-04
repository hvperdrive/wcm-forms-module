"use strict";

var _ = require("lodash");
var Q = require("q");
var url = require("url");
var request = require("request");
var VariableHelper = require("@wcm/module-helper").variables;

var packageInfo = null;

module.exports.set = function set(info) {
	packageInfo = info;
};

module.exports.get = function get() {
	return packageInfo;
};

var getAllTemplates = function getAllTemplates() {
	var d = Q.defer();

	if (!packageInfo === null) {
		return Q.reject("No packageinfo available!");
	}

	VariableHelper.getAll(packageInfo.name, packageInfo.version)
		.then(function(variables) {

			request.get({
				url: url.resolve(variables.domain, "/acpaas/form-survey-template/v" + variables.templateVersion + "/api/Templates"),
				qs: {
					"apikey": variables.apiKey,
					"pagesize": 100,
				},
				headers: {
					"tenantKey": variables.tenantKey,
				},
			}, function(error, response, body) {
				if (error) {
					return d.reject(error);
				}

				return d.resolve(JSON.parse(body));
			});
		}, function onError(responseError) {
			d.reject(responseError);
		});

	return d.promise;
};

module.exports.getAllTemplates = getAllTemplates;

var parseTemplateVersions = function parseTemplateVersions(templates) {

	var result = _(templates)
		.groupBy("lookupKey")
		.map(function(group) {
			if (!Array.isArray(group) || !group.length) {
				return null;
			}

			return {
				lookupKey: (group[0] || {}).lookupKey,
				name: (group[0] || {}).name,
				data: _.sortByOrder(group, "creation", "desc"),
			};
		})
		.filter(function(group) {
			return group !== undefined;
		})
		.value();

	return result;
};

module.exports.parseTemplateVersions = parseTemplateVersions;

var getResponses = function getResponses(lookupKey, version) {
	var d = Q.defer();

	VariableHelper.getAll(packageInfo.name, packageInfo.version)
		.then(function(variables) {

			request.get({
				url: url.resolve(variables.domain, "/acpaas/form-survey-response/v" + variables.responseVersion + "/api/Responses/" + lookupKey + "/" + version),
				qs: {
					"apikey": variables.apiKey,
				},
				headers: {
					"tenantKey": variables.tenantKey,
				},
			}, function(error, response, body) {
				if (error) {
					return d.reject(error);
				}

				return d.resolve(JSON.parse(body));
			});
		}, function onError(responseError) {
			d.reject(responseError);
		});

	return d.promise;
};

module.exports.getResponses = getResponses;
