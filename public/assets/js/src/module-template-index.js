/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 11 2018
 *
 */

/* global globalRootUrl, globalTranslate, Form, Config */

const ModuleTemplate = {
	$formObj: $('#module-template-form'),
	$checkBoxes: $('#module-template-form .ui.checkbox'),
	$dropDowns: $('#module-template-form .ui.dropdown'),
	$disabilityFields: $('#module-template-form  .disability'),
	$statusToggle: $('#module-status-toggle'),
	$moduleStatus: $('#status'),
	/**
	 * Field validation rules
	 * https://semantic-ui.com/behaviors/form.html
	 */
	validateRules: {
		textField: {
			identifier: 'text_field',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.mod_tplValidateValueIsEmpty,
				},
			],
		},
		areaField: {
			identifier: 'text_area_field',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.mod_tplValidateValueIsEmpty,
				},
			],
		},
		passwordField: {
			identifier: 'password_field',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.mod_tplValidateValueIsEmpty,
				},
			],
		},
	},
	/**
	 * On page load we init some Semantic UI library
	 */
	initialize() {
		// инициализируем чекбоксы и выподающие менюшки
		ModuleTemplate.$checkBoxes.checkbox();
		ModuleTemplate.$dropDowns.dropdown();
		ModuleTemplate.checkStatusToggle();
		window.addEventListener('ModuleStatusChanged', ModuleTemplate.checkStatusToggle);
		ModuleTemplate.initializeForm();
	},
	/**
	 * Change some form elements classes depends of module status
	 */
	checkStatusToggle() {
		if (ModuleTemplate.$statusToggle.checkbox('is checked')) {
			ModuleTemplate.$disabilityFields.removeClass('disabled');
			ModuleTemplate.$moduleStatus.show();
		} else {
			ModuleTemplate.$disabilityFields.addClass('disabled');
			ModuleTemplate.$moduleStatus.hide();
		}
	},
	/**
	 * Send command to restart module workers after data changes,
	 * Also we can do it on TemplateConf->modelsEventChangeData method
	 */
	applyConfigurationChanges() {
		ModuleTemplate.changeStatus('Updating');
		$.api({
			url: `${Config.pbxUrl}/pbxcore/api/modules/ModuleTemplate/reload`,
			on: 'now',
			successTest(response) {
				// test whether a JSON response is valid
				return Object.keys(response).length > 0 && response.result === true;
			},
			onSuccess() {
				ModuleTemplate.changeStatus('Connected');
			},
			onFailure() {
				ModuleTemplate.changeStatus('Disconnected');
			},
		});
	},
	/**
	 * We can modify some data before form send
	 * @param settings
	 * @returns {*}
	 */
	cbBeforeSendForm(settings) {
		const result = settings;
		result.data = ModuleTemplate.$formObj.form('get values');
		return result;
	},
	/**
	 * Some actions after forms send
	 */
	cbAfterSendForm() {
		ModuleTemplate.applyConfigurationChanges();
	},
	/**
	 * Initialize form parameters
	 */
	initializeForm() {
		Form.$formObj = ModuleTemplate.$formObj;
		Form.url = `${globalRootUrl}module-template/save`;
		Form.validateRules = ModuleTemplate.validateRules;
		Form.cbBeforeSendForm = ModuleTemplate.cbBeforeSendForm;
		Form.cbAfterSendForm = ModuleTemplate.cbAfterSendForm;
		Form.initialize();
	},
	/**
	 * Update the module state on form label
	 * @param status
	 */
	changeStatus(status) {
		switch (status) {
			case 'Connected':
				ModuleTemplate.$moduleStatus
					.removeClass('grey')
					.removeClass('red')
					.addClass('green');
				ModuleTemplate.$moduleStatus.html(globalTranslate.mod_tpl_Connected);
				break;
			case 'Disconnected':
				ModuleTemplate.$moduleStatus
					.removeClass('green')
					.removeClass('red')
					.addClass('grey');
				ModuleTemplate.$moduleStatus.html(globalTranslate.mod_tpl_Disconnected);
				break;
			case 'Updating':
				ModuleTemplate.$moduleStatus
					.removeClass('green')
					.removeClass('red')
					.addClass('grey');
				ModuleTemplate.$moduleStatus.html(`<i class="spinner loading icon"></i>${globalTranslate.mod_tpl_UpdateStatus}`);
				break;
			default:
				ModuleTemplate.$moduleStatus
					.removeClass('green')
					.removeClass('red')
					.addClass('grey');
				ModuleTemplate.$moduleStatus.html(globalTranslate.mod_tpl_Disconnected);
				break;
		}
	},
};

$(document).ready(() => {
	ModuleTemplate.initialize();
});

