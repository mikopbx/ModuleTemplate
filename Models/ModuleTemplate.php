<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 2 2019
 */
/*
 * https://docs.phalconphp.com/3.4/ru-ru/db-models-metadata
 *
 */


namespace Modules\ModuleTemplate\Models;

use MikoPBX\Common\Models\Providers;
use MikoPBX\Modules\Models\ModulesModelsBase;
use Phalcon\Mvc\Model\Relation;

class ModuleTemplate extends ModulesModelsBase {

    /**
     * @Primary
     * @Identity
     * @Column(type="integer", nullable=false)
     */
	public $id;

	/**
	 * Text field example
	 *
	 * @Column(type="string", nullable=true)
	 */
	public $text_field;

	/**
	 * TextArea field example
	 *
	 * @Column(type="string", nullable=true)
	 */
	public $text_area_field;

	/**
	 * Password field example
	 *
	 * @Column(type="string", nullable=true)
	 */
	public $password_field;

	/**
	 * Integer field example
	 *
	 * @Column(type="integer", default="1", nullable=true)
	 */
	public $integer_field;

	/**
	 * CheckBox
	 *
	 * @Column(type="integer", default="1", nullable=true)
	 */
	public $checkbox_field;

	/**
	 * Toggle
	 *
	 * @Column(type="integer", default="1", nullable=true)
	 */
	public $toggle_field;

	/**
	 * Dropdown menu
	 *
	 * @Column(type="string", nullable=true)
	 */
	public $dropdown_field;

	public function initialize() :void{
        $this->setSource('m_ModuleTemplate');
		$this->hasOne(
			'dropdown_field',
			Providers::class,
			'id',
			[
				'alias'      => 'Providers',
				'foreignKey' => [
					'allowNulls' => TRUE,
					'action'     => Relation::NO_ACTION,
				],
			]
		);
        parent::initialize();
	}

	/**
     * Returns dynamic relations between module models and common models
     * MikoPBX check it in ModelsBase after every call to keep data consistent
     *
     * There is example to describe the relation between Providers and ModuleTemplate models
     *
     * It is important to duplicate the relation alias on message field after Models\ word
     *
     */
	public static function getDynamicRelations($calledClass) :array{
		$result = [];
		if ($calledClass === Providers::class){
			$result =[
				'belongsTo'=>[
					'id',
					ModuleTemplate::class,
					'dropdown_field',
					[
						'alias'=>'ModuleTemplateProvider',
						'foreignKey' => [
							'allowNulls' => 0,
							'message'    => 'Models\ModuleTemplateProvider',
							'action'     => Relation::ACTION_RESTRICT // запретить удалять провайдера если есть ссылки в модуле
						]
					]
				],
			];
		}
		return $result;
	}


}