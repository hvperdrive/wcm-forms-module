'use strict';

angular.module('forms_0.1.0.directives')
    .directive('formField', [

        'formsConfig',
        'formsFactory',

        function(formsConfig, formsFactory) {
            return {
                restrict: 'E',
                templateUrl: formsConfig.modulePath + 'directives/fields/form-field/form-field.html',
                replace: true,
                scope: {
                    label: '@',
                    secondaryLabel: '@?',
                    name: '@',
                    model: '=',

                    // Validation
                    fieldData: '=',

                    id: '@?',
                    group: '@?',

                    // Validation
                    required: '=',
                    placeholder: '=?',
                    disabled: '=?'
                },
                link: function($scope, element, attr) {
                    $scope.settings = {
                        qlabel: 'meta.label',
                        track: null,
                        options: [],
                        id: 'uuid',
                        placeholder: 'Select a form'
                    };

                    var init = function init() {
                        formsFactory.query().$promise
                            .then(function(forms) {
                                $scope.settings.options = forms;
                            });
                    };

                    init();
                }
            };
        }
    ]);
