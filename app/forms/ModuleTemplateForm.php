<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 9 2018
 *
 */

use Phalcon\Forms\Form;
use Phalcon\Forms\Element\Text;
use Phalcon\Forms\Element\Numeric;
use Phalcon\Forms\Element\Password;


class ModuleTemplateForm extends Form {

	public function initialize( $entity = NULL, $options = NULL ) {
		$this->add( new Text( 'server1chost' ) );
		$this->add( new Numeric( 'server1cport' ) );
		$this->add( new Text( 'login' ) );
		$this->add( new Password( 'secret' ) );
		$this->add( new Text( 'database' ) );

		// is_post
		$cheskarr=array('value'=>null);
		if ($entity->is_post) {
			$cheskarr = array('checked' => 'checked','value'=>null);
		}

		$this->add(new Check('is_post',$cheskarr));

	}
}