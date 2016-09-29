angular.module('forms_0.0.1.factories')
    .factory('formsFactory', [

        '$resource',
        'configuration',

        function feTenantsFactory($resource, configuration) {

            var api = configuration.serverPath + configuration.apiPrefix + configuration.apiLevel;
            var factory = {};

            factory = $resource(api + 'forms/:listController:id/:docController', {
                id: '@uuid',
                listController: '@listController',
                docController: '@docController'
            }, {
                update: {
                    method: 'PUT'
                },
                getExternal: {
                    method: 'GET',
                    params: {
                        listController: 'external'
                    }
                }
            });

            return factory;
        }
    ]);
