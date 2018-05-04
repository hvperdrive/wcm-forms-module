var formRoutes = require("./routes/form");
var formEngine = require("./helpers/formEngine");

module.exports = function(app, hooks, info) {
	formEngine.set(info);

	hooks.onRemoved = function() {
		delete require.cache[require.resolve("../controllers/form")];
		delete require.cache[require.resolve("../helpers/requestHooks")];
	};

	formRoutes(app);
};
