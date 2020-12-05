<?php
namespace Modules\ModuleTemplate\Lib;

use MikoPBX\Core\System\Util;
use MikoPBX\Core\Workers\WorkerBase;
use MikoPBX\Core\Asterisk\AsteriskManager;
use Error;

require_once 'Globals.php';


class WorkerTemplateAMI extends WorkerBase
{
    protected AsteriskManager $am;
    protected TemplateMain $templateMain;

    /**
     * Старт работы листнера.
     *
     * @param $argv
     */
    public function start($argv): void
    {
        $this->templateMain = new TemplateMain();
        $this->am = Util::getAstManager();
        $this->setFilter();
        $this->am->addEventHandler("userevent", [$this, "callback"]);
        while (true) {
            $result = $this->am->waitUserEvent(true);
            if ($result === []) {
                // Need reconnect to Asterisk AMI
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
        global $errorLogger;
        $errorLogger->captureException($e);
        Util::sysLogMsg("{$workerClassname}_EXCEPTION", $e->getMessage(), LOG_ERR);
    }
}