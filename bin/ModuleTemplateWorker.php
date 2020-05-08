<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2018
 */

namespace Modules\ModuleTemplate\bin;

require_once 'globals.php';

use Exception;
use \Modules\ModuleTemplate\Lib\ModuleTemplateAMI;
use MikoPBX\Core\System\Util;

if(count($argv)>1 && $argv[1] == 'start') {
    try{
        $listener = new ModuleTemplateAMI();
        $listener->start();
    }catch (Exception $e) {
        Util::sysLogMsg("ModuleTemplate_EXCEPTION", $e->getMessage());
    }
}