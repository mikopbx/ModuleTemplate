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

use MikoPBX\Common\Handlers\CriticalErrorsHandler;
use MikoPBX\Core\Asterisk\AsteriskManager;
use MikoPBX\Core\System\Util;
use MikoPBX\Core\Workers\WorkerBase;

require_once 'Globals.php';


/**
 * Worker class for Template AMI.
 */
class WorkerTemplateAMI extends WorkerBase
{
    protected AsteriskManager $am;
    protected TemplateMain $templateMain;

    /**
     * Starts the listener work.
     * @param array $argv The command line arguments.
     * @return void
     */
    public function start(array $argv): void
    {
        $this->templateMain = new TemplateMain();
        $this->am = Util::getAstManager();
        $this->setFilter();
        $this->am->addEventHandler("userevent", [$this, "callback"]);
        while (true) {
            $result = $this->am->waitUserEvent(true);
            if ($result === []) {
                // Need to reconnect to Asterisk AMI
                usleep(100000);
                $this->am = Util::getAstManager();
                $this->setFilter();
            }
        }
    }

    /**
     * Setup ami events filter
     *
     * @return array
     */
    private function setFilter(): array
    {
        // Ping event to check module is allive
        $pingTube = $this->makePingTubeName(self::class);
        $params   = ['Operation' => 'Add', 'Filter' => 'UserEvent: ' . $pingTube];
        $this->am->sendRequestTimeout('Filter', $params);

        // Interception event - it is example event. It happens when PBX receive inbound call
        $params = ['Operation' => 'Add', 'Filter' => 'UserEvent: Interception'];
        return $this->am->sendRequestTimeout('Filter', $params);
    }

    /**
     * Callback processor
     *
     * @param $parameters
     */
    public function callback($parameters): void
    {
        if ($this->replyOnPingRequest($parameters)) {
            return;
        }

        if (stripos($parameters['UserEvent'],'Interception' ) === false) {
            return;
        }

        $this->templateMain->processAmiMessage($parameters);
    }

}

// Start worker process
$workerClassname = WorkerTemplateAMI::class;
if (isset($argv) && count($argv) > 1) {
    cli_set_process_title($workerClassname);
    try {
        $worker = new $workerClassname();
        $worker->start($argv);
    } catch (\Throwable $e) {
        CriticalErrorsHandler::handleExceptionWithSyslog($e);
    }
}