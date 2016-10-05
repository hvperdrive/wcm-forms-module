'use strict';

var Q = require('q');
var FormModel = require('../models/form');

var populate = function populate(value) {
    if(!value) {
        return Q.reject('No value specified');
    }

    var d = Q.defer();

    FormModel.findOne({uuid: value, 'meta.deleted': false})
        .lean()
        .exec()
        .then(
            function onSuccess(form) {
                if(form && form.data && form.data.formReference) {
                    d.resolve(form.data.formReference);
                } else {
                    d.resolve(null);
                }
            },
            function onError(err) {
                d.reject(err);
            }
        );

    return d.promise;
};
module.exports.populate = populate;
