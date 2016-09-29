'use strict';

angular.module('forms_0.0.1')
    .controller('formsDetailController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$templateCache',
        '$filter',
        'uuid4',

        // Services
        'LabelService',
        'configuration',

        // Factories
        'formsFactory',

        // Resolves
        'InstanceData',
        'ExternalForms',

        function($scope, $rootScope, $controller, $templateCache, $filter, uuid4, LabelService, configuration, consumersFactory, InstanceData, ExternalForms) {

            // Referencing the required factory
            $scope._factory = consumersFactory;

            // Extend the default resource controller
            angular.extend(this, $controller('ResourceController', {$scope: $scope, InstanceData: InstanceData, Languages: []}));

            // ResourceView configuration
            $scope.context.type = LabelService.getString('Form'); // Set the current type to "Consumer"
            // Get server path for asset.
            $scope.serverPath = configuration.serverPath;

            $scope.publishedOptions = [{
                key: 'published',
                label: LabelService.getString('Published')
            }];

            $scope.data = {
                externalForms: ExternalForms.data
            };

            //
            // HIDE/SHOW
            //

            //
            // NEW FIELD
            //

            //
            // EDIT FIELD
            //

            //
            // SAVE FIELD
            //

            //
            // DELETE FIELD
            //

            //
            // OPTIONS
            //

            //
            // SUBMIT FORM
            //

            //
            // CUSTOM VALIDATIONS
            //

            //
            // CUSTOM FILTERS
            //

            // $scope events
            $scope.$on('$destroy', function() {
                $scope._newInstance = undefined;
                $scope._instance = undefined;
            });
        }
    ]);
