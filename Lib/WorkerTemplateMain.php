<?php
namespace Modules\ModuleTemplate\Lib;


use MikoPBX\Core\System\BeanstalkClient;
use MikoPBX\Core\System\Util;
use Error;
use MikoPBX\Core\Workers\WorkerBase;

require_once 'Globals.php';

class WorkerTemplateMain extends WorkerBase
{
    protected TemplateMain $templateMain;

    /**
     * Worker start point
     *
     * @param $argv
     */
    public function start($argv): void
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
    public function beanstalkCallback($message): void
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
