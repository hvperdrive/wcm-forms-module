"use strict";

angular.module("forms_1.0.0.directives", []);
angular.module("forms_1.0.0.factories", []);
angular.module("forms_1.0.0.services", ["forms_1.0.0.factories"]);
angular.module("forms_1.0.0.controllers", ["forms_1.0.0.services"]);

angular.module("forms_1.0.0", [

	"pelorus.services",

	"forms_1.0.0.directives",
	"forms_1.0.0.factories",
	"forms_1.0.0.services",
	"forms_1.0.0.controllers",

])
	.run([function() {
		console.log("Forms module is available!");
	}]);
