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

    /**
     * Retrieves the description of tables and assigns it to the view data.
     *
     * @return void
     */
    public function getTablesDescriptionAction(): void
    {
        $this->view->data = $this->getTablesDescription();
    }

    /**
     * Retrieves the new records for a given table and assigns them to the view data.
     *
     * @return void
     */
    public function getNewRecordsAction(): void
    {
        // Assign current page to the view
        $currentPage                 = $this->request->getPost('draw');
        $table                       = $this->request->get('table');
        $this->view->draw            = $currentPage;
        $this->view->recordsTotal    = 0;
        $this->view->recordsFiltered = 0;
        $this->view->data            = [];

        // Retrieve the description of tables
        $descriptions = $this->getTablesDescription();

        // If the table description does not exist, return
        if(!isset($descriptions[$table])){
            return;
        }
        $className = $this->getClassName($table);

        // If the class name is not empty, retrieve the records
        if(!empty($className)){
            $filter = [];

            // Apply sorting based on priority column if it exists
            if(isset($descriptions[$table]['cols']['priority'])){
                $filter = ['order' => 'priority'];
            }

            // Retrieve all records and convert them to an array
            $allRecords = $className::find($filter)->toArray();
            $records    = [];
            $emptyRow   = [
                'rowIcon'  =>  $descriptions[$table]['cols']['rowIcon']['icon']??'',
                'DT_RowId' => 'TEMPLATE'
            ];

            // Add empty values for each column except rowIcon
            foreach ($descriptions[$table]['cols'] as $key => $metadata) {
                if('rowIcon' !== $key){
                    $emptyRow[$key] = '';
                }
            }
            $records[] = $emptyRow;

            // Iterate through each record and populate the data array
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

            // Assign the populated records to the view data
            $this->view->data      = $records;
        }
    }

    /**
     * Renders the index page for the module.
     *
     * @return void
     */
    public function indexAction(): void
    {
        // Add JavaScript files to the footer collection
        $footerCollection = $this->assets->collection('footerJS');
        $footerCollection->addJs('js/pbx/main/form.js', true);
        $footerCollection->addJs('js/vendor/datatable/dataTables.semanticui.js', true);
        $footerCollection->addJs("js/cache/{$this->moduleUniqueID}/module-template-index.js", true);
        $footerCollection->addJs('js/vendor/jquery.tablednd.min.js', true);

        // Add CSS files to the header collection
        $headerCollectionCSS = $this->assets->collection('headerCSS');
        $headerCollectionCSS->addCss("css/cache/{$this->moduleUniqueID}/module-template.css", true);
        $headerCollectionCSS->addCss('css/vendor/datatable/dataTables.semanticui.min.css', true);

        // Retrieve or create new module settings
        $settings = ModuleTemplate::findFirst();
        if ($settings === null) {
            $settings = new ModuleTemplate();
        }

        // Create options array for form
        $options = [];

        // Retrieve providers list for form
        $providers = Providers::find();
        $providersList = [];
        foreach ($providers as $provider){
            $providersList[ $provider->uniqid ] = $provider->getRepresent();
        }
        $options['providers']=$providersList;

        // Assign the form and view template
        $this->view->form = new ModuleTemplateForm($settings, $options);
        $this->view->pick("{$this->moduleDir}/App/Views/index");

        // Retrieve queues and users for selection lists
        $this->view->queues = CallQueues::find(['columns' => ['id', 'name']]);
        $this->view->users  = Extensions::find(["type = 'SIP'", 'columns' => ['number', 'callerid']]);
    }

    /**
     * Saves the form data to the database.
     *
     * @return void
     */
    public function saveAction() :void
    {
        $data       = $this->request->getPost();
        $record = ModuleTemplate::findFirst();
        if ($record === null) {
            $record = new ModuleTemplate();
        }
        $this->db->begin();

        // Iterate through each field in the record and update its value
        foreach ($record as $key => $value) {
            switch ($key) {
                case 'id':
                    break;
                case 'checkbox_field':
                case 'toggle_field':
                    // Handle checkbox and toggle fields
                    if (array_key_exists($key, $data)) {
                        $record->$key = ($data[$key] === 'on') ? '1' : '0';
                    } else {
                        $record->$key = '0';
                    }
                    break;
                default:
                    // Handle other fields
                    if (array_key_exists($key, $data)) {
                        $record->$key = $data[$key];
                    } else {
                        $record->$key = '';
                    }
            }
        }

        // Save the record to the database
        if ($record->save() === FALSE) {
            $errors = $record->getMessages();
            $this->flash->error(implode('<br>', $errors));
            $this->view->success = false;
            $this->db->rollback();
            return;
        }

        // Commit the transaction and display success message
        $this->flash->success($this->translation->_('ms_SuccessfulSaved'));
        $this->view->success = true;
        $this->db->commit();
    }

    /**
     * Deletes a record from the specified table.
     *
     * @return void
     */
    public function deleteAction(): void
    {
        $table     = $this->request->get('table');
        $className = $this->getClassName($table);
        // If the class name is empty, return
        if(empty($className)) {
            $this->view->success = false;
            return;
        }
        $id     = $this->request->get('id');
        $record = $className::findFirstById($id);

        // If the record exists and deletion fails, display error message
        if ($record !== null && ! $record->delete()) {
            $this->flash->error(implode('<br>', $record->getMessages()));
            $this->view->success = false;
            return;
        }

        // Set success flag to true
        $this->view->success = true;
    }

    /**

    Retrieves the description of tables.

    @return array The table descriptions.
     */
    private function getTablesDescription():array
    {
        $description['PhoneBook'] = [
            'cols' => [
                'rowIcon'    => ['header' => '',                        'class' => 'collapsing', 'icon' => 'user'],
                'priority'   => ['header' => '',                        'class' => 'collapsing'],
                'call_id'    => ['header' => 'Caller representation',   'class' => 'ten wide'],
                'number_rep' => ['header' => 'Phone number',            'class' => 'four wide'],
                'queueId'    => ['header' => 'Phone number as int',     'class' => 'collapsing', 'select' => 'queues-list'],
                'delButton'  => ['header' => '',                        'class' => 'collapsing']
            ],
            'ajaxUrl' => '/getNewRecords',
            'icon' => 'user',
            'needDelButton' => true
        ];
        return $description;
    }

    /**
     * Saves the data of a table row to the database.
     *
     * @return void
     */
    public function saveTableDataAction():void
    {
        $data       = $this->request->getPost();
        $tableName  = $data['pbx-table-id']??'';

        $className = $this->getClassName($tableName);

        // If the class name is empty, return
        if(empty($className)){
            return;
        }
        $rowId      = $data['pbx-row-id']??'';

        // If the row ID is empty, set success flag to false and return
        if(empty($rowId)){
            $this->view->success = false;
            return;
        }
        $this->db->begin();
        $rowData = $className::findFirst('id="'.$rowId.'"');
        if(!$rowData){
            $rowData = new $className();
        }

        // Update each field of the row data
        foreach ($rowData as $key => $value) {
            if($key === 'id'){
                continue;
            }
            if (array_key_exists($key, $data)) {
                $rowData->writeAttribute($key, $data[$key]);
            }
        }
        // Save the row data
        if ($rowData->save() === FALSE) {
            $errors = $rowData->getMessages();
            $this->flash->error(implode('<br>', $errors));
            $this->view->success = false;
            $this->db->rollback();
            return;
        }

        // Set the data and success flag for the view
        $this->view->data = ['pbx-row-id'=>$rowId, 'newId'=>$rowData->id, 'pbx-table-id' => $data['pbx-table-id']];
        $this->view->success = true;
        $this->db->commit();

    }

    /**
     * Retrieves the class name for the given table name.
     *
     * @param string $tableName The name of the table.
     * @return string The class name for the table.
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
     * Updates the priority values for the records in a table.
     *
     * @return void
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
        // If the class name is empty, display error message and return
        if(empty($className)){
            echo "Table not found: $tableName";
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