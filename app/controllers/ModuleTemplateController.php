<?php
/**
 * Copyright © MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Alexey Portnov, 11 2018
 */

use Modules\ModuleTemplate\Models\ModuleTemplate;

class ModuleTemplateController extends BaseController {

	/**
	 * Инициализация базового класса
	 */
	public function initialize() {
		parent::initialize();
	}

	/**
	 * Форма настроек модуля
	 */
	public function indexAction() {
		$modulesDir       = $this->getDI()->getModulesDir();
		$footerCollection = $this->assets->collection( "footerJS" );
		$footerCollection->addJs( 'js/pbx/main/form.js', TRUE );
		$footerCollection->addJs( "{$modulesDir}/ModuleTemplate/public/js/module-template-index.js",
			TRUE );
		$settings = ModuleTemplate::findFirst();
		if ( $settings == FALSE ) {
			$settings = new ModuleTemplate();
		}

		$this->view->form = new ModuleAutoprovisionForm( $settings );
		$this->view->pick( "{$modulesDir}/ModuleTemplate/app/views/index" );
	}

	/**
	 * Сохранение настроек
	 */
	public function saveAction() {
		if ( ! $this->request->isPost() ) {
			return;
		}
		$data   = $this->request->getPost();
		$record = ModuleTemplate::findFirst();

		if ( ! $record ) {
			$record = new ModuleTemplate();
		}
		$this->db->begin();
		foreach ( $record as $key => $value ) {
			switch ( $key ) {
				case "id":
					break;
				default:
					if ( ! array_key_exists( $key, $data ) ) {
						$record->$key = '';
						continue;
					}
					$record->$key = $data[ $key ];
			}
		}

		if ( $record->save() === FALSE ) {
			$errors = $record->getMessages();
			$this->flash->error( implode( '<br>', $errors ) );
			$this->view->success = FALSE;
			$this->db->rollback();

			return;
		}

		$this->flash->success( $this->translation->_( 'ms_SuccessfulSaved' ) );
		$this->view->success = FALSE;
		$this->db->commit();
	}

}