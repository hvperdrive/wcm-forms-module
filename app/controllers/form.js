'use strict';

require('rootpath')();
var _ = require('lodash');
var Q = require('q');
var FormModel = require('../models/form');
var Export = require('../helpers/export');
var ERROR_TYPES = require('app/middleware/errorInterceptor').ERROR_TYPES;
var formEngineHelper = require('../helpers/formEngine');

/**
 * @api {GET} /api/1.0.0/forms/ Get all forms.
 * @apiGroup Forms
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object[]} Forms200All Success
 * @apiSuccess (200) {String} Forms200All._id Mongo _id
 * @apiSuccess (200) {String} Forms200All._v Current version
 * @apiSuccess (200) {String} Forms200All.uuid Form uuid
 * @apiSuccess (200) {Object} Forms200All.data Data
 * @apiSuccess (200) {Object} Forms200All.data.formReference Reference to form engine form
 * @apiSuccess (200) {String} Forms200All.data.formReference.name Form name
 * @apiSuccess (200) {String} Forms200All.data.formReference.description Description of the form (from form engine)
 * @apiSuccess (200) {String} Forms200All.data.formReference.lookupKey Key in the form engine
 * @apiSuccess (200) {String} Forms200All.data.formReference.version Version in the form engine
 * @apiSuccess (200) {String} Forms200All.data.formReference.content Content in JSON string format
 * @apiSuccess (200) {String} Forms200All.data.formReference.creation Creation date in form engine
 * @apiSuccess (200) {Object} Forms200All.meta Metadata
 * @apiSuccess (200) {Date} Forms200All.meta.created Created at
 * @apiSuccess (200) {Boolean} Forms200All.meta.deleted Deleted
 * @apiSuccess (200) {Boolean} Forms200All.meta.published Published
 * @apiSuccess (200) {Date} Forms200All.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Forms200All.meta.lastEditor Last edited by
 * @apiSuccess (200) {String} Forms200All.meta.label Label in CMS
 * @apiSuccess (200) {String} Forms200All.meta.description Description in CMS
 * @apiSuccess (200) {Object[]} Forms200All.versions Versions
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
 * @apiParam {String} uuid Form uuid
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Forms200Single Success
 * @apiSuccess (200) {String} Forms200Single._id Mongo _id
 * @apiSuccess (200) {String} Forms200Single._v Current version
 * @apiSuccess (200) {String} Forms200Single.uuid Form uuid
 * @apiSuccess (200) {Object} Forms200Single.data Data
 * @apiSuccess (200) {Object} Forms200Single.data.formReference Reference to form engine form
 * @apiSuccess (200) {String} Forms200Single.data.formReference.name Form name
 * @apiSuccess (200) {String} Forms200Single.data.formReference.description Description of the form (from form engine)
 * @apiSuccess (200) {String} Forms200Single.data.formReference.lookupKey Key in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.version Version in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.content Content in JSON string format
 * @apiSuccess (200) {String} Forms200Single.data.formReference.creation Creation date in form engine
 * @apiSuccess (200) {Object} Forms200Single.meta Metadata
 * @apiSuccess (200) {Date} Forms200Single.meta.created Created at
 * @apiSuccess (200) {Boolean} Forms200Single.meta.deleted Deleted
 * @apiSuccess (200) {Boolean} Forms200Single.meta.published Published
 * @apiSuccess (200) {Date} Forms200Single.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Forms200Single.meta.lastEditor Last edited by
 * @apiSuccess (200) {String} Forms200Single.meta.label Label in CMS
 * @apiSuccess (200) {String} Forms200Single.meta.description Description in CMS
 * @apiSuccess (200) {Object[]} Forms200Single.versions Versions
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
 * @apiSuccess (200) {Object} Forms200Single Success
 * @apiSuccess (200) {Object[]} Forms200Single.data Data
 * @apiSuccess (200) {String} Forms200Single.data.name Form name
 * @apiSuccess (200) {String} Forms200Single.data.lookupKey Key in the form engine
 * @apiSuccess (200) {Object} Forms200Single.data.data Reference to form engine form
 * @apiSuccess (200) {String} Forms200Single.data.data.name Form name
 * @apiSuccess (200) {String} Forms200Single.data.data.description Description of the form
 * @apiSuccess (200) {String} Forms200Single.data.data.lookupKey Key in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.data.version Version in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.data.content Content in JSON string format
 * @apiSuccess (200) {String} Forms200Single.data.data.creation Creation date in form engine
 *
 * @apiError (400) {Object} Error Bad request
 */
var getExternal = function(req, res, next) {
    // TODO: Get all forms from the form & survey engine here and return a modified version of it.

    formEngineHelper.getAllTemplates()
        .then(function onSuccess(templates) {
            templates.data = formEngineHelper.parseTemplateVersions(templates.data);
            return res.status(200).json(templates);
        }, function onError(err) {
            return res.status(500).json({
                msg: 'Could not get form templates from the form engine',
                err: err
            });
        });
};
module.exports.getExternal = getExternal;

