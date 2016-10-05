'use strict';

angular.module('forms_0.0.2.controllers')
    .controller('formsDetailController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$templateCache',
        '$filter',
        '$window',
        'uuid4',

        // Services
        'LabelService',
        'configuration',

        // Factories
        'formsFactory',

        // Resolves
        'InstanceData',
        'ExternalForms',

        function($scope, $rootScope, $controller, $templateCache, $filter, $window, uuid4, LabelService, configuration, formsFactory, InstanceData, ExternalForms) {

            // Referencing the required factory
            $scope._factory = formsFactory;

            // Extend the default resource controller
            angular.extend(this, $controller('ResourceController', {$scope: $scope, InstanceData: InstanceData, Languages: []}));

            // ResourceView configuration
            $scope.context.type = LabelService.getString('Form'); // Set the current type to "Consumer"
            // Get server path for asset.
            $scope.serverPath = configuration.serverPath;

            $scope.form = null;
            $scope.options = ExternalForms.data;
            $scope.exportModel = null;

            if($scope.itemData && $scope.itemData.data && $scope.itemData.data.formReference && $scope.itemData.data.formReference.lookupKey) {
                $scope.form = _.find(ExternalForms.data, {lookupKey: $scope.itemData.data.formReference.lookupKey});
            }

            $scope.generateResponseFile = function generateResponseFile(type, model) {
                if(!model || !model.version) {
                    return false;
                }
                var baseURl = configuration.serverPath + configuration.apiPrefix + configuration.apiLevel;
                var path = 'forms/export/';
                var params = model.lookupKey + '/' + model.version;
                var query = '?format=' + type || 'json';

                $window.open(baseURl + path + params + query, '_blank');
            };

            //
            // OPTIONS
            //

            $scope.publishedOptions = [{
                key: 'published',
                label: LabelService.getString('Published')
            }];

            // $scope events
            $scope.$on('$destroy', function() {
                $scope._newInstance = undefined;
                $scope._instance = undefined;
            });
        }
    ]);
