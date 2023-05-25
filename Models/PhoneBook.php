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