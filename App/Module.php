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

namespace Modules\ModuleTemplate\App;

use Modules\ModuleTemplate\App\Providers\ViewProvider;
use Modules\ModuleTemplate\App\Providers\VoltProvider;
use Phalcon\Di\DiInterface;
use Phalcon\Events\Manager;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Mvc\ModuleDefinitionInterface;

class Module implements ModuleDefinitionInterface
{

    /**
     * Registers an autoloader related to the module
     *
     * @param \Phalcon\Di\DiInterface $container
     */
    public function registerAutoloaders(DiInterface $container = null){

    }

    /**
     * Registers services related to the module
     *
     * @param \Phalcon\Di\DiInterface $container
     */
    public function registerServices(DiInterface $container){
        $container->register(new ViewProvider());
        $container->register(new VoltProvider());

        $container->set('dispatcher', function () {
            $dispatcher = new Dispatcher();

            $eventManager = new Manager();

            $dispatcher->setEventsManager($eventManager);
            $dispatcher->setDefaultNamespace('Modules\ModuleUsersUI\App\Controllers\\');
            return $dispatcher;
        });
    }

}