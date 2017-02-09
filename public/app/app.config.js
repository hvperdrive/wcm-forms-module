'use strict';

angular.module('forms_0.1.0')
    .config([

        'fieldGeneratorProvider',

        function(fieldGeneratorProvider) {
            // Register custom fields (eg. form field);
            fieldGeneratorProvider.registerCustomFields();
        }
    ]);
