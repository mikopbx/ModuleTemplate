/*
 * MikoPBX - free phone system for small business
 * Copyright © 2017-2023 Alexey Portnov and Nikolay Beketov
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

/* global globalRootUrl, globalTranslate, Form, Config */
const ModuleTemplateModify = {
	$formObj: $('#module-template-form'),
	$checkBoxes: $('#module-template-form .ui.checkbox'),
	$dropDowns: $('#module-template-form .ui.dropdown'),

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
					prompt: globalTranslate.module_template_ValidateValueIsEmpty,
				},
			],
		},
		areaField: {
			identifier: 'text_area_field',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.module_template_ValidateValueIsEmpty,
				},
			],
		},
		passwordField: {
			identifier: 'password_field',
			rules: [
				{
					type: 'empty',
					prompt: globalTranslate.module_template_ValidateValueIsEmpty,
				},
			],
		},
	},
	/**
	 * On page load init some Semantic UI library
	 */
	initialize() {
		ModuleTemplateModify.$checkBoxes.checkbox();
		ModuleTemplateModify.$dropDowns.dropdown();
		ModuleTemplateModify.initializeForm();
	},

	/**
	 * We can modify some data before form send
	 * @param settings
	 * @returns {*}
	 */
	cbBeforeSendForm(settings) {
		const result = settings;
		result.data = ModuleTemplateModify.$formObj.form('get values');
		return result;
	},

	/**
	 * Some actions after forms send
	 */
	cbAfterSendForm() {

	},
	/**
	 * Initialize form parameters
	 */
	initializeForm() {
		Form.$formObj = ModuleTemplateModify.$formObj;
		Form.url = `${globalRootUrl}module-template/module-template/save`;
		Form.validateRules = ModuleTemplateModify.validateRules;
		Form.cbBeforeSendForm = ModuleTemplateModify.cbBeforeSendForm;
		Form.cbAfterSendForm = ModuleTemplateModify.cbAfterSendForm;
		Form.initialize();
	},
};

$(document).ready(() => {
	ModuleTemplateModify.initialize();
});

