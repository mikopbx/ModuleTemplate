<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 8 2019
 *
 */

/**
 * TODO: Если модуль предполагает открытие портов, то в этом файле
 * можно описать какие именно порты необходимо открыть.
 *
 * Иначе файл надо удалить из поставки
 *
 * shortName - то как модуль будет отображаться на индексной странице Firewall
 * name - просто комментарий в таблице FirewallRules
 * action - начальное состояние портов до их настройки в секции Firewall
 *
 */


namespace Modules\ModuleTemplate\setup;

class FirewallRules
{
    public static function getDefaultRules() :array
    {
        return [
            'ModuleTemplate'=>[
                'rules'  => [
                ['portfrom'=>4222,'portto'=>4222,'protocol' => 'tcp', 'name'=>'NatsPort'],
                ['portfrom'=>8222,'portto'=>8222,'protocol' => 'tcp', 'name'=>'NatsWebPort'],
                ['portfrom'=>8000,'portto'=>8000,'protocol' => 'tcp', 'name'=>'CDRCTIPort'],
            ],
                'action' => 'allow',
                'shortName'=>'TemplateModule',
        ]];
    }

}