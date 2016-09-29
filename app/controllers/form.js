'use strict';

require('rootpath')();
var Q = require('q');
var FormModel = require('../models/form');
var ERROR_TYPES = require('app/middleware/errorInterceptor').ERROR_TYPES;
/**
 * @api {GET} /api/1.0.0/forms/ Get all forms.
 * @apiGroup Forms
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object[]} Consumers200All Success
 *
 * @apiError (400) {Object} Error Bad request
 */
var read = function(req, res, next) {
    FormModel.find({
            'meta.deleted': false
        })
        .populate('meta.lastEditor')
        .lean()
        .exec(function(err, items) {
            if (!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({
                    err: err
                });
            }
        });
};
module.exports.read = read;

/**
 * @api {GET} /api/1.0.0/forms/:uuid/ Get a single form.
 * @apiGroup Forms
 * @apiParam {String} uuid Consumer uuid
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Consumers200Single Success
 *
 * @apiError (400) {Object} Error Bad request
 */
var readOne = function(req, res, next) {
    if (!req.params.uuid) {
        return res.status(412).json({
            logType: ERROR_TYPES.NO_UUID,
            err: {
                msg: 'There is no uuid parameter specified!'
            }
        });
    }

    FormModel.findOne({
            uuid: req.params.uuid,
            'meta.deleted': false
        })
        .lean()
        .exec(function(err, items) {
            if (!err && items) {
                res.status(200).json(items);
            } else {
                res.status(400).json({
                    err: err
                });
            }
        });
};
module.exports.readOne = readOne;

/**
 * @api {GET} /api/1.0.0/forms/external Get a external forms.
 * @apiGroup Forms
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Consumers200Single Success
 *
 * @apiError (400) {Object} Error Bad request
 */
var getExternal = function(req, res, next) {
    // TODO: Get all forms from the form & survey engine here and return a modified version of it.

    // Temp: return mocked Data
    res.status(200).json({
        'data': [{
            'name': 'Gezinssamenstelling',
            'description': 'Gezinssamenstelling formulier',
            'lookupKey': 'e13d2485-7eed-475b-8032-fc490953e4f0',
            'version': 'BB3CF8326E2A925AF7576B4FB9742367',
            'content': '{\'info\': {\'title\': \'Gezinssamenstelling\',\'body\': \'In het uittreksel gezinssamenstelling staat hoeveel personener officieel in uw gezin leven.\',},\'name\': \'UittrekselGezinssamenstelling\',\'formId\': \'\',\'canSaveDraft\' : true,\'saveOnNavigate\': false,\'rendererVersion\': \'1\',\'steps\': [],\'sections\': [],\'fields\': [],\'validators\': [{\'name\': \'myOwnReusableValidator\',\'type\': \'regexp\',\'options\': {\'pattern\': \'/^[1-9]|[1-9][0-9]+$/\'},\'errorMessage\': \'Gelieve enkel cijfers te gebruiken\'}]}',
            'creation': '2016-07-08T16:11:49.872207+02:00'
        }],
        'self': '/api/templates/e13d2485-7eed-475b-8032-fc490953e4f0/BB3CF8326E2A925AF7576B4FB9742367',
        'generation': {
            'timeStamp': '2016-07-08T16:14:05.7480173+02:00',
            'duration': 719
        },
        'feedback': null
    });
};
module.exports.getExternal = getExternal;

/**
 * @api {PUT} /api/1.0.0/forms/:uuid/ Update a form.
 * @apiGroup Forms
 * @apiParam {String} uuid Form uuid
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Consumers200Update Success
 * @apiSuccess (200) {String} Consumers200Update._id Mongo _id
 * @apiSuccess (200) {String} Consumers200Update.uuid Field type uuid
 * @apiSuccess (200) {Object} Consumers200Update.data Data
 * @apiSuccess (200) {Object} Consumers200Update.data.link Link
 * @apiSuccess (200) {String} Consumers200Update.data.link.description Description
 * @apiSuccess (200) {String} Consumers200Update.data.link.url URL
 * @apiSuccess (200) {Object} Consumers200Update.meta Metadata
 * @apiSuccess (200) {Date} Consumers200Update.meta.created Created at
 * @apiSuccess (200) {Boolean} Consumers200Update.meta.deleted Deleted
 * @apiSuccess (200) {Date} Consumers200Update.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Consumers200Update.meta.lastEditor Last edited by
 * @apiSuccess (200) {Object[]} Consumers200Update.versions Versions
 *
 * @apiError (400) {Object} Error Bad request
 */