var getResponses = function getResponses(req, res, next) {
    formEngineHelper.getResponses(req.params.lookupKey, req.params.version)
        .then(function onSuccess(responseData) {
            res.status(200).json(responseData);
        }, function onError(responseError) {
            res.status(500).json({err: responseError});
        });
};
module.exports.getResponses = getResponses;

var generateResponsesFile = function generateResponsesFile(req, res, next) {
    if(!req.params.lookupKey) {
        return res.status(412).json({
            msg: 'No lookupKey specified'
        });
    }

    if (!req.params.version) {
        return res.status(412).json({
            msg: 'No version specified'
        });
    }

    var data = [];

    var flatten = function flatten(obj, result, prefix) {
        _.forEach(obj, function(v, k) {
            if(typeof v === 'string') {
                result[(prefix || '') + k] = v;
            } else if(typeof v === 'object' || Array.isArray(v)) {
                prefix += (k || 'parent') + '.';
                flatten(v, result, prefix);
            }
        });

        return result;
    };

    var mapResponse = function mapResponse(type, data) {
        if(type === 'json') {
            return _.map(data.data, function(v, k) {
                if(typeof v.content === 'string'){
                    try {
                        v.content = JSON.parse(v.content);
                    } catch (ex) {}
                }

                return v.content;
            });
        }
        return _.map(data.data, function(v, k) {
            try {
                v.content = JSON.parse(v.content);
            } catch (ex) {}

            return flatten(v.content, {}, '');
        });
    };

    formEngineHelper.getResponses(req.params.lookupKey, req.params.version)
        .then(function onSuccess(responseData) {

            switch (req.query.format) {
                case 'xls':
                    data = mapResponse(req.query.format, responseData);
                    // Tell the browser to download this
                    res.setHeader('Content-disposition', 'attachment; filename=responses.xls');
                    res.setHeader('Content-type','application/vnd.ms-excel');

                    return res.end(Export.xls(data), 'binary');
                case 'csv':
                    data = mapResponse(req.query.format,responseData);
                    // Tell the browser to download this
                    res.setHeader('Content-disposition', 'attachment; filename=responses.csv');
                    res.setHeader('Content-type','text/csv');

                    return res.send(Export.csv(data));
                default:
                    data = mapResponse(req.query.format, responseData);
                    // Tell the browser to download this
                    res.setHeader('Content-disposition', 'attachment; filename=responses.json');
                    res.setHeader('Content-type','application/json');

                    return res.send({data: data});

            }
        }, function onError(responseError) {
            return res.status(500).json({err: responseError});
        });


};
module.exports.generateResponsesFile = generateResponsesFile;

