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

namespace Modules\ModuleTemplate\App\Forms;

use Phalcon\Forms\Form;
use Phalcon\Forms\Element\Text;
use Phalcon\Forms\Element\Numeric;
use Phalcon\Forms\Element\Password;
use Phalcon\Forms\Element\Check;
use Phalcon\Forms\Element\TextArea;
use Phalcon\Forms\Element\Hidden;
use Phalcon\Forms\Element\Select;


class ModuleTemplateForm extends Form
{

    public function initialize($entity = null, $options = null) :void
    {

        // id
        $this->add(new Hidden('id', ['value' => $entity->id]));

        // text_field
        $this->add(new Text('text_field'));

        // text_area_field
        $rows = max(round(strlen($entity->text_area_field) / 95), 2);
        $this->add(new TextArea('text_area_field', ['rows' => $rows]));

        // password_field
        $this->add(new Password('password_field'));

        // integer_field
        $this->add(new Numeric('integer_field', [
            'maxlength'    => 2,
            'style'        => 'width: 80px;',
            'defaultValue' => 3,
        ]));


        // checkbox_field
        $checkAr = ['value' => null];
        if ($entity->checkbox_field) {
            $checkAr = ['checked' => 'checked', 'value' => null];
        }
        $this->add(new Check('checkbox_field', $checkAr));

        // toggle_field
        $checkAr = ['value' => null];
        if ($entity->toggle_field) {
            $checkAr = ['checked' => 'checked', 'value' => null];
        }
        $this->add(new Check('toggle_field', $checkAr));

        // dropdown_field
        $providers = new Select('dropdown_field', $options['providers'], [
            'using'    => [
                'id',
                'name',
            ],
            'useEmpty' => false,
            'class'    => 'ui selection dropdown provider-select',
        ]);
        $this->add($providers);
    }
}