<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 2 2019
 */

namespace Modules\ModuleTemplate\Models;

use Models\ModelsBase;
use Phalcon\Mvc\Model\Relation;

class ModuleTemplate extends ModelsBase {

	/**
	 * @var integer
	 */
	public $id;

	/**
	 * Адрес сервера 1С
	 *
	 * @var string
	 */
	public $server1chost;

	/**
	 * Порт, где опубликован сервер 1С
	 *
	 * @var integer
	 */
	public $server1cport;

	/**
	 * Логин к вебсервису
	 *
	 * @var string
	 */
	public $login;

	/**
	 * Пароль к вебсервису
	 *
	 * @var string
	 */
	public $secret;

	/**
	 * Резервный Extension, на которой пойдет звонок в случае сбой
	 *
	 * @var string
	 */
	public $failoverextension;

	/**
	 * Имя публикации
	 *
	 * @var string
	 */
	public $database;

	/**
	 * Разрешенная длина для донабора
	 *
	 * @var string
	 */
	public $internalextensiontength;

	/**
	 * Занятый приложением внутренний номер доступный в списках выбора
	 * @var string
	 */
	public $extension;

	/**
	 * JSON с объектами, в которых были ссылки на этот модуль
	 * @return string
	 */
	public $redirection_settings;

	public function getSource() {
		return 'm_ModuleTemplate';
	}

	public function initialize() :void{
		parent::initialize();
		$this->belongsTo(
			'failoverextension',
			'Models\Extensions',
			'number',
			[
				'alias'      => 'ExtensionsFailOver',
				'foreignKey' => [
					'allowNulls' => FALSE,
					'action'     => Relation::NO_ACTION,
				],
			]
		);
		$this->belongsTo(
			'extension',
			'Models\Extensions',
			'number',
			[
				'alias'      => 'Extensions',
				'foreignKey' => [
					'allowNulls' => FALSE,
					'action'     => Relation::NO_ACTION
					//SmartIVR удаляем через его Extension
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
		if ($calledClass === "Models\Extensions"){
			$result =[
				'hasOne'=>[
					'number',
					'Modules\ModuleTemplate\Models\ModuleTemplate',
					'failoverextension',
					[
						'alias'=>'ModuleTemplateFailOver',
						'foreignKey' => [
							'allowNulls' => 0,
							'message'    => 'Models\ModuleTemplateFailOver',
							'action'     => Relation::ACTION_RESTRICT
						]
					]
				],
				'hasOne'=>[
					'number',
					'Modules\ModuleTemplate\Models\ModuleTemplate',
					'extension',
					[
						'alias'=>'ModuleTemplate',
						'foreignKey' => [
							'allowNulls' => 0,
							'message'    => 'Models\ModuleTemplate',
							'action'     => Relation::ACTION_CASCADE
						]
					]
				],
			];
		}
		return $result;
	}

	/**
	 * Возвращает предстваление элемента базы данных
	 *  для сообщения об ошибках с ссылкой на элемент или для выбора в списках
	 *  строкой
	 *
	 * @param bool $needLink - предстваление с ссылкой
	 *
	 * @return string
	 */
	public function getRepresent( $needLink = FALSE ) :string{
		if ( $this->id === NULL ) {
			return $this->t( 'mo_NewElement' );
		}
		$name = $this->t( 'mo_ModuleTemplate' );;
		if ( $needLink ) {
			$url     = $this->getDI()->getUrl();
			$link    = $url->get( 'module-template' );
			$linkLoc = $this->t( 'repLink' );
			$result  = $this->t( 'repModuleTemplate',
				[
					'repesent' => "<a href='{$link}'>{$linkLoc}</a>",
				] );
		} else {
			$result = $name;
		}

		return $result;
	}
}