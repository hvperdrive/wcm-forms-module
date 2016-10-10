'use strict';

var _ = require('lodash');
var Q = require('q');
var FormModel = require('../models/form');

var populate = function populate(value) {
    if(!value) {
        return Q.reject('No value specified');
    }

    var isMultiple = true;

    // Check if value does not come from a multiple field.
    if(!Array.isArray(value)) {
        isMultiple = false;
        value = [value];
    } else {
        value = _.map(value, 'value');
    }

    var d = Q.defer();

    FormModel.find({uuid: {$in: value}, 'meta.deleted': false})
        .lean()
        .exec()
        .then(
            function onSuccess(forms) {
                var result = _(forms)
                    .map(
                        function(f) {
                            if(f && f.data && f.data.formReference) {
                                return f.data.formReference;
                            }

                            return undefined;
                        }
                    )
                    .filter(
                        function(form) {
                            return !!form;
                        }
                    )
                    .value();

                if(!isMultiple) {
                    return d.resolve(result[0]);
                }

                return d.resolve(result);

            },
            function onError(err) {
                d.reject(err);
            }
        );

    return d.promise;
};
module.exports.populate = populate;
