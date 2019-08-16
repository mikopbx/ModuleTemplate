<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 5 2019
 */

/**
 * TODO: Замениить все вхождения строки ModuleTemplate на ID нового модуля
 * Также должна называться и папка вместо ModuleTemplate - ID нового модуля
 *
 * Переименовать и описать модели модуля, как минимум одна модель с именем класса
 * аналогичным ID модуля
 *
 *
 */

namespace Modules\ModuleTemplate\setup;

use Models\Extensions;
use Modules\ModuleTemplate\Models\ModuleTemplate;
use Modules\PbxExtensionBase;
use Util;

class PbxExtensionSetup extends PbxExtensionBase
{

    private $table_settings = 'm_ModuleTemplate';
    private $table_another = 'm_ModuleTemplateAnother';

    /**
     * PbxExtensionSetup constructor.
     */
    public function __construct()
    {
        $this->version         = '%ModuleVersion%'; // Меняется автоматом в TeamCity
        $this->min_pbx_version = '7.3.1.1'; // TODO:Меняем руками если появляются явные зависимости от версии PBX
        $this->module_uniqid   = 'ModuleTemplate';
        $this->developer       = 'MIKO';
        $this->support_email   = 'help@miko.ru';
        parent::__construct();
    }

    /**
     * Создает структуру для хранения настроек модуля в своей модели
     * и заполняет настройки по-умолчанию если таблицы не было в системе
     * см (unInstallDB)
     *
     * Регистрирует модуль в PbxExtensionModules
     *
     * @return bool результат установки
     */
    protected function installDB(): bool
    {

        // TODO: Сначала описываем модели для хранениия,
        // затем описываем структуру каждой модели и создаем таблицы хранения
        // в общем случае достаточно одной таблицы с ID модуля и колонкой ID типа KEY

        $result = true;

        // Создаем структуру хранения настроек модуля
        $tableStructure = [
            'id'                      => 'key',
            'server1chost'            => 'string',
            'server1cport'            => 'string',
            'login'                   => 'string',
            'secret'                  => 'string',
            'failoverextension'       => 'string',
            'database'                => 'string',
            'extension'               => 'string',
            'internalextensiontength' => 'integer',
            'redirection_settings'    => 'string',

        ];

        if ($result) {
            $result = $this->createSettingsTable($this->table_settings, $tableStructure);
        }

        // Пример создания дополнительной таблицы
        $tableStructure = [
            'id'                 => 'key',
            'folder_id'          => 'string',
            'service_account_id' => 'string',
            'key_data'           => 'string',
            'key_id'             => 'string',
            'iam_token'          => 'string',
            'o_auth_token'       => 'string',
        ];
        if ($result) {
            $result = $this->createSettingsTable($this->table_another, $tableStructure);
        }


        // Заполним начальные настройки после создания таблицы
        if ($result) {
            $this->db->begin();
            $result   = true;
            $settings = ModuleTemplate::findFirst();
            if ( ! $settings) {
                $settings = new ModuleTemplate();
            }
            if (empty($settings->extension)) {
                // Модуль был НЕ установлен ранее, ищем свободный exten.
                $exten               = Extensions::getNextFreeApplicationNumber();
                $settings->extension = $exten;
                $result              = $settings->save();
            }

            $exten = $settings->extension;
            $data  = Extensions::findFirst('number="' . $exten . '"');
            if ( ! $data) {
                $data                    = new Extensions();
                $data->number            = $exten;
                $data->type              = 'MODULES';
                $data->callerid          = 'ModuleTemplate';
                $data->public_access     = 0;
                $data->show_in_phonebook = 1;
                $result                  = $result && $data->save();
            }

            if ($result) {
                $this->db->commit();
            } else {
                $this->db->rollback();
                Util::sys_log_msg('update_system_config', 'Error: Failed to update table the Extensions table.');
            }
        }
        // Регаем модуль в PBX Extensions
        if ($result) {
            $result = $this->registerNewModule();
        }

        return $result;
    }

    /**
     * Выполняет копирование необходимых файлов, в каталоги системы
     *
     * @return bool результат установки
     */
    protected function installFiles(): bool
    {
        Util::mwexec("chmod +x {$this->moduleDir}/bin/*");
        Util::mwexec("chmod +rx {$this->moduleDir}/agi-bin");
        Util::mwexec("chmod +x  {$this->moduleDir}/agi-bin/*");

        return true;
    }

    /**
     * Удаляет запись о модуле из PbxExtensionModules
     * Удаляет свою модель
     *
     * @param  $keepSettings - оставляет таблицу с данными своей модели
     *
     * @return bool результат очистки
     */
    protected function unInstallDB($keepSettings = false): bool
    {
        $result = true;

        if ($this->db->tableExists($this->table_settings)) {
            /** @var \Modules\ModuleTemplate\Models\ModuleTemplate $settings */
            $settings = ModuleTemplate::findFirst();
            if ($settings) {
                $data = Extensions::findFirst('number="' . $settings->extension . '"');
                if ($data) {
                    $result = $result && $data->delete();
                }
            }
        }

        if ($keepSettings === false) {
            $result = $result &&
                $this->dropSettingsTable($this->table_settings)
                && $this->dropSettingsTable($this->table_yandex)
                && $this->dropSettingsTable($this->table_crt)
                && $this->unregisterModule();
        } else {
            $result = $result && $this->unregisterModule();
        }

        return $result;
    }

    /**
     * Выполняет удаление своих файлов с остановной процессов
     * при необходимости
     *
     * @return bool результат удаления
     */
    protected function unInstallFiles(): bool
    {
        Util::mwexec("rm -rf {$this->moduleDir}");

        return true;
    }

    /**
     * Выполняет активацию триалов, проверку лицензионного клчюча
     *
     * @return bool результат активации лицензии
     */
    protected function activateLicense(): bool
    {
        return true;
    }
}