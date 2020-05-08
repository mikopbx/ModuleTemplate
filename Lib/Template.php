<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2019
*/

namespace Modules\ModuleTemplate\Lib;

use ConfigClass;
use MikoPBX\Core\System\System;
use MikoPBX\Core\System\Util;

class Template extends ConfigClass {

    private $module_name='ModuleTemplate';
    private $module_dir;

    /**
     * Настройки для текущего класса.
     */
    public function getSettings(){
        $modulesDir = $this->di->getConfig()->path('core.modulesDir');
        $this->module_dir   = $modulesDir.$this->module_name;
    }

    /**
     * Добавление задач в crond.
     * @param $tasks
     */
    public function createCronTasks(& $tasks){
        if(!is_array($tasks)){
            return;
        }
        $path_to_safe = "{$this->module_dir}/bin/safe_script.php";
        $tasks[] = "*/1 * * * * /usr/bin/php -f {$path_to_safe} > /dev/null 2> /dev/null\n";
    }

    /**
     * Генерация конфига, рестарт работы модуля.
     */
    public function reloadServices(){
        System::invokeActions(['cron' => 0]);
        $path_to_safe = "{$this->module_dir}/bin/safe_script.php";
        Util::mwExec("/usr/bin/php -f {$path_to_safe}");
        return true;
    }
}