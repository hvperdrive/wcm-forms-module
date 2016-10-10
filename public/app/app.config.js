'use strict';

angular.module('forms_0.0.3')
    .config([

        'fieldGeneratorProvider',

        function(fieldGeneratorProvider) {
            // Register custom fields (eg. form field);
            fieldGeneratorProvider.registerCustomFields();
        }
    ]);
