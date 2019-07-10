<?php
/**
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 9 2018
 *
 */

/**
 * Created by PhpStorm.
 * User: nikolaybeketov
 * Date: 12.09.2018
 * Time: 12:36
 */
class PbxExtensionSetup {

	/**
	 * Создает структуру для хранения настроек модуля в своей модели
	 * и заполняет настройки по-умолчанию если таблицы не было в системе
	 * см (unInstallDB)
	 *
	 * Регистрирует модуль в PbxExtensionModules
	 *
	 * @return bool результат установки
	 */
	function installDB() {
		$result = TRUE;
		$this->db->begin();

		//...код

		if ( $result ) {
			$this->db->commit();
		} else {
			$this->db->rollback();
		}

		return $result;
	}

	/**
	 * Выполняет копирование необходимых файлов, в папки системы
	 *
	 * @return bool результат установки
	 */
	function installFiles() {
		return TRUE;
	}

	/**
	 * Удаляет запись о модуле из PbxExtensionModules
	 * Удаляет свою модель
	 *
	 * @param  $keepSettings - оставляет таблицу с данными своей модели
	 *
	 * @return bool результат очистки
	 */
	function unInstallDB( $keepSettings = FALSE ) {
		$result = TRUE;
		$this->db->begin();

		//...код

		if ( $result ) {
			$this->db->commit();
		} else {
			$this->db->rollback();
		}

		return $result;
	}

	/**
	 * Выполняет удаление своих файлов с остановной процессов
	 * при необходимости
	 *
	 * @return bool результат удаления
	 */
	function unInstallFiles() {
		return TRUE;
	}

}