/**
 * @api {PUT} /api/1.0.0/forms/:uuid/ Update a form.
 * @apiGroup Forms
 * @apiParam {String} uuid Form uuid
 *
 * @apiParam (body) {Object} FormsPUTBody Success
 * @apiParam (body) {String} FormsPUTBody._id Mongo _id
 * @apiParam (body) {String} FormsPUTBody._v Current version
 * @apiParam (body) {String} FormsPUTBody.uuid Form uuid
 * @apiParam (body) {Object} FormsPUTBody.data Data
 * @apiParam (body) {Object} FormsPUTBody.data.formReference Reference to form engine form
 * @apiParam (body) {String} FormsPUTBody.data.formReference.name Form name
 * @apiParam (body) {String} FormsPUTBody.data.formReference.description Description of the form (from form engine)
 * @apiParam (body) {String} FormsPUTBody.data.formReference.lookupKey Key in the form engine
 * @apiParam (body) {String} FormsPUTBody.data.formReference.version Version in the form engine
 * @apiParam (body) {String} FormsPUTBody.data.formReference.content Content in JSON string format
 * @apiParam (body) {String} FormsPUTBody.data.formReference.creation Creation date in form engine
 * @apiParam (body) {Object} FormsPUTBody.meta Metadata
 * @apiParam (body) {Date} FormsPUTBody.meta.created Created at
 * @apiParam (body) {Boolean} FormsPUTBody.meta.deleted Deleted
 * @apiParam (body) {Boolean} FormsPUTBody.meta.published Published
 * @apiParam (body) {Date} FormsPUTBody.meta.lastModified Last modified at
 * @apiParam (body) {String} FormsPUTBody.meta.lastEditor Last edited by
 * @apiParam (body) {String} FormsPUTBody.meta.label Label in CMS
 * @apiParam (body) {String} FormsPUTBody.meta.description Description in CMS
 * @apiParam (body) {Object[]} FormsPUTBody.versions Versions
 *
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Forms200Single Success
 * @apiSuccess (200) {String} Forms200Single._id Mongo _id
 * @apiSuccess (200) {String} Forms200Single._v Current version
 * @apiSuccess (200) {String} Forms200Single.uuid Form uuid
 * @apiSuccess (200) {Object} Forms200Single.data Data
 * @apiSuccess (200) {Object} Forms200Single.data.formReference Reference to form engine form
 * @apiSuccess (200) {String} Forms200Single.data.formReference.name Form name
 * @apiSuccess (200) {String} Forms200Single.data.formReference.description Description of the form (from form engine)
 * @apiSuccess (200) {String} Forms200Single.data.formReference.lookupKey Key in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.version Version in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.content Content in JSON string format
 * @apiSuccess (200) {String} Forms200Single.data.formReference.creation Creation date in form engine
 * @apiSuccess (200) {Object} Forms200Single.meta Metadata
 * @apiSuccess (200) {Date} Forms200Single.meta.created Created at
 * @apiSuccess (200) {Boolean} Forms200Single.meta.deleted Deleted
 * @apiSuccess (200) {Boolean} Forms200Single.meta.published Published
 * @apiSuccess (200) {Date} Forms200Single.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Forms200Single.meta.lastEditor Last edited by
 * @apiSuccess (200) {String} Forms200Single.meta.label Label in CMS
 * @apiSuccess (200) {String} Forms200Single.meta.description Description in CMS
 * @apiSuccess (200) {Object[]} Forms200Single.versions Versions
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
 *
 * @apiParam (body) {Object} FormsPUTBody Success
 * @apiParam (body) {String} FormsPUTBody._id Mongo _id
 * @apiParam (body) {String} FormsPUTBody._v Current version
 * @apiParam (body) {String} FormsPUTBody.uuid Form uuid
 * @apiParam (body) {Object} FormsPUTBody.data Data
 * @apiParam (body) {Object} FormsPUTBody.data.formReference Reference to form engine form
 * @apiParam (body) {String} FormsPUTBody.data.formReference.name Form name
 * @apiParam (body) {String} FormsPUTBody.data.formReference.description Description of the form (from form engine)
 * @apiParam (body) {String} FormsPUTBody.data.formReference.lookupKey Key in the form engine
 * @apiParam (body) {String} FormsPUTBody.data.formReference.version Version in the form engine
 * @apiParam (body) {String} FormsPUTBody.data.formReference.content Content in JSON string format
 * @apiParam (body) {String} FormsPUTBody.data.formReference.creation Creation date in form engine
 * @apiParam (body) {Object} FormsPUTBody.meta Metadata
 * @apiParam (body) {Date} FormsPUTBody.meta.created Created at
 * @apiParam (body) {Boolean} FormsPUTBody.meta.deleted Deleted
 * @apiParam (body) {Boolean} FormsPUTBody.meta.published Published
 * @apiParam (body) {Date} FormsPUTBody.meta.lastModified Last modified at
 * @apiParam (body) {String} FormsPUTBody.meta.lastEditor Last edited by
 * @apiParam (body) {String} FormsPUTBody.meta.label Label in CMS
 * @apiParam (body) {String} FormsPUTBody.meta.description Description in CMS
 * @apiParam (body) {Object[]} FormsPUTBody.versions Versions
 *
 * @apiVersion 1.0.0
 *
 * @apiSuccess (200) {Object} Forms200Single Success
 * @apiSuccess (200) {String} Forms200Single._id Mongo _id
 * @apiSuccess (200) {String} Forms200Single._v Current version
 * @apiSuccess (200) {String} Forms200Single.uuid Form uuid
 * @apiSuccess (200) {Object} Forms200Single.data Data
 * @apiSuccess (200) {Object} Forms200Single.data.formReference Reference to form engine form
 * @apiSuccess (200) {String} Forms200Single.data.formReference.name Form name
 * @apiSuccess (200) {String} Forms200Single.data.formReference.description Description of the form (from form engine)
 * @apiSuccess (200) {String} Forms200Single.data.formReference.lookupKey Key in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.version Version in the form engine
 * @apiSuccess (200) {String} Forms200Single.data.formReference.content Content in JSON string format
 * @apiSuccess (200) {String} Forms200Single.data.formReference.creation Creation date in form engine
 * @apiSuccess (200) {Object} Forms200Single.meta Metadata
 * @apiSuccess (200) {Date} Forms200Single.meta.created Created at
 * @apiSuccess (200) {Boolean} Forms200Single.meta.deleted Deleted
 * @apiSuccess (200) {Boolean} Forms200Single.meta.published Published
 * @apiSuccess (200) {Date} Forms200Single.meta.lastModified Last modified at
 * @apiSuccess (200) {String} Forms200Single.meta.lastEditor Last edited by
 * @apiSuccess (200) {String} Forms200Single.meta.label Label in CMS
 * @apiSuccess (200) {String} Forms200Single.meta.description Description in CMS
 * @apiSuccess (200) {Object[]} Forms200Single.versions Versions
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
 * @apiGroup Forms
 * @apiVersion 1.0.0
 *
 * @apiSuccess (204) Forms204Delete No content
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
