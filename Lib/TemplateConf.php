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

use MikoPBX\AdminCabinet\Forms\ExtensionEditForm;
use MikoPBX\Common\Models\PbxSettings;
use MikoPBX\Core\Workers\Cron\WorkerSafeScriptsCore;
use MikoPBX\Modules\Config\ConfigClass;
use MikoPBX\PBXCoreREST\Lib\PBXApiResult;
use Phalcon\Forms\Element\Select;
use Phalcon\Forms\Form;
use Phalcon\Mvc\Controller;
use Phalcon\Mvc\View;

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
     * Prepares the include block within a Volt template.
     * @see https://docs.mikopbx.com/mikopbx-development/module-developement/module-class#onvoltblockcompile
     *
     * @param string $controller The called controller name.
     * @param string $blockName The named in volt template block name.
     * @param View $view The view instance.
     *
     * @return string the volt partial file path without extension.
     */
    public function onVoltBlockCompile(string $controller, string $blockName, View $view):string
    {
        $result = '';
        if ($controller==='Extensions'){
            switch ($blockName){
                case "GeneralTabFields":
                    $result = "{$this->moduleDir}/App/Views/Extensions/GeneralTabFields";
                    break;
                case "AdditionalTab":
                    $result = "{$this->moduleDir}/App/Views/Extensions/AdditionalTab";
                    break;
                default:
            }
        }

        return $result;
    }

    /**
     * Called from BaseForm before the form is initialized.
     * @see https://docs.mikopbx.com/mikopbx-development/module-developement/module-class#onbeforeforminitialize
     *
     * @param Form $form The called form instance.
     * @param mixed $entity The called form entity.
     * @param mixed $options The called form options.
     *
     * @return void
     */
    public function onBeforeFormInitialize(Form $form, $entity, $options):void
    {
        if (is_a($form, ExtensionEditForm::class)) {
            // Prepare groups for select
            $arrGroupsForSelect = [
                'sales' => $this->translation->_('mod_tpl_SalesDepartment'),
                'support' => $this->translation->_('mod_tpl_SupportDepartment'),
                'hr' => $this->translation->_('mod_tpl_HRDepartment'),
                'accounts' => $this->translation->_('mod_tpl_AccountDepartment'),
            ];

            $groupForSelect = new Select(
                'mod_tpl_select_group', $arrGroupsForSelect, [
                    'using'    => [
                        'id',
                        'name',
                    ],
                    //'value' => $userGroupId,
                    'useEmpty' => false,
                    'class'    => 'ui selection dropdown search select-group-field',
                ]
            );

            // Add the group select field to the form
            $form->add($groupForSelect);

            // Look at onAfterExecuteRoute to understand how it save into DB
        }
    }

    /**
     * Calls from BaseController on afterExecuteRoute function
     *
     * @param Controller $controller
     * @return void
     */
    public function onAfterExecuteRoute(Controller $controller):void
    {
        $userGroup = $controller->request->getPost('mod_tpl_select_group');
        $userId = $controller->request->getPost('user_id');
        // Add an extra code to save it into DB
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
        $menuItems['mod_tpl_AdditionalMenuItem']=[
            'caption'=>'mod_tpl_AdditionalMenuItem',
            'iconclass'=>'',
            'submenu'=>[
                '/module-template/additional-page'=>[
                    'caption' => 'mod_tpl_AdditionalSubMenuItem',
                    'iconclass' => 'gear',
                    'action' => 'index',
                    'param' => '',
                    'style' => '',
                ],
            ]
        ];
    }

}