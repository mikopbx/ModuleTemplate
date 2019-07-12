<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 11 2018
 */

namespace Modules\ModuleTemplate\Lib;
use Config;
use ConfigClass;
use Modules\ModuleTemplate\Models\ModuleTemplate;
use Util;

require_once 'globals.php';

class Template extends ConfigClass{

    /** @var \Config */
    private $config;
    private $path_to_log = '';
    private $module_name = 'ModuleTemplate';
    private $module_dir     = '';
    private $bin_dir     = '';
    /** @var \Modules\ModuleTemplate\Models\ModuleTemplate $module_settings */
    private $module_settings = null;

    public function getSettings(){
        $this->config       = new Config();
        $this->path_to_log  = Util::get_log_dir();
        $modulesDir = $GLOBALS['g']['phalcon_settings']['application']['modulesDir'];

        $this->module_dir   = $modulesDir.$this->module_name;
        $this->bin_dir      = $modulesDir.$this->module_name."/bin";

        $path_class  = "\\Modules\\{$this->module_name}\\Models\\{$this->module_name}";
        // Получим настройки подключения к 1С.
        if(class_exists($path_class)){
            $this->module_settings = ModuleTemplate::findFirst();
        }

    }

    /**
     * Генерация конфига, рестарт работы модуля.
     * Метод вызывается после рестарта NATS сервера.
     */
    public function on_nats_reload(){
        $this->reload_services();
    }

    /**
     * Генерация конфига, рестарт работы модуля.
     */
    public function reload_services(){

        return true;
    }

    /**
     * Будет вызван после старта asterisk.
     */
    public function on_after_pbx_started(){

    }

    /**
     * Добавление задач в crond.
     * @param $tasks
     */
    public function create_cron_tasks(& $tasks){
        if(!is_array($tasks)){
            return;
        }
        $path_to_log  = "{$this->module_dir}/Lib/logrotate.php";
        $path_to_safe = "{$this->module_dir}/Lib/safe_script.php";
        $tasks[] = "*/30 * * * * /usr/bin/php -f {$path_to_log} > /dev/null 2> /dev/null\n";
        $tasks[] = "*/3 * * * * /usr/bin/php -f {$path_to_safe} > /dev/null 2> /dev/null\n";
    }

}