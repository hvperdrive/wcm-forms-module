'use strict';

require('rootpath')();
var formsController = require('../controllers/form');
// Get the configuration of the WCM
var config = require('config')();
// This is a helper middleware function to check if the user is logged in
var ProfileSecurity = require('app/helpers/modules/lib').ProfileSecurity;
// This is a helper middleware function to specify which method is used. This will be used in the PermissionsSecurity function.
// There are four methods available: read, create, update and delete.
var MethodSecurity = require('app/helpers/modules/lib').MethodSecurity;
// This is a helper middleware function generator that returns a middleware function that can be injected into route as seen below.
// The function will check if the user has the right permissions to execute this action.
// You need to specify the operation type that needs to be checked against (in this case it is the operation type specified in our package.json file).
var PermissionsSecurity = require('app/helpers/modules/lib').PermissionsSecurity('forms');
// Building the baseUrl based on the configuration. Every API call needs to be located after the api/ route
var baseUrl = '/' + config.api.prefix + config.api.version + 'forms';

module.exports = function(app, hooks) {

    // Get all forms
    app.route(baseUrl).get(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.read);
    // Get all external forms from the form & survey engine
    app.route(baseUrl + '/external').get(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.getExternal);
    // Get all external forms from the form & survey engine
    app.route(baseUrl + '/responses').get(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.getResponses);
    // Get all external forms from the form & survey engine
    app.route(baseUrl + '/export/:lookupKey/:version').get(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.generateResponsesFile);
    // Get one form by uuid
    app.route(baseUrl + '/:uuid').get(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.readOne);

    // Create a form
    app.route(baseUrl).post(ProfileSecurity, MethodSecurity.create, PermissionsSecurity, formsController.create);
    // Update a form
    app.route(baseUrl + '/:uuid').put(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.update);
    // Delete a form
    app.route(baseUrl + '/:uuid').delete(ProfileSecurity, MethodSecurity.read, PermissionsSecurity, formsController.delete);

    hooks.onLoadComplete = function() {
        console.log('onLoadComplete');
    };

    hooks.beforeRemove = function() {
        console.log('beforeRemove');
    };

    hooks.onRemoved = function() {
        console.log('onRemoved');
    };

    hooks.beforeEnable = function() {
        console.log('beforeEnable');
    };

    hooks.onEnabled = function() {
        console.log('onEnabled');
    };

    hooks.beforeDisable = function() {
        console.log('beforeDisable');
    };

    hooks.onDisabled = function() {
        console.log('onDisabled');
    };
};
