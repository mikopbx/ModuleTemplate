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

use Models\ModelsBase;
use Phalcon\Mvc\Model\Relation;

class ModuleTemplate extends ModuleBaseClass {

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

	public function getSource() :string {
		return 'm_ModuleTemplate';
	}

	public function initialize() :void{
		parent::initialize();
		$this->hasOne(
			'dropdown_field',
			'Models\Providers',
			'id',
			[
				'alias'      => 'Providers',
				'foreignKey' => [
					'allowNulls' => TRUE,
					'action'     => Relation::NO_ACTION,
				],
			]
		);
	}

	/**
	 * Возвращает структуру подключаемых отношений модуля, которые динамически
	 * подключаеют в ModelsBase при инициализации модуля
	 *
	 * При описании отношений необходимо в foreignKey секцию добавлять атрибут
	 * message в котором указывать алиас после слова Models,
	 * например Models\IvrMenuTimeout, иначе метод getRelated не сможет найти зависимые
	 * записи в моделях
	 */
	public static function getDynamicRelations($calledClass) :array{
		$result = [];
		if ($calledClass === "Models\Providers"){
			$result =[
				'belongsTo'=>[
					'id',
					'Modules\ModuleTemplate\Models\ModuleTemplate',
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