# MikoPBX extension module template #

*Read this in other languages: [English](README.md), [Русский](README.ru.md).*

## Module description ##

The template new extension for MikoPBX. The extension has web UI, with JS, CSS and PHP classes and database.

## Folder structure ##

In folder **app** we place MVC part of project according to [Phalcon app Structure](https://docs.phalcon.io/3.4/en/tutorial-basic#file-structure)  

In folder **bin** we place binary executable files

In folder **coreapi** REST API classes

In folder **db** takes place module database created automatically according to ORM Models annotations

In folder **Lib** we place main program classes

In folder **messages** we place translation files, like ru.php, en.php ...

In folder **Models** we describe ORM models according to [Phalcon app Structure](https://docs.phalcon.io/3.4/en/db-models) 

In folder **public** we place public accessible files, i.e. js, css, images  

In folder **setup** we place install and uninstall classes, and additional firewall rules 

### Prepare template ###
1. Make new repository and clone your's new one to Phpstorm project
2. Make group rename in folder:
 * `ModuleTemplate` to new unique module ID, i.e. `MyCompanyMyNewModule4PBX`
 * `mod_tpl_` to `MyCompanyMod4PBX_tpl`
 * `module-template` to `my-company-module-4-pbx`
3. Change filename of controller class in folder `app/controllers` from `ModuleTemplateController.php` to `MyCompanyMyNewModule4PBXController.php` 
4. Change filename of form class in folder `app/forms` from `ModuleTemplateForm.php` to `MyCompanyMyNewModule4PBXForm.php` 
5. Rename and edit classes in `Models` folder for future database according to [Phalcon app Structure](https://docs.phalcon.io/3.4/en/db-models) and [Phalcon models annotations](https://docs.phalcon.io/3.4/en/db-models-metadata#annotations-strategy)
6. Rename JS и CSS files in folder `public/src` from `my-company-module-4-pbx-index.js` to `my-company-module-4-pbx.css`
7. If your future module has to open any firewall ports, describe it at `setup/FirewallRules.php` or just delete this file, if you don't need it.
8. Modify `setup/PbxExtensionSetup.php`, change module unique ID, developer, version information and update/add function to correct install future module.
 

### File PbxExtensionSetup.php ###
This file must have at least one function **__construct()**
Another function you can inherit or reorder from paren class [PbxExtensionBase](https://github.com/mikopbx/core/blob/master/www/back-end/modules/PbxExtensionBase.php)
  
### ORM Models classes ###
You must use namespace like  `Modules\<ModuleUniqueID>\Models`.  Every have to extend **ModuleBaseClass** 
In class **ModuleBaseClass** you have to have method **getRepresent()**

### Controllers classes ###
At every controller public method you must pick to module view file template
`$this->view->pick( "{$modulesDir}/<ModuleUniqueID>/app/views/index" );`

### Translations ###
Your module have to has en.php with at least 2 translation phrases:
	* Breadcrumb<ModuleUniqueID> - Your module name
	* SubHeader<ModuleUniqueID> - Your module description for subheader
	
		
### Useful links ###
Before create new module you should read some docs:

* [Semntic UI](https://semantic-ui.com)
* [Phalcon PHP framework](https://docs.phalcon.io/3.4/en/introduction)
* [MikoPBX Wiki](https://wiki.mikopbx.com)
* [Asterisk Wiki](https://wiki.asterisk.org/wiki/display/AST/Home)

Code style guides:

* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [PSR-1: Basic Coding Standard](https://www.php-fig.org/psr/psr-1/)

### Questions ###
You are welcome to our telegram channel for developers [@mikopbx_dev](https://t.me/joinchat/AAPn5xSqZIpQnNnCAa3bBw)