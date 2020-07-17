<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2019
 */


namespace Modules\ModuleTemplate\Lib;

use MikoPBX\Common\Models\PbxSettings;
use MikoPBX\Core\Workers\Cron\WorkerSafeScriptsCore;
use MikoPBX\Modules\Config\ConfigClass;

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
     * @return array
     */
    public function moduleRestAPICallback(array $request): array
    {
        $action = strtoupper($request['action']);
        switch ($action) {
            case 'CHECK':
                $result                = null;
                $templateMain          = new TemplateMain();
                $result                = $templateMain->checkModuleWorkProperly();
                $result_data['result'] = $result !== null;
                $result_data['data']   = $result;

                return $result_data;

            case 'RELOAD':
                $templateMain = new TemplateMain();
                $templateMain->startAllServices(true);
                $result['result'] = 'Success';
                break;
            default:
                $result['result'] = 'ERROR';
                $result['data']   = 'API action not found in moduleRestAPICallback ModuleTemplate;';
        }

        return $result;
    }
}