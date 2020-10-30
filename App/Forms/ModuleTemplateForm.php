<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 9 2018
 *
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