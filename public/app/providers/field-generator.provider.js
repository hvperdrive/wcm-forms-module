'use strict';

angular.module('forms_0.1.0')
    .provider('fieldGenerator', [

        '$provide',
        'formsConfigProvider',

        function fieldTypeGenerator($provide, formsConfigProvider) {
            var customFields = [
                {
                    key: 'form-select',
                    url: formsConfigProvider.API.modulePath + 'public/app/directives/fields/form-field/form-field.template.html'
                }
            ];

            this.registerCustomFields = function registerCustomFields() {
                $provide.decorator('FieldService', [

                    '$delegate',

                    function(fieldService) {
                        _.forEach(customFields, function (cf) {
                            fieldService.registerFieldTemplate(cf.key, cf.url, cf.content);
                        });

                        return fieldService;
                    }
                ]);
            };

            this.$get = function get() {
                return this.API;
            };
        }
    ]);
