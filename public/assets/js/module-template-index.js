"use strict";

/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 11 2018
 *
 */

/* global globalRootUrl, globalTranslate, Form, Config */
const idForm    = 'module-template-form';
const className = 'ModuleTemplate';

window[className] = {
  $formObj: $('#'+idForm),
  $checkBoxes: $('#'+idForm+' .ui.checkbox'),
  $dropDowns: $('#'+idForm+' .ui.dropdown'),
  $disabilityFields: $('#'+idForm+'  .disability'),
  $statusToggle: $('#module-status-toggle'),
  $moduleStatus: $('#status'),

  /**
   * Field validation rules
   * https://semantic-ui.com/behaviors/form.html
   */
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

  /**
   * On page load we init some Semantic UI library
   */
  initialize: function () {
    function initialize() {
      console.log('---');
      // инициализируем чекбоксы и выподающие менюшки
      window[className].$checkBoxes.checkbox();
      window[className].$dropDowns.dropdown();
      window[className].checkStatusToggle();
      window.addEventListener('ModuleStatusChanged', window[className].checkStatusToggle);
      window[className].initializeForm();
    }

    return initialize;
  }(),

  /**
   * Change some form elements classes depends of module status
   */
  checkStatusToggle: function () {
    function checkStatusToggle() {
      if (window[className].$statusToggle.checkbox('is checked')) {
        window[className].$disabilityFields.removeClass('disabled');
        window[className].$moduleStatus.show();
      } else {
        window[className].$disabilityFields.addClass('disabled');
        window[className].$moduleStatus.hide();
      }
    }

    return checkStatusToggle;
  }(),

  /**
   * Send command to restart module workers after data changes,
   * Also we can do it on TemplateConf->modelsEventChangeData method
   */
  applyConfigurationChanges: function () {
    function applyConfigurationChanges() {
      window[className].changeStatus('Updating');
      $.api({
        url: "".concat(Config.pbxUrl, "/pbxcore/api/modules/"+className+"/reload"),
        on: 'now',
        successTest: function () {
          function successTest(response) {
            // test whether a JSON response is valid
            return Object.keys(response).length > 0 && response.result === true;
          }

          return successTest;
        }(),
        onSuccess: function () {
          function onSuccess() {
            window[className].changeStatus('Connected');
          }

          return onSuccess;
        }(),
        onFailure: function () {
          function onFailure() {
            window[className].changeStatus('Disconnected');
          }

          return onFailure;
        }()
      });
    }

    return applyConfigurationChanges;
  }(),

  /**
   * We can modify some data before form send
   * @param settings
   * @returns {*}
   */
  cbBeforeSendForm: function () {
    function cbBeforeSendForm(settings) {
      let result = settings;
      result.data = window[className].$formObj.form('get values');
      return result;
    }

    return cbBeforeSendForm;
  }(),

  /**
   * Some actions after forms send
   */
  cbAfterSendForm: function () {
    function cbAfterSendForm() {
      window[className].applyConfigurationChanges();
    }
    return cbAfterSendForm;
  }(),

  /**
   * Initialize form parameters
   */
  initializeForm: function () {
    function initializeForm() {
      Form.$formObj         = window[className].$formObj;
      Form.url              = "".concat(globalRootUrl, "module-template/save");
      Form.validateRules    = window[className].validateRules;
      Form.cbBeforeSendForm = window[className].cbBeforeSendForm;
      Form.cbAfterSendForm  = window[className].cbAfterSendForm;
      Form.initialize();
    }

    return initializeForm;
  }(),

  /**
   * Update the module state on form label
   * @param status
   */
  changeStatus: function () {
    function changeStatus(status) {
      switch (status) {
        case 'Connected':
          window[className].$moduleStatus.removeClass('grey').removeClass('red').addClass('green');
          window[className].$moduleStatus.html(globalTranslate.mod_tpl_Connected);
          break;

        case 'Disconnected':
          window[className].$moduleStatus.removeClass('green').removeClass('red').addClass('grey');
          window[className].$moduleStatus.html(globalTranslate.mod_tpl_Disconnected);
          break;

        case 'Updating':
          window[className].$moduleStatus.removeClass('green').removeClass('red').addClass('grey');
          window[className].$moduleStatus.html("<i class=\"spinner loading icon\"></i>".concat(globalTranslate.mod_tpl_UpdateStatus));
          break;

        default:
          window[className].$moduleStatus.removeClass('green').removeClass('red').addClass('grey');
          window[className].$moduleStatus.html(globalTranslate.mod_tpl_Disconnected);
          break;
      }
    }

    return changeStatus;
  }()
};
$(document).ready(function () {
  window[className].initialize();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtaW5kZXguanMiXSwibmFtZXMiOlsiTW9kdWxlVGVtcGxhdGUiLCIkZm9ybU9iaiIsIiQiLCIkY2hlY2tCb3hlcyIsIiRkcm9wRG93bnMiLCIkZGlzYWJpbGl0eUZpZWxkcyIsIiRzdGF0dXNUb2dnbGUiLCIkbW9kdWxlU3RhdHVzIiwidmFsaWRhdGVSdWxlcyIsInRleHRGaWVsZCIsImlkZW50aWZpZXIiLCJydWxlcyIsInR5cGUiLCJwcm9tcHQiLCJnbG9iYWxUcmFuc2xhdGUiLCJtb2RfdHBsVmFsaWRhdGVWYWx1ZUlzRW1wdHkiLCJhcmVhRmllbGQiLCJwYXNzd29yZEZpZWxkIiwiaW5pdGlhbGl6ZSIsImNoZWNrYm94IiwiZHJvcGRvd24iLCJjaGVja1N0YXR1c1RvZ2dsZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0aWFsaXplRm9ybSIsInJlbW92ZUNsYXNzIiwic2hvdyIsImFkZENsYXNzIiwiaGlkZSIsImFwcGx5Q29uZmlndXJhdGlvbkNoYW5nZXMiLCJjaGFuZ2VTdGF0dXMiLCJhcGkiLCJ1cmwiLCJDb25maWciLCJwYnhVcmwiLCJvbiIsInN1Y2Nlc3NUZXN0IiwicmVzcG9uc2UiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwicmVzdWx0Iiwib25TdWNjZXNzIiwib25GYWlsdXJlIiwiY2JCZWZvcmVTZW5kRm9ybSIsInNldHRpbmdzIiwiZGF0YSIsImZvcm0iLCJjYkFmdGVyU2VuZEZvcm0iLCJGb3JtIiwiZ2xvYmFsUm9vdFVybCIsInN0YXR1cyIsImh0bWwiLCJtb2RfdHBsX0Nvbm5lY3RlZCIsIm1vZF90cGxfRGlzY29ubmVjdGVkIiwibW9kX3RwbF9VcGRhdGVTdGF0dXMiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7OztBQVFBO0FBRUEsSUFBTUEsY0FBYyxHQUFHO0FBQ3RCQyxFQUFBQSxRQUFRLEVBQUVDLENBQUMsQ0FBQyx1QkFBRCxDQURX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RUFFRUEsV0FGRixDQUVjLEtBRmQsRUFHRUUsUUFIRixDQUdXLE9BSFg7QUFJQTNCLFVBQUFBLGNBQWMsQ0FBQ08sYUFBZixDQUE2QjZDLElBQTdCLENBQWtDdEMsZUFBZSxDQUFDdUMsaUJBQWxEO0FBQ0E7O0FBQ0QsYUFBSyxjQUFMO0FBQ0NyRCxVQUFBQSxjQUFjLENBQUNPLGFBQWYsQ0FDRWtCLFdBREYsQ0FDYyxPQURkLEVBRUVBLFdBRkYsQ0FFYyxLQUZkLEVBR0VFLFFBSEYsQ0FHVyxNQUhYO0FBSUEzQixVQUFBQSxjQUFjLENBQUNPLGFBQWYsQ0FBNkI2QyxJQUE3QixDQUFrQ3RDLGVBQWUsQ0FBQ3dDLG9CQUFsRDtBQUNBOztBQUNELGFBQUssVUFBTDtBQUNDdEQsVUFBQUEsY0FBYyxDQUFDTyxhQUFmLENBQ0VrQixXQURGLENBQ2MsT0FEZCxFQUVFQSxXQUZGLENBRWMsS0FGZCxFQUdFRSxRQUhGLENBR1csTUFIWDtBQUlBM0IsVUFBQUEsY0FBYyxDQUFDTyxhQUFmLENBQTZCNkMsSUFBN0IsaURBQXlFdEMsZUFBZSxDQUFDeUMsb0JBQXpGO0FBQ0E7O0FBQ0Q7QUFDQ3ZELFVBQUFBLGNBQWMsQ0FBQ08sYUFBZixDQUNFa0IsV0FERixDQUNjLE9BRGQsRUFFRUEsV0FGRixDQUVjLEtBRmQsRUFHRUUsUUFIRixDQUdXLE1BSFg7QUFJQTNCLFVBQUFBLGNBQWMsQ0FBQ08sYUFBZixDQUE2QjZDLElBQTdCLENBQWtDdEMsZUFBZSxDQUFDd0Msb0JBQWxEO0FBQ0E7QUE1QkY7QUE4QkE7O0FBbEpxQjtBQUFBO0FBQUEsQ0FBdkI7QUFxSkFwRCxDQUFDLENBQUNzRCxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFNO0FBQ3ZCekQsRUFBQUEsY0FBYyxDQUFDa0IsVUFBZjtBQUNBLENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChDKSBNSUtPIExMQyAtIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqIFVuYXV0aG9yaXplZCBjb3B5aW5nIG9mIHRoaXMgZmlsZSwgdmlhIGFueSBtZWRpdW0gaXMgc3RyaWN0bHkgcHJvaGliaXRlZFxuICogUHJvcHJpZXRhcnkgYW5kIGNvbmZpZGVudGlhbFxuICogV3JpdHRlbiBieSBOaWtvbGF5IEJla2V0b3YsIDExIDIwMThcbiAqXG4gKi9cblxuLyogZ2xvYmFsIGdsb2JhbFJvb3RVcmwsIGdsb2JhbFRyYW5zbGF0ZSwgRm9ybSwgQ29uZmlnICovXG5cbmNvbnN0IE1vZHVsZVRlbXBsYXRlID0ge1xuXHQkZm9ybU9iajogJCgnI21vZHVsZS10ZW1wbGF0ZS1mb3JtJyksXG5cdCRjaGVja0JveGVzOiAkKCcjbW9kdWxlLXRlbXBsYXRlLWZvcm0gLnVpLmNoZWNrYm94JyksXG5cdCRkcm9wRG93bnM6ICQoJyNtb2R1bGUtdGVtcGxhdGUtZm9ybSAudWkuZHJvcGRvd24nKSxcblx0JGRpc2FiaWxpdHlGaWVsZHM6ICQoJyNtb2R1bGUtdGVtcGxhdGUtZm9ybSAgLmRpc2FiaWxpdHknKSxcblx0JHN0YXR1c1RvZ2dsZTogJCgnI21vZHVsZS1zdGF0dXMtdG9nZ2xlJyksXG5cdCRtb2R1bGVTdGF0dXM6ICQoJyNzdGF0dXMnKSxcblx0LyoqXG5cdCAqIEZpZWxkIHZhbGlkYXRpb24gcnVsZXNcblx0ICogaHR0cHM6Ly9zZW1hbnRpYy11aS5jb20vYmVoYXZpb3JzL2Zvcm0uaHRtbFxuXHQgKi9cblx0dmFsaWRhdGVSdWxlczoge1xuXHRcdHRleHRGaWVsZDoge1xuXHRcdFx0aWRlbnRpZmllcjogJ3RleHRfZmllbGQnLFxuXHRcdFx0cnVsZXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHR5cGU6ICdlbXB0eScsXG5cdFx0XHRcdFx0cHJvbXB0OiBnbG9iYWxUcmFuc2xhdGUubW9kX3RwbFZhbGlkYXRlVmFsdWVJc0VtcHR5LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdGFyZWFGaWVsZDoge1xuXHRcdFx0aWRlbnRpZmllcjogJ3RleHRfYXJlYV9maWVsZCcsXG5cdFx0XHRydWxlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dHlwZTogJ2VtcHR5Jyxcblx0XHRcdFx0XHRwcm9tcHQ6IGdsb2JhbFRyYW5zbGF0ZS5tb2RfdHBsVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0cGFzc3dvcmRGaWVsZDoge1xuXHRcdFx0aWRlbnRpZmllcjogJ3Bhc3N3b3JkX2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxWYWxpZGF0ZVZhbHVlSXNFbXB0eSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0fSxcblx0LyoqXG5cdCAqIE9uIHBhZ2UgbG9hZCB3ZSBpbml0IHNvbWUgU2VtYW50aWMgVUkgbGlicmFyeVxuXHQgKi9cblx0aW5pdGlhbGl6ZSgpIHtcblx0XHQvLyDQuNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INGH0LXQutCx0L7QutGB0Ysg0Lgg0LLRi9C/0L7QtNCw0Y7RidC40LUg0LzQtdC90Y7RiNC60Lhcblx0XHRNb2R1bGVUZW1wbGF0ZS4kY2hlY2tCb3hlcy5jaGVja2JveCgpO1xuXHRcdE1vZHVsZVRlbXBsYXRlLiRkcm9wRG93bnMuZHJvcGRvd24oKTtcblx0XHRNb2R1bGVUZW1wbGF0ZS5jaGVja1N0YXR1c1RvZ2dsZSgpO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdNb2R1bGVTdGF0dXNDaGFuZ2VkJywgTW9kdWxlVGVtcGxhdGUuY2hlY2tTdGF0dXNUb2dnbGUpO1xuXHRcdE1vZHVsZVRlbXBsYXRlLmluaXRpYWxpemVGb3JtKCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBDaGFuZ2Ugc29tZSBmb3JtIGVsZW1lbnRzIGNsYXNzZXMgZGVwZW5kcyBvZiBtb2R1bGUgc3RhdHVzXG5cdCAqL1xuXHRjaGVja1N0YXR1c1RvZ2dsZSgpIHtcblx0XHRpZiAoTW9kdWxlVGVtcGxhdGUuJHN0YXR1c1RvZ2dsZS5jaGVja2JveCgnaXMgY2hlY2tlZCcpKSB7XG5cdFx0XHRNb2R1bGVUZW1wbGF0ZS4kZGlzYWJpbGl0eUZpZWxkcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdE1vZHVsZVRlbXBsYXRlLiRtb2R1bGVTdGF0dXMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRNb2R1bGVUZW1wbGF0ZS4kZGlzYWJpbGl0eUZpZWxkcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdE1vZHVsZVRlbXBsYXRlLiRtb2R1bGVTdGF0dXMuaGlkZSgpO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIFNlbmQgY29tbWFuZCB0byByZXN0YXJ0IG1vZHVsZSB3b3JrZXJzIGFmdGVyIGRhdGEgY2hhbmdlcyxcblx0ICogQWxzbyB3ZSBjYW4gZG8gaXQgb24gVGVtcGxhdGVDb25mLT5tb2RlbHNFdmVudENoYW5nZURhdGEgbWV0aG9kXG5cdCAqL1xuXHRhcHBseUNvbmZpZ3VyYXRpb25DaGFuZ2VzKCkge1xuXHRcdE1vZHVsZVRlbXBsYXRlLmNoYW5nZVN0YXR1cygnVXBkYXRpbmcnKTtcblx0XHQkLmFwaSh7XG5cdFx0XHR1cmw6IGAke0NvbmZpZy5wYnhVcmx9L3BieGNvcmUvYXBpL21vZHVsZXMvTW9kdWxlVGVtcGxhdGUvcmVsb2FkYCxcblx0XHRcdG9uOiAnbm93Jyxcblx0XHRcdHN1Y2Nlc3NUZXN0KHJlc3BvbnNlKSB7XG5cdFx0XHRcdC8vIHRlc3Qgd2hldGhlciBhIEpTT04gcmVzcG9uc2UgaXMgdmFsaWRcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKHJlc3BvbnNlKS5sZW5ndGggPiAwICYmIHJlc3BvbnNlLnJlc3VsdCA9PT0gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRvblN1Y2Nlc3MoKSB7XG5cdFx0XHRcdE1vZHVsZVRlbXBsYXRlLmNoYW5nZVN0YXR1cygnQ29ubmVjdGVkJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25GYWlsdXJlKCkge1xuXHRcdFx0XHRNb2R1bGVUZW1wbGF0ZS5jaGFuZ2VTdGF0dXMoJ0Rpc2Nvbm5lY3RlZCcpO1xuXHRcdFx0fSxcblx0XHR9KTtcblx0fSxcblx0LyoqXG5cdCAqIFdlIGNhbiBtb2RpZnkgc29tZSBkYXRhIGJlZm9yZSBmb3JtIHNlbmRcblx0ICogQHBhcmFtIHNldHRpbmdzXG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKi9cblx0Y2JCZWZvcmVTZW5kRm9ybShzZXR0aW5ncykge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHNldHRpbmdzO1xuXHRcdHJlc3VsdC5kYXRhID0gTW9kdWxlVGVtcGxhdGUuJGZvcm1PYmouZm9ybSgnZ2V0IHZhbHVlcycpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cdC8qKlxuXHQgKiBTb21lIGFjdGlvbnMgYWZ0ZXIgZm9ybXMgc2VuZFxuXHQgKi9cblx0Y2JBZnRlclNlbmRGb3JtKCkge1xuXHRcdE1vZHVsZVRlbXBsYXRlLmFwcGx5Q29uZmlndXJhdGlvbkNoYW5nZXMoKTtcblx0fSxcblx0LyoqXG5cdCAqIEluaXRpYWxpemUgZm9ybSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRpbml0aWFsaXplRm9ybSgpIHtcblx0XHRGb3JtLiRmb3JtT2JqID0gTW9kdWxlVGVtcGxhdGUuJGZvcm1PYmo7XG5cdFx0Rm9ybS51cmwgPSBgJHtnbG9iYWxSb290VXJsfW1vZHVsZS10ZW1wbGF0ZS9zYXZlYDtcblx0XHRGb3JtLnZhbGlkYXRlUnVsZXMgPSBNb2R1bGVUZW1wbGF0ZS52YWxpZGF0ZVJ1bGVzO1xuXHRcdEZvcm0uY2JCZWZvcmVTZW5kRm9ybSA9IE1vZHVsZVRlbXBsYXRlLmNiQmVmb3JlU2VuZEZvcm07XG5cdFx0Rm9ybS5jYkFmdGVyU2VuZEZvcm0gPSBNb2R1bGVUZW1wbGF0ZS5jYkFmdGVyU2VuZEZvcm07XG5cdFx0Rm9ybS5pbml0aWFsaXplKCk7XG5cdH0sXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIG1vZHVsZSBzdGF0ZSBvbiBmb3JtIGxhYmVsXG5cdCAqIEBwYXJhbSBzdGF0dXNcblx0ICovXG5cdGNoYW5nZVN0YXR1cyhzdGF0dXMpIHtcblx0XHRzd2l0Y2ggKHN0YXR1cykge1xuXHRcdFx0Y2FzZSAnQ29ubmVjdGVkJzpcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1c1xuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnZ3JleScpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdyZWQnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnZ3JlZW4nKTtcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1cy5odG1sKGdsb2JhbFRyYW5zbGF0ZS5tb2RfdHBsX0Nvbm5lY3RlZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnRGlzY29ubmVjdGVkJzpcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1c1xuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnZ3JlZW4nKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygncmVkJylcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2dyZXknKTtcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1cy5odG1sKGdsb2JhbFRyYW5zbGF0ZS5tb2RfdHBsX0Rpc2Nvbm5lY3RlZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnVXBkYXRpbmcnOlxuXHRcdFx0XHRNb2R1bGVUZW1wbGF0ZS4kbW9kdWxlU3RhdHVzXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdncmVlbicpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdyZWQnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnZ3JleScpO1xuXHRcdFx0XHRNb2R1bGVUZW1wbGF0ZS4kbW9kdWxlU3RhdHVzLmh0bWwoYDxpIGNsYXNzPVwic3Bpbm5lciBsb2FkaW5nIGljb25cIj48L2k+JHtnbG9iYWxUcmFuc2xhdGUubW9kX3RwbF9VcGRhdGVTdGF0dXN9YCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1c1xuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnZ3JlZW4nKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygncmVkJylcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2dyZXknKTtcblx0XHRcdFx0TW9kdWxlVGVtcGxhdGUuJG1vZHVsZVN0YXR1cy5odG1sKGdsb2JhbFRyYW5zbGF0ZS5tb2RfdHBsX0Rpc2Nvbm5lY3RlZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSxcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0TW9kdWxlVGVtcGxhdGUuaW5pdGlhbGl6ZSgpO1xufSk7XG5cbiJdfQ==