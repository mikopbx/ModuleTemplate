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

"use strict";

/* global globalRootUrl, globalTranslate, Form, Config */
var ModuleTemplateModify = {
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
      rules: [{
        type: 'empty',
        prompt: globalTranslate.module_template_ValidateValueIsEmpty
      }]
    },
    areaField: {
      identifier: 'text_area_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.module_template_ValidateValueIsEmpty
      }]
    },
    passwordField: {
      identifier: 'password_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.module_template_ValidateValueIsEmpty
      }]
    }
  },

  /**
   * On page load init some Semantic UI library
   */
  initialize: function initialize() {
    ModuleTemplateModify.$checkBoxes.checkbox();
    ModuleTemplateModify.$dropDowns.dropdown();
    ModuleTemplateModify.initializeForm();
  },

  /**
   * We can modify some data before form send
   * @param settings
   * @returns {*}
   */
  cbBeforeSendForm: function cbBeforeSendForm(settings) {
    var result = settings;
    result.data = ModuleTemplateModify.$formObj.form('get values');
    return result;
  },

  /**
   * Some actions after forms send
   */
  cbAfterSendForm: function cbAfterSendForm() {},

  /**
   * Initialize form parameters
   */
  initializeForm: function initializeForm() {
    Form.$formObj = ModuleTemplateModify.$formObj;
    Form.url = "".concat(globalRootUrl, "module-template/module-template/save");
    Form.validateRules = ModuleTemplateModify.validateRules;
    Form.cbBeforeSendForm = ModuleTemplateModify.cbBeforeSendForm;
    Form.cbAfterSendForm = ModuleTemplateModify.cbAfterSendForm;
    Form.initialize();
  }
};
$(document).ready(function () {
  ModuleTemplateModify.initialize();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtbW9kaWZ5LmpzIl0sIm5hbWVzIjpbIk1vZHVsZVRlbXBsYXRlTW9kaWZ5IiwiJGZvcm1PYmoiLCIkIiwiJGNoZWNrQm94ZXMiLCIkZHJvcERvd25zIiwidmFsaWRhdGVSdWxlcyIsInRleHRGaWVsZCIsImlkZW50aWZpZXIiLCJydWxlcyIsInR5cGUiLCJwcm9tcHQiLCJnbG9iYWxUcmFuc2xhdGUiLCJtb2R1bGVfdGVtcGxhdGVfVmFsaWRhdGVWYWx1ZUlzRW1wdHkiLCJhcmVhRmllbGQiLCJwYXNzd29yZEZpZWxkIiwiaW5pdGlhbGl6ZSIsImNoZWNrYm94IiwiZHJvcGRvd24iLCJpbml0aWFsaXplRm9ybSIsImNiQmVmb3JlU2VuZEZvcm0iLCJzZXR0aW5ncyIsInJlc3VsdCIsImRhdGEiLCJmb3JtIiwiY2JBZnRlclNlbmRGb3JtIiwiRm9ybSIsInVybCIsImdsb2JhbFJvb3RVcmwiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBTUEsb0JBQW9CLEdBQUc7QUFDNUJDLEVBQUFBLFFBQVEsRUFBRUMsQ0FBQyxDQUFDLHVCQUFELENBRGlCO0FBRTVCQyxFQUFBQSxXQUFXLEVBQUVELENBQUMsQ0FBQyxvQ0FBRCxDQUZjO0FBRzVCRSxFQUFBQSxVQUFVLEVBQUVGLENBQUMsQ0FBQyxvQ0FBRCxDQUhlOztBQUs1QjtBQUNEO0FBQ0E7QUFDQTtBQUNDRyxFQUFBQSxhQUFhLEVBQUU7QUFDZEMsSUFBQUEsU0FBUyxFQUFFO0FBQ1ZDLE1BQUFBLFVBQVUsRUFBRSxZQURGO0FBRVZDLE1BQUFBLEtBQUssRUFBRSxDQUNOO0FBQ0NDLFFBQUFBLElBQUksRUFBRSxPQURQO0FBRUNDLFFBQUFBLE1BQU0sRUFBRUMsZUFBZSxDQUFDQztBQUZ6QixPQURNO0FBRkcsS0FERztBQVVkQyxJQUFBQSxTQUFTLEVBQUU7QUFDVk4sTUFBQUEsVUFBVSxFQUFFLGlCQURGO0FBRVZDLE1BQUFBLEtBQUssRUFBRSxDQUNOO0FBQ0NDLFFBQUFBLElBQUksRUFBRSxPQURQO0FBRUNDLFFBQUFBLE1BQU0sRUFBRUMsZUFBZSxDQUFDQztBQUZ6QixPQURNO0FBRkcsS0FWRztBQW1CZEUsSUFBQUEsYUFBYSxFQUFFO0FBQ2RQLE1BQUFBLFVBQVUsRUFBRSxnQkFERTtBQUVkQyxNQUFBQSxLQUFLLEVBQUUsQ0FDTjtBQUNDQyxRQUFBQSxJQUFJLEVBQUUsT0FEUDtBQUVDQyxRQUFBQSxNQUFNLEVBQUVDLGVBQWUsQ0FBQ0M7QUFGekIsT0FETTtBQUZPO0FBbkJELEdBVGE7O0FBc0M1QjtBQUNEO0FBQ0E7QUFDQ0csRUFBQUEsVUF6QzRCLHdCQXlDZjtBQUNaZixJQUFBQSxvQkFBb0IsQ0FBQ0csV0FBckIsQ0FBaUNhLFFBQWpDO0FBQ0FoQixJQUFBQSxvQkFBb0IsQ0FBQ0ksVUFBckIsQ0FBZ0NhLFFBQWhDO0FBQ0FqQixJQUFBQSxvQkFBb0IsQ0FBQ2tCLGNBQXJCO0FBQ0EsR0E3QzJCOztBQStDNUI7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNDQyxFQUFBQSxnQkFwRDRCLDRCQW9EWEMsUUFwRFcsRUFvREQ7QUFDMUIsUUFBTUMsTUFBTSxHQUFHRCxRQUFmO0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjdEIsb0JBQW9CLENBQUNDLFFBQXJCLENBQThCc0IsSUFBOUIsQ0FBbUMsWUFBbkMsQ0FBZDtBQUNBLFdBQU9GLE1BQVA7QUFDQSxHQXhEMkI7O0FBMEQ1QjtBQUNEO0FBQ0E7QUFDQ0csRUFBQUEsZUE3RDRCLDZCQTZEVixDQUVqQixDQS9EMkI7O0FBZ0U1QjtBQUNEO0FBQ0E7QUFDQ04sRUFBQUEsY0FuRTRCLDRCQW1FWDtBQUNoQk8sSUFBQUEsSUFBSSxDQUFDeEIsUUFBTCxHQUFnQkQsb0JBQW9CLENBQUNDLFFBQXJDO0FBQ0F3QixJQUFBQSxJQUFJLENBQUNDLEdBQUwsYUFBY0MsYUFBZDtBQUNBRixJQUFBQSxJQUFJLENBQUNwQixhQUFMLEdBQXFCTCxvQkFBb0IsQ0FBQ0ssYUFBMUM7QUFDQW9CLElBQUFBLElBQUksQ0FBQ04sZ0JBQUwsR0FBd0JuQixvQkFBb0IsQ0FBQ21CLGdCQUE3QztBQUNBTSxJQUFBQSxJQUFJLENBQUNELGVBQUwsR0FBdUJ4QixvQkFBb0IsQ0FBQ3dCLGVBQTVDO0FBQ0FDLElBQUFBLElBQUksQ0FBQ1YsVUFBTDtBQUNBO0FBMUUyQixDQUE3QjtBQTZFQWIsQ0FBQyxDQUFDMEIsUUFBRCxDQUFELENBQVlDLEtBQVosQ0FBa0IsWUFBTTtBQUN2QjdCLEVBQUFBLG9CQUFvQixDQUFDZSxVQUFyQjtBQUNBLENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgZ2xvYmFsUm9vdFVybCwgZ2xvYmFsVHJhbnNsYXRlLCBGb3JtLCBDb25maWcgKi9cbmNvbnN0IE1vZHVsZVRlbXBsYXRlTW9kaWZ5ID0ge1xuXHQkZm9ybU9iajogJCgnI21vZHVsZS10ZW1wbGF0ZS1mb3JtJyksXG5cdCRjaGVja0JveGVzOiAkKCcjbW9kdWxlLXRlbXBsYXRlLWZvcm0gLnVpLmNoZWNrYm94JyksXG5cdCRkcm9wRG93bnM6ICQoJyNtb2R1bGUtdGVtcGxhdGUtZm9ybSAudWkuZHJvcGRvd24nKSxcblxuXHQvKipcblx0ICogRmllbGQgdmFsaWRhdGlvbiBydWxlc1xuXHQgKiBodHRwczovL3NlbWFudGljLXVpLmNvbS9iZWhhdmlvcnMvZm9ybS5odG1sXG5cdCAqL1xuXHR2YWxpZGF0ZVJ1bGVzOiB7XG5cdFx0dGV4dEZpZWxkOiB7XG5cdFx0XHRpZGVudGlmaWVyOiAndGV4dF9maWVsZCcsXG5cdFx0XHRydWxlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dHlwZTogJ2VtcHR5Jyxcblx0XHRcdFx0XHRwcm9tcHQ6IGdsb2JhbFRyYW5zbGF0ZS5tb2R1bGVfdGVtcGxhdGVfVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0YXJlYUZpZWxkOiB7XG5cdFx0XHRpZGVudGlmaWVyOiAndGV4dF9hcmVhX2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZHVsZV90ZW1wbGF0ZV9WYWxpZGF0ZVZhbHVlSXNFbXB0eSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHRwYXNzd29yZEZpZWxkOiB7XG5cdFx0XHRpZGVudGlmaWVyOiAncGFzc3dvcmRfZmllbGQnLFxuXHRcdFx0cnVsZXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHR5cGU6ICdlbXB0eScsXG5cdFx0XHRcdFx0cHJvbXB0OiBnbG9iYWxUcmFuc2xhdGUubW9kdWxlX3RlbXBsYXRlX1ZhbGlkYXRlVmFsdWVJc0VtcHR5LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHR9LFxuXHQvKipcblx0ICogT24gcGFnZSBsb2FkIGluaXQgc29tZSBTZW1hbnRpYyBVSSBsaWJyYXJ5XG5cdCAqL1xuXHRpbml0aWFsaXplKCkge1xuXHRcdE1vZHVsZVRlbXBsYXRlTW9kaWZ5LiRjaGVja0JveGVzLmNoZWNrYm94KCk7XG5cdFx0TW9kdWxlVGVtcGxhdGVNb2RpZnkuJGRyb3BEb3ducy5kcm9wZG93bigpO1xuXHRcdE1vZHVsZVRlbXBsYXRlTW9kaWZ5LmluaXRpYWxpemVGb3JtKCk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFdlIGNhbiBtb2RpZnkgc29tZSBkYXRhIGJlZm9yZSBmb3JtIHNlbmRcblx0ICogQHBhcmFtIHNldHRpbmdzXG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKi9cblx0Y2JCZWZvcmVTZW5kRm9ybShzZXR0aW5ncykge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHNldHRpbmdzO1xuXHRcdHJlc3VsdC5kYXRhID0gTW9kdWxlVGVtcGxhdGVNb2RpZnkuJGZvcm1PYmouZm9ybSgnZ2V0IHZhbHVlcycpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFNvbWUgYWN0aW9ucyBhZnRlciBmb3JtcyBzZW5kXG5cdCAqL1xuXHRjYkFmdGVyU2VuZEZvcm0oKSB7XG5cblx0fSxcblx0LyoqXG5cdCAqIEluaXRpYWxpemUgZm9ybSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRpbml0aWFsaXplRm9ybSgpIHtcblx0XHRGb3JtLiRmb3JtT2JqID0gTW9kdWxlVGVtcGxhdGVNb2RpZnkuJGZvcm1PYmo7XG5cdFx0Rm9ybS51cmwgPSBgJHtnbG9iYWxSb290VXJsfW1vZHVsZS10ZW1wbGF0ZS9tb2R1bGUtdGVtcGxhdGUvc2F2ZWA7XG5cdFx0Rm9ybS52YWxpZGF0ZVJ1bGVzID0gTW9kdWxlVGVtcGxhdGVNb2RpZnkudmFsaWRhdGVSdWxlcztcblx0XHRGb3JtLmNiQmVmb3JlU2VuZEZvcm0gPSBNb2R1bGVUZW1wbGF0ZU1vZGlmeS5jYkJlZm9yZVNlbmRGb3JtO1xuXHRcdEZvcm0uY2JBZnRlclNlbmRGb3JtID0gTW9kdWxlVGVtcGxhdGVNb2RpZnkuY2JBZnRlclNlbmRGb3JtO1xuXHRcdEZvcm0uaW5pdGlhbGl6ZSgpO1xuXHR9LFxufTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHRNb2R1bGVUZW1wbGF0ZU1vZGlmeS5pbml0aWFsaXplKCk7XG59KTtcblxuIl19