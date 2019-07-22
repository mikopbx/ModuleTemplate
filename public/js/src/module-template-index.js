/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 11 2018
 *
 */

/* global globalRootUrl,globalTranslate, Form, Config */
const ModuleTemplate = {
	$formObj: $('#module-template-form'),
	$statusToggle: $('#module-status-toggle'),
	validateRules: {
		login: {
			identifier: 'login',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.mod_ct_ValidateUrlEmpty,
				},
			],
		},
	},
	initialize() {
		window.addEventListener('ModuleStatusChanged', ModuleTemplate.checkToggle);
		ModuleTemplate.checkToggle();
		ModuleTemplate.initializeForm();
	},
	/**
	 * Отслеживание состояния переключателя статуса модуля
	 */
	checkToggle() {
		if (ModuleTemplate.$statusToggle.checkbox('is checked')) {
			// Модуль включен
		} else {
			// Модуль отключен
		}
	},
	/**
	 * Применение настроек модуля после изменения данных формы
	 */
	applyConfigurationChanges() {
		$.api({
			url: `${Config.pbxUrl}/pbxcore/api/modules/ModuleTemplate/reload`,
			on: 'now',
			successTest(response) {
				// test whether a JSON response is valid
				return Object.keys(response).length > 0 && response.result.toUpperCase() === 'SUCCESS';
			},
			onSuccess() {

			},
		});
	},
	cbBeforeSendForm(settings) {
		const result = settings;
		result.data = ModuleTemplate.$formObj.form('get values');
		return result;
	},
	cbAfterSendForm() {
		ModuleTemplate.applyConfigurationChanges();
	},
	initializeForm() {
		Form.$formObj = ModuleTemplate.$formObj;
		Form.url = `${globalRootUrl}module-template/save`;
		Form.validateRules = ModuleTemplate.validateRules;
		Form.cbBeforeSendForm = ModuleTemplate.cbBeforeSendForm;
		Form.cbAfterSendForm = ModuleTemplate.cbAfterSendForm;
		Form.initialize();
	},
};

$(document).ready(() => {
	ModuleTemplate.initialize();
});

