<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 11 2018
 */
namespace Modules\ModuleTemplate\App\Controllers;
use MikoPBX\AdminCabinet\Controllers\BaseController;
use MikoPBX\Modules\PbxExtensionUtils;
use Modules\ModuleTemplate\App\Forms\ModuleTemplateForm;
use Modules\ModuleTemplate\Models\ModuleTemplate;
use MikoPBX\Common\Models\Providers;

class ModuleTemplateController extends BaseController
{
    private $moduleUniqueID = 'ModuleTemplate';
    private $moduleDir;

    /**
     * Basic initial class
     */
    public function initialize(): void
    {
        $this->moduleDir           = PbxExtensionUtils::getModuleDir($this->moduleUniqueID);
        $this->view->logoImagePath = "{$this->url->get()}assets/img/cache/{$this->moduleUniqueID}/logo.svg";
        $this->view->submitMode    = null;
        parent::initialize();
    }

    /**
     * Index page controller
     */
    public function indexAction(): void
    {

        $footerCollection = $this->assets->collection('footerJS');
        $footerCollection->addJs('js/pbx/main/form.js', true);
        $footerCollection->addJs("js/cache/{$this->moduleUniqueID}/module-template-index.js", true);

        $headerCollectionCSS = $this->assets->collection('headerCSS');
        $headerCollectionCSS->addCss("css/cache/{$this->moduleUniqueID}/module-template.css", true);

        $settings = ModuleTemplate::findFirst();
        if ($settings === null) {
            $settings = new ModuleTemplate();
        }

        // For example we add providers list on the form
        $providers = Providers::find();
        $providersList = [];
        foreach ($providers as $provider){
            $providersList[ $provider->uniqid ] = $provider->getRepresent();
        }
        $options['providers']=$providersList;

        $this->view->form = new ModuleTemplateForm($settings, $options);
        $this->view->pick("{$this->moduleDir}/App/Views/index");
    }

    /**
     * Save settings AJAX action
     */
    public function saveAction() :void
    {
        if ( ! $this->request->isPost()) {
            return;
        }
        $data   = $this->request->getPost();
        $record = ModuleTemplate::findFirst();

        if ($record === null) {
            $record = new ModuleTemplate();
        }
        $this->db->begin();
        foreach ($record as $key => $value) {
            switch ($key) {
                case 'id':
                    break;
                case 'checkbox_field':
                case 'toggle_field':
                    if (array_key_exists($key, $data)) {
                        $record->$key = ($data[$key] === 'on') ? '1' : '0';
                    } else {
                        $record->$key = '0';
                    }
                    break;
                default:
                    if (array_key_exists($key, $data)) {
                        $record->$key = $data[$key];
                    } else {
                        $record->$key = '';
                    }
            }
        }

        if ($record->save() === FALSE) {
            $errors = $record->getMessages();
            $this->flash->error(implode('<br>', $errors));
            $this->view->success = false;
            $this->db->rollback();

            return;
        }

        $this->flash->success($this->translation->_('ms_SuccessfulSaved'));
        $this->view->success = true;
        $this->db->commit();
    }

}