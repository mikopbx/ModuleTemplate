<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2018
 */

namespace Modules\ModuleTemplate\bin;

use Exception;
use Models\PbxExtensionModules;
use Util;

require_once 'globals.php';

class Checker {
    private $result  = false;
    private $message = false;
    private $g;

    /**
     * Checker constructor.
     * @param $g
     * @throws \Exception
     */
    function __construct($g){
        $this->g = &$g;
    }

    public function callback($message) {
        $this->result = true;
        $this->message = $message;
    }

    /**
     * Проверка работы AMI листнера.
     * @param $name  - имя сервиса
     * @param $level - уровень рекурсии
     */
    public function check_worker_ami($name, $level=0){
        $res_ping = FALSE;
        $WorkerPID = Util::get_pid_process($name);
        if("$WorkerPID" != '') {
            // Сервис запущен. Выполним к нему пинг.
            $am = Util::get_am();
            $res_ping = $am->ping_ami_listner('ModuleTemplateAMI');
            if (FALSE == $res_ping) {
                // Пинг не прошел.
                Util::sys_log_msg('ModuleTemplateAMI', 'Restart...');
            }
        }

        if($res_ping == FALSE && $level<10){
            $this->start_worker($name);
            // Сервис не запущен.
            sleep(2);
            // Пытаемся снова запустить / проверить работу сервиса.
            $this->check_worker_ami($name, $level+1);
        }
    }

    /**
     * Запуск рабочего процесса.
     * @param        $name
     */
    private function start_worker($name){
        Util::process_worker("$name","start", "$name", 'restart');
    }
}

$module_name = 'ModuleTemplate';
$modulesDir  = $GLOBALS['g']['phalcon_settings']['application']['modulesDir'];
$bin         = "php -f {$modulesDir}{$module_name}/bin/CallTrackingWorker.php";

// Проверка запуска сервисов внешней панели.
/** @var \Models\PbxExtensionModules $result */
$result = PbxExtensionModules::findFirst("uniqid='{$module_name}'");
if(!$result==null && $result->disabled != 1){
    try{
        $cheker = new Checker($GLOBALS['g']);
        // Проверка листнера UserEvent
        $cheker->check_worker_ami($bin);
    }catch (Exception $e) {
        Util::sys_log_msg('ModuleTemplate Safe Script', 'Error '. $e->getMessage());
    }
}else{
    Util::process_worker($bin,'', $bin,'stop');
}


