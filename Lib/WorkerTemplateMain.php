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


use MikoPBX\Core\System\BeanstalkClient;
use MikoPBX\Core\System\Util;
use Error;
use MikoPBX\Core\Workers\WorkerBase;

require_once 'Globals.php';

/**
 * Class ModuleTemplate
 */
class WorkerTemplateMain extends WorkerBase
{
    protected TemplateMain $templateMain;

    /**
     * Start point for the worker.
     *
     * @param array $argv The command line arguments.
     * @return void
     */
    public function start(array $argv): void
    {
        $this->templateMain = new TemplateMain();
        $client = new BeanstalkClient(self::class);
        $client->subscribe($this->makePingTubeName(self::class), [$this, 'pingCallBack']);
        $client->subscribe(self::class, [$this, 'beanstalkCallback']);
        while (true) {
            $client->wait();
        }
    }

    /**
     * Parser for received Beanstalk message
     *
     * @param BeanstalkClient $message
     */
    public function beanstalkCallback(BeanstalkClient $message): void
    {
        $receivedMessage = json_decode($message->getBody(), true);
        $this->templateMain->processBeanstalkMessage($receivedMessage);
    }
}

// Start worker process
$workerClassname = WorkerTemplateMain::class;
if (isset($argv) && count($argv) > 1) {
    cli_set_process_title($workerClassname);
    try {
        $worker = new $workerClassname();
        $worker->start($argv);
    } catch (\Throwable $e) {
        global $errorLogger;
        $errorLogger->captureException($e);
        Util::sysLogMsg("{$workerClassname}_EXCEPTION", $e->getMessage(), LOG_ERR);
    }
}
