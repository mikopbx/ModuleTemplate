<?php
/*
 * MikoPBX - free phone system for small business
 * Copyright © 2017-2023 Alexey Portnov and Nikolay Beketov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace Modules\ModuleTemplate\Lib;

use MikoPBX\Common\Models\PbxSettings;
use MikoPBX\Core\Workers\Cron\WorkerSafeScriptsCore;
use MikoPBX\Modules\Config\ConfigClass;
use MikoPBX\PBXCoreREST\Lib\PBXApiResult;

class TemplateConf extends ConfigClass
{

    /**
     * Receive information about mikopbx main database changes
     *
     * @param $data
     */
    public function modelsEventChangeData($data): void
    {
        // f.e. if somebody changes PBXLanguage, we will restart all workers
        if (
            $data['model'] === PbxSettings::class
            && $data['recordId'] === 'PBXLanguage'
        ) {
            $templateMain = new TemplateMain();
            $templateMain->startAllServices(true);
        }
    }

    /**
     * Returns module workers to start it at WorkerSafeScriptCore
     *
     * @return array
     */
    public function getModuleWorkers(): array
    {
        return [
            [
                'type'   => WorkerSafeScriptsCore::CHECK_BY_BEANSTALK,
                'worker' => WorkerTemplateMain::class,
            ],
            [
                'type'   => WorkerSafeScriptsCore::CHECK_BY_AMI,
                'worker' => WorkerTemplateAMI::class,
            ],
        ];
    }

    /**
     *  Process CoreAPI requests under root rights
     *
     * @param array $request
     *
     * @return PBXApiResult An object containing the result of the API call.
     */
    public function moduleRestAPICallback(array $request): PBXApiResult
    {
        $res    = new PBXApiResult();
        $res->processor = __METHOD__;
        $action = strtoupper($request['action']);
        switch ($action) {
            case 'CHECK':
                $templateMain = new TemplateMain();
                $res          = $templateMain->checkModuleWorkProperly();
                break;
            case 'RELOAD':
                $templateMain = new TemplateMain();
                $templateMain->startAllServices(true);
                $res->success = true;
                break;
            default:
                $res->success    = false;
                $res->messages[] = 'API action not found in moduleRestAPICallback ModuleTemplate';
        }

        return $res;
    }


    /**
     * Modifies the system menu.
     * @see https://docs.mikopbx.com/mikopbx-development/module-developement/module-class#onbeforeheadermenushow
     *
     * @param array $menuItems The menu items for modifications.
     *
     * @return void
     */
    public function onBeforeHeaderMenuShow(array &$menuItems):void
    {
        $menuItems['module_template_AdditionalMenuItem']=[
            'caption'=>'module_template_AdditionalMenuItem',
            'iconclass'=>'',
            'submenu'=>[
                '/module-template/additional-page'=>[
                    'caption' => 'module_template_AdditionalSubMenuItem',
                    'iconclass' => 'gear',
                    'action' => 'index',
                    'param' => '',
                    'style' => '',
                ],
            ]
        ];
    }
}