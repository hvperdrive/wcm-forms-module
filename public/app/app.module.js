'use strict';

angular.module('forms_0.0.1.factories', []);
angular.module('forms_0.0.1', [
    'forms_0.0.1.factories'
    ])
    .run([function() {
        console.log('Forms module is starting...!');
    }]);
