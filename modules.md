# Modules

## Some context

Modules are functional pieces that serve a specific purpose. Modules can however depend on each other.

A module can (but don't necessarily have to) contain the following things:

- Frontend angular code
- Frontend assets
- Backend code

There are two types of modules. Internal and external modules.

## Internal modules

Internal modules are modules that are not managed by the dynamic module system. They are considered core modules that can't be removed or changed.

However, they have a similar structure and use the same database model to define there configuration.

The modules are defined in the WCM database. You can update them in the modules fixtures or in the database itself.

## External Modules

External modules are modules that are managed by the dynamic module system. They can be uploaded, disabled, enabled, updated and removed.

## Creating an external module

### Setup

The module contains a package.json file and has up to three folders that don't overlap:

#### Folder structure

The module needs to be zipped and have the following folder structure so it can be uploaded and handled by the dynamic module system. Not all subfolders are required.

- Parent folder with the name '[module name]&#95;[module version]'.
    - A backend folder
        - Routings folder with routes/entry points
        - fixtures (optional)
        - files required by entry points or fixtures
    - A frontend folder
        - A javascript file that initializes an angular module
    - An assets folder
    - package.json file that contains the module configuration

#### package.json

The package.json is a normal package.json file but contains the following additional properties in the root of the JSON file.
These properties are used to inject the module code correctly into our system.

```json
{    
  "wcmModule": {
    "frontend": {
      "dirPath": "Relative path to frontend angular folder",
      "assetsDirPath": "Relative path to assets folder",
      "moduleConfig": {
        "translationKey": "Translation key",
        "operationType": "Operation type",
        "icon": "font-awesome icon name",
        "type": "navigation type",
        "navigationItem": true,
        "authentication": {
            "requiresLogin": true
        }
      }
    },
    "backend": {
      "dirPath": "Relative path to backend directory (defaults to app/ when backend object is truthy in the package.json file)",
      "routeDirPaths": ["Route folder paths (defaults to app/routes/ when backend object is truthy in the package.json file)"]
    }
  }
}
```

It is important to note that the npm scripts 'fixtures', 'migrations' and 'onRemove' will be executed in the dynamic module system upload and removal flow when they are defined. You can find out more about the upload and download flow below.

<b>Let's go over every property one by one</b>:
<table>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>"frontend"</td>
        <td>
            The frontend property contains all the configuration of the frontend. The dynamic module systems will try to build the frontend when this property is truthy.
        </td>
    </tr>
    <tr>
        <td>"frontend.dirPath"</td>
        <td>
            The relative path to the frontend angular folder (defaults to 'public/app/').<br/>
            The contents of this folder will be copied internally to 'public/app/modules/[module_version]&#95;[module version]/' on upload.
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig"</td>
        <td>
            Contains all the information needed to include the modules frontend into the WCM its frontend.
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig.translationKey"</td>
        <td>
            This key is used as label for the menu item. It is also the key for the translations in the .po files.
        </td>
    </tr>    
    <tr>
        <td>"frontend.moduleConfig.operationType"</td>
        <td>
            The operation key corresponds with the roles operation type. This key is needed if you only want this menu item to be visible when one of the users roles has the operation permissions. The menu item will always be visible if no operation key is specified or if the authentication 'requiresLogin' is false or not specified.
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig.icon"</td>
        <td>
            The font-awesome icon name. It will prefix the label in the generated menu item. <br/>
            Notice: You only need to include the name not the class. It will render like this 'fa fa-[your icon name]'.<br/><br/>

            The list of icons can be fount here: http://fontawesome.io/icons/.
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig.type"</td>
        <td>
            Specifies in which category the menu item needs to be sorted.
            These are the options: ["none", "content", "structure", "system", "other"]
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig.navigationItem"</td>
        <td>
            Show the module in the navigation or not.
        </td>
    </tr>
    <tr>
        <td>"frontend.moduleConfig.authentication.requiresLogin"</td>
        <td>
            Make the router state check if the user is logged in and if the user has correct rights before displaying the menu item and it's contents.
        </td>
    </tr>
    <tr>
        <td>"frontend.assetsDirPath"</td>
        <td>
            The relative path of the assets folder. The contents of the folder will be copied internally to 'public/assets/[module name]&#95;[module version]/' and can be accessed by going to "assets/[module name]&#95;[module version]/[Your asset path]".
        </td>
    </tr>
    <tr>
        <td>"backend"</td>
        <td>
            The backend property contains all the configuration of the backend. The dynamic module system will try to build the backend when this property is truthy.
        </td>
    </tr>
    <tr>
        <td>"backend.dirPath"</td>
        <td>
            The relative path to the backend folder (defaults to 'app/').<br/>
            This folder (not just the contents but also the folder itself) will be copied internally to 'app/modules/modules/[module name]&#95;[module version]/' on upload.
        </td>
    </tr>
    <tr>
        <td>"backend.routePaths"</td>
        <td>
            An array containing relative paths to the routes folder. All the files in these folders will be required on upload or activation of the module.
        </td>
    </tr>
</table>

### Backend

As mentioned previously, the backend needs to be located in one folder and needs to have a at least one folder with \*.js files that are all entry points as defined in the package.json file.

Every entry point will internally be called like so "require([path to entry file])(app, hooks)". The app parameter contains the current express app.
The hooks object contains properties that you can use to hook into the dynamic module system workflow.

This means that the entry point needs to contain "module.exports = function(app, hooks){...}" in order to be able to run.

An example route file:

```javascript
'use strict';

require('rootpath')();
// Get the configuration of the WCM
var config = require('config')();
// This is a helper middleware function to check if the user is logged in
var ProfileSecurity = require('app/helpers/modules/lib').ProfileSecurity;
// This is a helper middleware function to specify which method is used. This will be used in the PermissionsSecurity function.
// There are four methods available: read, create, update and delete.
var MethodSecurity = require('app/helpers/modules/lib').MethodSecurity;
// This is a helper middleware function generator that returns a middleware function that can be injected into route as seen below.
// The function will check if the user has the right permissions to execute this action.
// You need to specify the operation type that needs to be checked against (In this case 'example').
var PermissionsSecurity = require('app/helpers/modules/lib').PermissionsSecurity('example');
// Building the baseUrl based on the configuration. Every API call needs to be located after the "/[config.api.prefix][config.api.version]" route
var baseUrl = '/' + config.api.prefix + config.api.version + 'example';
module.exports = function(app, hooks) {
    // Get all examples
    app.route(baseUrl).get(ProfileSecurity,
        MethodSecurity.read,
        PermissionsSecurity,
        function(req, res, next) {
        res.status(200).json({
            message: 'This is a example output.'
        })
    });

    hooks.onLoadComplete = function() {
        console.log('onLoadComplete');
    };

    hooks.beforeRemove = function() {
        console.log('beforeRemove');
    };

    hooks.onRemoved = function() {
        console.log('onRemoved');
    };

    hooks.beforeEnable = function() {
        console.log('beforeEnable');
    };

    hooks.onEnabled = function() {
        console.log('onEnabled');
    };

    hooks.beforeDisable = function() {
        console.log('beforeDisable');
    };

    hooks.onDisabled = function() {
        console.log('onDisabled');
    };
};
```

#### Some important notes!

##### General

- The dynamic module system does not wait for the hooks to be completed if they contain async functionality.
- Routes are disabled by the dynamic module system but other code that is not coupled to routes, will not be removed. You can use the hooks to manually disable other code that may keep running after the routes are disabled. Doing this will prevent weird behavior of the WCM.

##### Routes

- The routes need to be defined immediately (eg. not in a callback or in a hook).
- The routes need to be behind the "/[config.api.prefix][config.api.version]" path.
- The routes will be inserted at the end of the router stack. This means that the internal routes have precedence over the external module routes.

##### Schema definitions

The module needs to first remove the schema from mongoose before generating one.
It will not work properly when uploading or reuploading the module that defines a schema with the same name of a schema that is already defined.
This action will overwrite the schema. This can break other modules (both internal or external), so be carefull!

In order to do this, just include the following code before registering a mongoose schema:

```javascript
var mongoose = require('mongoose');

delete mongoose.models.["Schema name"];
delete mongoose.modelSchemas["Schema name"];
```

### Frontend

The frontend needs to be located in one folder as defined in the package.json file. It also needs to contain a \*.js file that creates an angular module with the following name: "[module name]&#95;[module version]". This module will be included as a dependency of the "pelorus.externals" module. "pelorus.externals" is in turn included in the main 'pelorus' module (the main angular module of the WCM).

#### Module dependencies

External libraries have to be included in the frontend folder. These files will like every other file in the frontend module folder be referenced in the index.html file of the WCM.

#### Some important notes!

##### Module naming

The frontend angular modules needs to be named like below:

```javascript
angular.module('[module name]_[module version].[your other module 1]', []);
angular.module('[module name]_[module version].[you other module 2]', []);
angular.module('[module name]_[module version]', [
    '[module name]_[module version].[your other module 1]',
    '[module name]_[module version].[you other module 2]',
]);
```
The name and version are both defined in you package.json file.

### Startup, upload, enable, disable and removal flow

#### Startup flow

The routes of the activated modules will be loaded after everything else. This means that they will be last in the router stack and that the internal modules have precedence over the modules routes. External routes are inserted one by one on startup. There is no guarantee of the order in which they are included.

#### Upload flow

1. The zip file will be unzipped into a temporary folder.
2. The package.json file will be read and checked.
3. The module is checked for conflicts (eg. name and version of the package).
4. <b>Backend files together with the package.json file are copied to a dedicated module folder.</b>
5. <b>Install npm dependencies</b>
6. <b>Include module entry points.</b>
7. <b>Execute fixtures and migrations script in sequence.</b>
8. <b>Copy Frontend and assets folder in dedicated module folders.</b>
9. <b>Insert references to the module frontend files into the index.html file.</b>
10. Backup .zip file.
11. Remove temporary files.
12. Save all relevant data to the database.
13. <b>Include operation permissions.</b>
14. <b>The 'onLoadComplete' hook is called.</b>

#### Removal flow

1. <b>The 'beforeRemove' hook is called.</b>
2. Removing frontend files.
3. Remove \*.js file references of the module.
4. <b>Remove active module routes.</b>
6. Remove backend module foldername.
7. Remove operation permissions.
8. Remove data from the server.
9. Remove backup zip.
10. <b>The 'onRemoved' hook is called.</b>

#### Enable flow

1. <b>The 'beforeEnable' hook is called.</b>
2. Remove module routes (to prevent double loading of routes).
3. Include module entry points.
4. Include frontend references into the index.html file of the WCM.
5. <b>The 'onEnabled' hook is called.</b>

#### Disable flow

1. <b>The 'beforeDisable' hook is called.</b>
2. Remove module routes.
3. Remove the frontend references from the index.html file of the WCM.
4. <b>The 'onDisabled' hook is called.</b>

# Changelogs (modules)

### [1.2.0] - 31/08/2016

#### Changed
- The module its angular main module name can't be defined separately anymore. We removed this to enable multiple version support over multiple tenants. Now it will always be: "[module name]&#95;[module version]".
- Added operation permissions helper functions.
- Fixed documentation typos.
- Added the "moduleConfig.authentication" option. This was already supported but not included in the documentation above.

### [1.2.1] - 28/08/2016
First version of the Dynamic module system.
