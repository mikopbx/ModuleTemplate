<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 5 2019
 */

namespace Modules\ModuleTemplate\setup;

use Models\PbxSettings;
use Modules\PbxExtensionBase;
use Modules\PbxExtensionInterface;
use MikoPBX\Core\System\Util;
use Phalcon\Text;

class PbxExtensionSetup extends PbxExtensionBase
{
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
        Util::mwExec("chmod +x {$this->moduleDir}/bin/*");
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

}