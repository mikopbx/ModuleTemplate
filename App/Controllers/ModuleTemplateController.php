<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 11 2018
 */
namespace Modules\ModuleTemplate\App\Controllers;
use MikoPBX\AdminCabinet\Controllers\BaseController;
use MikoPBX\Common\Models\CallQueues;
use MikoPBX\Common\Models\Extensions;
use MikoPBX\Modules\PbxExtensionUtils;
use Modules\ModuleTemplate\App\Forms\ModuleTemplateForm;
use Modules\ModuleTemplate\Models\ModuleTemplate;
use MikoPBX\Common\Models\Providers;
use Modules\ModuleTemplate\Models\PhoneBook;

class ModuleTemplateController extends BaseController
{
    private $moduleUniqueID = 'ModuleTemplate';
    private $moduleDir;

    /**
     * Basic initial class
     */
    public function initialize(): void
    {
        $this->moduleDir = PbxExtensionUtils::getModuleDir($this->moduleUniqueID);
        $this->view->logoImagePath = "{$this->url->get()}assets/img/cache/{$this->moduleUniqueID}/logo.svg";
        $this->view->submitMode = null;
        parent::initialize();
    }

    public function getTablesDescriptionAction(): void
    {
        $this->view->data = $this->getTablesDescription();
    }

    public function getNewRecordsAction(): void
    {
        $currentPage                 = $this->request->getPost('draw');
        $table                       = $this->request->get('table');
        $this->view->draw            = $currentPage;
        $this->view->recordsTotal    = 0;
        $this->view->recordsFiltered = 0;
        $this->view->data            = [];

        $descriptions = $this->getTablesDescription();
        if(!isset($descriptions[$table])){
            return;
        }
        $className = $this->getClassName($table);
        if(!empty($className)){
            $filter = [];
            if(isset($descriptions[$table]['cols']['priority'])){
                $filter = ['order' => 'priority'];
            }
            $allRecords = $className::find($filter)->toArray();
            $records    = [];
            $emptyRow   = [
                'rowIcon'  =>  $descriptions[$table]['cols']['rowIcon']['icon']??'',
                'DT_RowId' => 'TEMPLATE'
            ];
            foreach ($descriptions[$table]['cols'] as $key => $metadata) {
                if('rowIcon' !== $key){
                    $emptyRow[$key] = '';
                }
            }
            $records[] = $emptyRow;
            foreach ($allRecords as $rowData){
                $tmpData = [];
                $tmpData['DT_RowId'] =  $rowData['id'];
                foreach ($descriptions[$table]['cols'] as $key => $metadata){
                    if('rowIcon' === $key){
                        $tmpData[$key] = $metadata['icon']??'';
                    }elseif('delButton' === $key){
                        $tmpData[$key] = '';
                    }elseif(isset($rowData[$key])){
                        $tmpData[$key] =  $rowData[$key];
                    }
                }
                $records[] = $tmpData;
            }
            $this->view->data      = $records;
        }
    }

    /**
     * Index page controller
     */
    public function indexAction(): void
    {
        $footerCollection = $this->assets->collection('footerJS');
        $footerCollection->addJs('js/pbx/main/form.js', true);
        $footerCollection->addJs('js/vendor/datatable/dataTables.semanticui.js', true);
        $footerCollection->addJs("js/cache/{$this->moduleUniqueID}/module-template-index.js", true);
        $footerCollection->addJs('js/vendor/jquery.tablednd.min.js', true);

        $headerCollectionCSS = $this->assets->collection('headerCSS');
        $headerCollectionCSS->addCss("css/cache/{$this->moduleUniqueID}/module-template.css", true);
        $headerCollectionCSS->addCss('css/vendor/datatable/dataTables.semanticui.min.css', true);

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

        // Список выбора очередей.
        $this->view->queues = CallQueues::find(['columns' => ['id', 'name']]);
        $this->view->users  = Extensions::find(["type = 'SIP'", 'columns' => ['number', 'callerid']]);
    }

