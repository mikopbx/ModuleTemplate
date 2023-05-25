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

namespace Modules\ModuleTemplate\Setup;

use MikoPBX\Modules\Setup\PbxExtensionSetupBase;


/**
 * Class PbxExtensionSetup
 * Module installer and uninstaller
 *
 * @package Modules\ModuleTemplate\Setup
 */
class PbxExtensionSetup extends PbxExtensionSetupBase
{

    /**
     * PbxExtensionSetup constructor.
     *
     * @param string $moduleUniqueID - the unique module identifier
     */
    public function __construct(string $moduleUniqueID)
    {
        parent::__construct($moduleUniqueID);

    }

    /**
     * Creates database structure according to models annotations
     *
     * If it necessary, it fills some default settings, and change sidebar menu item representation for this module
     *
     * After installation it registers module on PbxExtensionModules model
     *
     *
     * @return bool result of installation
     */
    public function installDB(): bool
    {
        $result = $this->createSettingsTableByModelsAnnotations();

        if ($result) {
            $result = $this->registerNewModule();
        }

        if ($result) {
            $result = $this->addToSidebar();
        }

        return $result;
    }

    /**
     * Create folders on PBX system and apply rights
     *
     * @return bool result of installation
     */
    public function installFiles(): bool
    {
        return parent::installFiles();
    }

    /**
     * Unregister module on PbxExtensionModules,
     * Makes data backup if $keepSettings is true
     *
     * Before delete module we can do some soft delete changes, f.e. change forwarding rules i.e.
     *
     * @param  $keepSettings bool creates backup folder with module settings
     *
     * @return bool uninstall result
     */
    public function unInstallDB($keepSettings = false): bool
    {
        return parent::unInstallDB($keepSettings);
    }

}