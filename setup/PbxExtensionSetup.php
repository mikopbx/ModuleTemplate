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

use Models\PbxSettings;
use Modules\PbxExtensionBase;
use Util;
use Phalcon\Text;

class PbxExtensionSetup extends PbxExtensionBase
{
    /**
     * PbxExtensionSetup constructor.
     */
    public function __construct()
    {
        $this->version         = '%ModuleVersion%'; // Меняется автоматом в TeamCity
        $this->min_pbx_version = '2019.4.163'; // TODO:Меняем руками если появляются явные зависимости от версии PBX
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
        // Создаем базу данных
        $result = $this->createSettingsTableByModelsAnnotations();

        // Регаем модуль в PBX Extensions
        if ($result) {
            $result = $this->registerNewModule();
        }

        // Добавим отображение модуля в боковом меню
        $this->addToSidebar();

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

        return parent::installFiles();
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
        // Чистим дополнительные записи, например записи в Extensions
        // Потом вызываем родительский метод unInstallDB
        // Если ничего дополнительного при установке не созадавали
        // Можно удалить этот метод, автоматом будет вызываться родительский

        return parent::unInstallDB($keepSettings);
    }

    /**
     * Выполняет удаление своих файлов с остановной процессов
     * при необходимости
     *
     * @return bool результат удаления
     * @throws \Phalcon\Exception
     */
    protected function unInstallFiles(): bool
    {
        // Если нужно прибить какие нибдуь процессы перед удалением, то описываем это здесь

        return parent::unInstallFiles();
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

    /**
     * Добавляет модуль в боковое меню, можно переопределить родительскую функцию и заменить иконку
     *
     * @return bool
     */
    protected function addToSidebar(): bool
    {
            $menuSettingsKey = "AdditionalMenuItem{$this->module_uniqid}";
            $unCamelizedControllerName = Text::uncamelize($this->module_uniqid, '-');
            $menuSettings = PbxSettings::findFirstByKey($menuSettingsKey);
            if (!$menuSettings){
                $menuSettings = new PbxSettings();
                $menuSettings->key = $menuSettingsKey;
            }
            $value = [
                'uniqid'=>$this->module_uniqid,
                'href'=>"/admin-cabinet/$unCamelizedControllerName",
                'group'=>'modules',
                'iconClass'=>'puzzle piece',
                'caption'=>"Breadcrumb$this->module_uniqid",
                'showAtSidebar'=>true,
            ];
            $menuSettings->value = json_encode($value);
            return $menuSettings->save();
    }
}