exports.update = function(req, res, next) {
    if (!req.params.uuid) {
        return res.status(400).json({
            logType: ERROR_TYPES.NO_UUID,
            err: 'There is no uuid parameter specified!'
        });
    }

    // Find userId to update to meta.lastEditor
    if (req.session.hasOwnProperty('profile')) {
        // Replace last editor _id
        req.body.meta.lastEditor = req.session.profile._id.toString();
    }

    FormModel.findOneAndUpdate({
            uuid: req.params.uuid
        }, req.body, {
            new: true
        })
        .then(
            function onSuccess(response) {
                res.status(200).json(response);
            },
            function onError(responseError) {
                res.status(400).json({
                    err: responseError
                });
            }
        );
};

/**
 * @api {POST} /api/1.0.0/forms/ Add a new form.
 * @apiGroup Forms
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Consumers200Add Success
 * @apiSuccess (200) {String} Consumers200Add._id Mongo _id
 * @apiSuccess (200) {String} Consumers200Add.uuid Field type uuid
 * @apiSuccess (200) {Object} Consumers200Add.data Data
 * @apiSuccess (200) {Object} Consumers200Add.data.link Link
 * @apiSuccess (200) {String} Consumers200Add.data.link.description Description
 * @apiSuccess (200) {String} Consumers200Add.data.link.url URL
 * @apiSuccess (200) {Object} Consumers200Add.meta Metadata
 * @apiSuccess (200) {Date} Consumers200Add.meta.created Created at
 * @apiSuccess (200) {Boolean} Consumers200Add.meta.deleted Deleted
 * @apiSuccess (200) {Date} Consumers200Add.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Consumers200Add.meta.lastEditor Last edited by
 * @apiSuccess (200) {Object[]} Consumers200Add.versions Versions
 *
 * @apiError (400) {Object} Error Bad request
 */
exports.create = function(req, res, next) {
    // Find userId to update to meta.lastEditor
    if (req.session.hasOwnProperty('profile')) {
        // Replace last editor _id
        req.body.meta.lastEditor = req.session.profile._id.toString();
    }

    FormModel.create(req.body)
        .then(
            function onSuccess(response) {
                res.status(200).json(response);
            },
            function onError(responseError) {
                res.status(400).json({
                    err: responseError
                });
            }
        );
};

/**
 * @api {DELETE} /api/1.0.0/forms/:uuid/ Delete a form
 * @apiParam {String} uuid Form uuid
 * @apiVersion 1.0.0
 *
 * @apiSuccess (204) Consumers204Delete No content
 *
 * @apiError (400) {Object} Error Bad request
 */
exports.delete = function(req, res, next) {
    if (!req.params.uuid) {
        return res.status(400).json({
            logType: ERROR_TYPES.NO_UUID,
            err: 'There is no uuid parameter specified!'
        });
    }

    var contentId;

    // Find the consumer id first, because we don't have the _id here.
    FormModel.findOne({
            uuid: req.params.uuid
        }, {
            _id: 1
        })
        .then(
            function onSuccess(response) {
                if (response) {
                    contentId = response._id;
                    return Q.when(response._id);
                } else {
                    throw 'Content item not found.';
                }
            }
        )
        .then(
            function deleteContent() {
                return FormModel.update({
                        uuid: req.params.uuid
                    }, {
                        $set: {
                            'meta.deleted': true
                        }
                    })
                    .exec();
            }
        )
        .then(
            function onSuccess() {
                res.status(204).send();
            },
            function onError(responseError) {
                res.status(400).json({
                    err: responseError
                });
            }
        );
};
