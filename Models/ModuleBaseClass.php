<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 2 2019
 */

namespace Modules\ModuleTemplate\Models;

use Models\ModelsBase;

class ModuleBaseClass extends ModelsBase
{
    /**
     * Class initialization
     */
    public function initialize() :void
    {
        // ConnectionService automated created by Class and DB name in /back-end/modules/DiServicesInstall.php
        $this->setConnectionService('ModuleTemplate_module_db');
        parent::initialize();
    }

    /**
     * Возвращает предстваление элемента базы данных
     *  для сообщения об ошибках с ссылкой на элемент или для выбора в списках
     *  строкой
     *
     * @param bool $needLink - предстваление с ссылкой
     *
     * @return string
     */
    public function getRepresent( $needLink = FALSE ) :string{
        if ( $this->id === NULL ) {
            return $this->t( 'mo_NewElement' );
        }
        $name = $this->t( 'mo_ModuleTemplate' );
        if ( $needLink ) {
            $url     = $this->getDI()->getUrl();
            $link    = $url->get( 'module-template' );
            $linkLoc = $this->t( 'repLink' );
            $result  = $this->t( 'repModuleTemplate',
                [
                    'repesent' => "<a href='{$link}'>{$linkLoc}</a>",
                ] );
        } else {
            $result = $name;
        }

        return $result;
    }
}