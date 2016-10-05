'use strict';

angular.module('forms_0.0.2')
    .provider('formsConfig', [
        function formsConfig() {

            this.API = {
                name: 'forms',
                version: '0.0.2',
                basePath: 'app/modules/'
            };

            this.API.modulePath = this.API.basePath + this.API.name + '_' + this.API.version + '/';

            this.$get = function get() {
                return this.API;
            };
        }
    ]);
