'use strict';

angular.module('forms_0.0.1')
    .provider('formsConfig', [
        function formsConfig() {
            var API = {};

            API.name = 'forms',
            API.version = '0.0.1';

            this.API = API;

            this.$get = function get() {
                return this.API;
            };
        }
    ]);
