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
use Phalcon\Di;
use Util;

require_once 'globals.php';

class WorkerSafeScripts {
    private $result  = false;
    private $message = false;
    private $g;

    /**
     * WorkerSafeScripts constructor.
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
    public function checkWorkerAMI($name, $level=0){
        $res_ping = FALSE;
        $WorkerPID = Util::getPidOfProcess($name);
        if("$WorkerPID" != '') {
            // Сервис запущен. Выполним к нему пинг.
            $am = Util::getAstManager();
            $res_ping = $am->pingAMIListner('ModuleTemplateAMI');
            if (FALSE == $res_ping) {
                // Пинг не прошел.
                Util::sysLogMsg('ModuleTemplateAMI', 'Restart...');
            }
        }

        if($res_ping == FALSE && $level<10){
            $this->startWorker($name);
            // Сервис не запущен.
            sleep(2);
            // Пытаемся снова запустить / проверить работу сервиса.
            $this->checkWorkerAMI($name, $level+1);
        }
    }

    /**
     * Запуск рабочего процесса.
     * @param        $name
     */
    private function startWorker($name){
        Util::processWorker("$name","start", "$name", 'restart');
    }
}

$module_name = 'ModuleTemplate';
$modulesDir  =  Di::getDefault()->getConfig()->path('core.modulesDir');
$bin         = "php -f {$modulesDir}{$module_name}/bin/CallTrackingWorker.php";

// Проверка запуска сервисов внешней панели.
/** @var \Models\PbxExtensionModules $result */
$result = PbxExtensionModules::findFirst("uniqid='{$module_name}'");
if(!$result==null && $result->disabled != 1){
    try{
        $cheker = new WorkerSafeScripts();
        // Проверка листнера UserEvent
        $cheker->checkWorkerAMI($bin);
    }catch (Exception $e) {
        Util::sysLogMsg('ModuleTemplate Safe Script', 'Error '. $e->getMessage());
    }
}else{
    Util::processWorker($bin,'', $bin,'stop');
}


