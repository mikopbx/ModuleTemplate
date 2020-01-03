<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2019
*/

namespace Modules\ModuleTemplate\Lib;

use ConfigClass;
use System;
use Util;

class Template extends ConfigClass {

    private $module_name='ModuleTemplate';
    private $module_dir;

    /**
     * Настройки для текущего класса.
     */
    public function getSettings(){
        $modulesDir = $GLOBALS['g']['phalcon_settings']['application']['modulesDir'];
        $this->module_dir   = $modulesDir.$this->module_name;
    }

    /**
     * Добавление задач в crond.
     * @param $tasks
     */
    public function create_cron_tasks(& $tasks){
        if(!is_array($tasks)){
            return;
        }
        $path_to_safe = "{$this->module_dir}/bin/safe_script.php";
        $tasks[] = "*/1 * * * * /usr/bin/php -f {$path_to_safe} > /dev/null 2> /dev/null\n";
    }

    /**
     * Генерация конфига, рестарт работы модуля.
     */
    public function reload_services(){
        System::invoke_actions(['cron' => 0]);
        $path_to_safe = "{$this->module_dir}/bin/safe_script.php";
        Util::mwexec("/usr/bin/php -f {$path_to_safe}");
        return true;
    }
}