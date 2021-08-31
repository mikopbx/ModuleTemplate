<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 12 2019
 */


namespace Modules\ModuleTemplate\Models;

use MikoPBX\Modules\Models\ModulesModelsBase;

/**
 * Class PhoneBook
 *
 * @package Modules\ModulePhoneBook\Models
 *
 * @method static mixed findFirstByNumber(array|string|int $parameters = null)
 */
class PhoneBook extends ModulesModelsBase
{

    /**
     * @Primary
     * @Identity
     * @Column(type="integer", nullable=false)
     */
    public $id;

    /**
     * Number for search i.e. 79065554343
     *
     * @Column(type="integer", nullable=true)
     */
    public $number;

    /**
     * Number in visual format +7(926)991-12-12
     *
     * @Column(type="string", nullable=true)
     */
    public $number_rep;

    /**
     * Queue ID
     *
     * @Column(type="string", nullable=true)
     */
    public $queueId;

    /**
     * @Column(type="integer", nullable=true)
     */
    public ?string $priority = '0';

    /**
     * CallerID - MIKO - Nikolay Beketov
     *
     * @Column(type="string", nullable=true)
     */
    public $call_id;

    public function initialize(): void
    {
        $this->setSource('m_PhoneBook');
        parent::initialize();
        $this->useDynamicUpdate(true);
    }


    public function validation(): bool
    {
        return true;
    }
}