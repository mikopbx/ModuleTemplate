"use strict";

/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 11 2018
 *
 */

/* global globalRootUrl,globalTranslate, Form, Config */
var ModuleTemplate = {
  $formObj: $('#module-template-form'),
  $checkBoxes: $('#module-template-form .ui.checkbox'),
  $dropDowns: $('#module-template-form .ui.dropdown'),
  $disabilityFields: $('#module-template-form  .disability'),
  $statusToggle: $('#module-status-toggle'),
  $moduleStatus: $('#status'),
  validateRules: {
    textField: {
      identifier: 'text_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.mod_tplValidateValueIsEmpty
      }]
    },
    areaField: {
      identifier: 'text_area_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.mod_tplValidateValueIsEmpty
      }]
    },
    passwordField: {
      identifier: 'password_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.mod_tplValidateValueIsEmpty
      }]
    }
  },
  initialize: function () {
    function initialize() {
      // инициализируем чекбоксы и выподающие менюшки
      ModuleTemplate.$checkBoxes.checkbox();
      ModuleTemplate.$dropDowns.dropdown();
      ModuleTemplate.checkStatusToggle();
      window.addEventListener('ModuleStatusChanged', ModuleTemplate.checkStatusToggle);
      ModuleTemplate.initializeForm();
    }

    return initialize;
  }(),

  /**
   * Изменение статуса кнопок при изменении статуса модуля
   */
  checkStatusToggle: function () {
    function checkStatusToggle() {
      if (ModuleTemplate.$statusToggle.checkbox('is checked')) {
        ModuleTemplate.$disabilityFields.removeClass('disabled');
        ModuleTemplate.$moduleStatus.show();
      } else {
        ModuleTemplate.$disabilityFields.addClass('disabled');
        ModuleTemplate.$moduleStatus.hide();
      }
    }

    return checkStatusToggle;
  }(),

  /**
   * Применение настроек модуля после изменения данных формы
   */
  applyConfigurationChanges: function () {
    function applyConfigurationChanges() {
      $.api({
        url: "".concat(Config.pbxUrl, "/pbxcore/api/modules/ModuleTemplate/reload"),
        on: 'now',
        successTest: function () {
          function successTest(response) {
            // test whether a JSON response is valid
            return Object.keys(response).length > 0 && response.result.toUpperCase() === 'SUCCESS';
          }

          return successTest;
        }(),
        onSuccess: function () {
          function onSuccess() {
            ModuleTemplate.$moduleStatus.removeClass('grey').addClass('green');
            ModuleTemplate.$moduleStatus.html(globalTranslate.mod_tpl_Connected);
          }

          return onSuccess;
        }(),
        onFailure: function () {
          function onFailure() {
            ModuleTemplate.$moduleStatus.removeClass('green').addClass('grey');
            ModuleTemplate.$moduleStatus.html(globalTranslate.mod_tpl_Disconnected);
          }

          return onFailure;
        }()
      });
    }

    return applyConfigurationChanges;
  }(),
  cbBeforeSendForm: function () {
    function cbBeforeSendForm(settings) {
      var result = settings;
      result.data = ModuleTemplate.$formObj.form('get values');
      return result;
    }

    return cbBeforeSendForm;
  }(),
  cbAfterSendForm: function () {
    function cbAfterSendForm() {
      ModuleTemplate.applyConfigurationChanges();
    }

    return cbAfterSendForm;
  }(),
  initializeForm: function () {
    function initializeForm() {
      Form.$formObj = ModuleTemplate.$formObj;
      Form.url = "".concat(globalRootUrl, "module-template/save");
      Form.validateRules = ModuleTemplate.validateRules;
      Form.cbBeforeSendForm = ModuleTemplate.cbBeforeSendForm;
      Form.cbAfterSendForm = ModuleTemplate.cbAfterSendForm;
      Form.initialize();
    }

    return initializeForm;
  }()
};
$(document).ready(function () {
  ModuleTemplate.initialize();
});
//# sourceMappingURL=module-template-index.js.map