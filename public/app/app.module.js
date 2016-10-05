'use strict';

angular.module('forms_0.0.2.directives', []);
angular.module('forms_0.0.2.factories', []);
angular.module('forms_0.0.2.services', ['forms_0.0.2.factories']);
angular.module('forms_0.0.2.controllers', ['forms_0.0.2.services']);

angular.module('forms_0.0.2', [

    'pelorus.services',

    'forms_0.0.2.directives',
    'forms_0.0.2.factories',
    'forms_0.0.2.services',
    'forms_0.0.2.controllers'

    ])
    .run([function() {
        console.log('Forms module is available!');
    }]);
