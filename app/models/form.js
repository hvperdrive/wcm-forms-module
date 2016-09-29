'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');

delete mongoose.models.Forms;
delete mongoose.modelSchemas.Forms;
var FormSchema = new Schema({
    uuid: {
        type: String,
        default: uuid,
        required: true
    },
    data: {
        // These values will come from the form & survey engine
        formReference: {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            lookupKey: {
                type: String,
                required: true
            },
            version: {
                type: String,
                required: true
            },
            creation: {
                type: Date,
                required: true
            }
        }
    },
    meta: {
        published: {},
        publishDate: {},
        label: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        lastModified: {
            type: Date,
            required: true,
            default: Date.now
        },
        lastEditor: {
            type: String,
            ref: 'User'
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    versions: []
}, {
    strict: false
});

// Set the name of the collection
FormSchema.set('collection', 'forms');
module.exports = mongoose.model('Forms', FormSchema);
