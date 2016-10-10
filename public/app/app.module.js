'use strict';

angular.module('forms_0.0.3.directives', []);
angular.module('forms_0.0.3.factories', []);
angular.module('forms_0.0.3.services', ['forms_0.0.3.factories']);
angular.module('forms_0.0.3.controllers', ['forms_0.0.3.services']);

angular.module('forms_0.0.3', [

    'pelorus.services',

    'forms_0.0.3.directives',
    'forms_0.0.3.factories',
    'forms_0.0.3.services',
    'forms_0.0.3.controllers'

    ])
    .run([function() {
        console.log('Forms module is available!');
    }]);