    /**
     * Save settings AJAX action
     */
    public function saveAction() :void
    {
        $data       = $this->request->getPost();
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

    /**
     * Delete phonebook record
     */
    public function deleteAction(): void
    {
        $table     = $this->request->get('table');
        $className = $this->getClassName($table);
        if(empty($className)) {
            $this->view->success = false;
            return;
        }
        $id     = $this->request->get('id');
        $record = $className::findFirstById($id);
        if ($record !== null && ! $record->delete()) {
            $this->flash->error(implode('<br>', $record->getMessages()));
            $this->view->success = false;
            return;
        }
        $this->view->success = true;
    }

    /**
     * Возвращает метаданные таблицы.
     * @return array
     */
    private function getTablesDescription():array
    {
        $description['PhoneBook'] = [
            'cols' => [
                'rowIcon'    => ['header' => '',                        'class' => 'collapsing', 'icon' => 'user'],
                'priority'   => ['header' => '',                        'class' => 'collapsing'],
                'call_id'    => ['header' => 'Представление абонента',  'class' => 'ten wide'],
                'number_rep' => ['header' => 'Номер телефона',          'class' => 'four wide'],
                'queueId'    => ['header' => 'Номер числом',            'class' => 'collapsing', 'select' => 'queues-list'],
                'delButton'  => ['header' => '',                        'class' => 'collapsing']
            ],
            'ajaxUrl' => '/getNewRecords',
            'icon' => 'user',
            'needDelButton' => true
        ];
        return $description;
    }

    /**
     * Обновление данных в таблице.
     */
    public function saveTableDataAction():void
    {
        $data       = $this->request->getPost();
        $tableName  = $data['pbx-table-id']??'';

        $className = $this->getClassName($tableName);
        if(empty($className)){
            return;
        }
        $rowId      = $data['pbx-row-id']??'';
        if(empty($rowId)){
            $this->view->success = false;
            return;
        }
        $this->db->begin();
        /** @var PhoneBook $rowData */
        $rowData = $className::findFirst('id="'.$rowId.'"');
        if(!$rowData){
            $rowData = new $className();
        }
        foreach ($rowData as $key => $value) {
            if($key === 'id'){
                continue;
            }
            if (array_key_exists($key, $data)) {
                $rowData->writeAttribute($key, $data[$key]);
            }
        }
        // save action
        if ($rowData->save() === FALSE) {
            $errors = $rowData->getMessages();
            $this->flash->error(implode('<br>', $errors));
            $this->view->success = false;
            $this->db->rollback();
            return;
        }
        $this->view->data = ['pbx-row-id'=>$rowId, 'newId'=>$rowData->id, 'pbx-table-id' => $data['pbx-table-id']];
        $this->view->success = true;
        $this->db->commit();

    }

    /**
     * Получение имени класса по имени таблицы
     * @param $tableName
     * @return string
     */
    private function getClassName($tableName):string
    {
        if(empty($tableName)){
            return '';
        }
        $className = "Modules\ModuleTemplate\Models\\$tableName";
        if(!class_exists($className)){
            $className = '';
        }
        return $className;
    }

    /**
     * Changes rules priority
     *
     */
    public function changePriorityAction(): void
    {
        $this->view->disable();
        $result = true;

        if ( ! $this->request->isPost()) {
            return;
        }
        $priorityTable = $this->request->getPost();
        $tableName     = $this->request->get('table');
        $className = $this->getClassName($tableName);
        if(empty($className)){
            echo "table not found -- ы$tableName --";
            return;
        }
        $rules = $className::find();
        foreach ($rules as $rule){
            if (array_key_exists ( $rule->id, $priorityTable)){
                $rule->priority = $priorityTable[$rule->id];
                $result         .= $rule->update();
            }
        }
        echo json_encode($result);
    }
}