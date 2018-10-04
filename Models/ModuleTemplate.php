<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 9 2018
 *
 */

namespace Modules\ModuleTemplate\Models;

use Models\ModelsBase;

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
	 * Имя публикации
	 *
	 * @var string
	 */
	public $database;


	public function getSource() {
		return 'm_ModuleModuleTemplate';
	}

	public function initialize() {
		parent::initialize();

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
	public function getRepresent( $needLink = FALSE ) {
		if ( $this->id === NULL ) {
			return $this->t( 'mo_NewElement' );
		}
		$name = $this->t( 'mo_ModuleModuleTemplate' );;
		if ( $needLink ) {
			$url     = $this->getDI()->getUrl();
			$link    = $url->get( '/admin-cabinet/module-template' );
			$linkLoc = $this->t( 'repLink' );
			$result  = $this->t( 'repModuleModuleTemplate',
				[
					'repesent' => "<a href='{$link}'>{$linkLoc}</a>",
				] );
		} else {
			$result = $name;
		}

		return $result;
	}

	/**
	 * После сохранения данных любой модели
	 */
	public function afterSave() {
		parent::afterSave();
		$this->processSettingsChanges( 'afterSave' );
	}

	/**
	 * После удаления данных любой модели
	 */
	public function afterDelete() {
		parent::afterDelete();
		$this->processSettingsChanges( 'afterDelete' );
	}

	/**
	 * Готовит массив действий для перезапуска модулей ядра системы
	 * и Asterisk
	 * Функция должна вернуть массив перезапускаемых модулей,см.
	 * закомментированные строки ниже. Все варианты перезагрузок см. в
	 * одноименном методе в классе ModelsBase
	 *
	 * @param $action string  быть afterSave или afterDelete
	 */
	private function processSettingsChanges( string $action ) {

		$session = $this->getDI()->getSession();
		if ( php_sapi_name() !== "cli" ) {
			if ( $session->has( "configuration-has-changes" ) ) {
				$previousArr = $session->get( "configuration-has-changes" );
			} else {
				$previousArr = [];
			}

			if ( ! $this->hasSnapshotData() ) {
				return;
			} // нечего менять

			$changedFields = $this->getUpdatedFields();
			if ( empty( $changedFields ) && $action == 'afterSave' ) {
				return;
			}
			// $previousArr['ReloadManagers'] = TRUE;
			// $previousArr['ReloadQueue'] = TRUE;
			// $previousArr['ReloadDialplan'] = TRUE;
			// $previousArr['UpdateCustomFiles'] = TRUE;
			// $previousArr['ReloadSip']      = TRUE;
			// $previousArr['ReloadFirewall'] = TRUE;
			// $previousArr['ReloadIax'] = TRUE;
			// $previousArr['ReloadNetwork'] = TRUE;
			// $previousArr['ReloadSip']     = TRUE;
			// $previousArr['ReloadFeatures'] = TRUE;
			// $previousArr['ReloadManagers'] = TRUE;
			// $previousArr['ReloadSSH'] = TRUE;
			// $previousArr['ReloadNginx'] = TRUE;
			// $previousArr['ReloadCron'] = TRUE;

			$session->set( "configuration-has-changes", $previousArr );
		}
	}

}