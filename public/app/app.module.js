'use strict';

angular.module('forms_0.1.0.directives', []);
angular.module('forms_0.1.0.factories', []);
angular.module('forms_0.1.0.services', ['forms_0.1.0.factories']);
angular.module('forms_0.1.0.controllers', ['forms_0.1.0.services']);

angular.module('forms_0.1.0', [

    'pelorus.services',

    'forms_0.1.0.directives',
    'forms_0.1.0.factories',
    'forms_0.1.0.services',
    'forms_0.1.0.controllers'

    ])
    .run([function() {
        console.log('Forms module is available!');
    }]);
