'use strict';

angular.module('forms_0.0.1')
    .config([

        '$stateProvider',
        'formsConfigProvider',

        function($stateProvider, formsConfigProvider) {

            var moduleFolder = 'app/modules/' + formsConfigProvider.API.name + '_' + formsConfigProvider.API.version + '/';

            $stateProvider

            .state('pelorus.forms.index', {
                url: '',
                access: {
                    requiresLogin: true
                },
                resolve: {
                    ListData: ['formsFactory', function(consumersFactory) {
                        return consumersFactory.query().$promise;
                    }]
                },
                ncyBreadcrumb: {
                    label: '{{breadcrumb}}'
                },
                views: {
                    '': {
                        templateUrl: moduleFolder + 'views/overview.html',
                        controller: 'formsOverviewController'
                    }
                }
            })

            .state('pelorus.forms.edit', {
                url: '/{uuid}',
                access: {
                    requiresLogin: true
                },
                resolve: {
                    InstanceData: ['formsFactory', '$stateParams', function(consumersFactory, $stateParams) {
                        if ($stateParams.uuid && $stateParams.uuid !== 'new') {
                            return consumersFactory.get({id: $stateParams.uuid}).$promise;
                        } else {
                            return {};
                        }
                    }],
                    ExternalForms: ['formsFactory', function(formsFactory) {
                        return formsFactory.getExternal().$promise;
                    }]
                },
                ncyBreadcrumb: {
                    label: '{{breadcrumb}}'
                },
                views: {
                    '': {
                        templateUrl: '/app/core/resource/views/resource.html',
                        controller: 'formsDetailController'
                    },
                    'form@pelorus.forms.edit': {
                        templateUrl: moduleFolder + 'views/detail.html',
                    }
                }
            });
        }

    ]);
