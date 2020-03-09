angular.module("forms_1.0.0.factories")
	.factory("formsFactory", [

		"$resource",
		"configuration",

		function feTenantsFactory($resource, configuration) {

			var api = configuration.serverPath + configuration.apiPrefix + configuration.apiLevel;
			var factory = {};

			factory = $resource(api + "forms/:listController:id/:docController", {
				id: "@uuid",
				listController: "@listController",
				docController: "@docController",
			}, {
				update: {
					method: "PUT",
				},
				getExternal: {
					method: "GET",
					params: {
						listController: "external",
					},
				},
				getResponses: {
					method: "GET",
					params: {
						listController: "responses",
					},
				},
				generateResponseFile: {
					method: "GET",
					params: {
						listController: "export",
						format: "json",
					},
				},
			});

			return factory;
		},
	]);
