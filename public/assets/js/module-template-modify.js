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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtbW9kaWZ5LmpzIl0sIm5hbWVzIjpbIk1vZHVsZVRlbXBsYXRlTW9kaWZ5IiwiJGZvcm1PYmoiLCIkIiwiJGNoZWNrQm94ZXMiLCIkZHJvcERvd25zIiwidmFsaWRhdGVSdWxlcyIsInRleHRGaWVsZCIsImlkZW50aWZpZXIiLCJydWxlcyIsInR5cGUiLCJwcm9tcHQiLCJnbG9iYWxUcmFuc2xhdGUiLCJtb2R1bGVfdGVtcGxhdGVfVmFsaWRhdGVWYWx1ZUlzRW1wdHkiLCJhcmVhRmllbGQiLCJwYXNzd29yZEZpZWxkIiwiaW5pdGlhbGl6ZSIsImNoZWNrYm94IiwiZHJvcGRvd24iLCJpbml0aWFsaXplRm9ybSIsImNiQmVmb3JlU2VuZEZvcm0iLCJzZXR0aW5ncyIsInJlc3VsdCIsImRhdGEiLCJmb3JtIiwiY2JBZnRlclNlbmRGb3JtIiwiRm9ybSIsInVybCIsImdsb2JhbFJvb3RVcmwiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFNQSxvQkFBb0IsR0FBRztBQUM1QkMsRUFBQUEsUUFBUSxFQUFFQyxDQUFDLENBQUMsdUJBQUQsQ0FEaUI7QUFFNUJDLEVBQUFBLFdBQVcsRUFBRUQsQ0FBQyxDQUFDLG9DQUFELENBRmM7QUFHNUJFLEVBQUFBLFVBQVUsRUFBRUYsQ0FBQyxDQUFDLG9DQUFELENBSGU7O0FBSzVCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0NHLEVBQUFBLGFBQWEsRUFBRTtBQUNkQyxJQUFBQSxTQUFTLEVBQUU7QUFDVkMsTUFBQUEsVUFBVSxFQUFFLFlBREY7QUFFVkMsTUFBQUEsS0FBSyxFQUFFLENBQ047QUFDQ0MsUUFBQUEsSUFBSSxFQUFFLE9BRFA7QUFFQ0MsUUFBQUEsTUFBTSxFQUFFQyxlQUFlLENBQUNDO0FBRnpCLE9BRE07QUFGRyxLQURHO0FBVWRDLElBQUFBLFNBQVMsRUFBRTtBQUNWTixNQUFBQSxVQUFVLEVBQUUsaUJBREY7QUFFVkMsTUFBQUEsS0FBSyxFQUFFLENBQ047QUFDQ0MsUUFBQUEsSUFBSSxFQUFFLE9BRFA7QUFFQ0MsUUFBQUEsTUFBTSxFQUFFQyxlQUFlLENBQUNDO0FBRnpCLE9BRE07QUFGRyxLQVZHO0FBbUJkRSxJQUFBQSxhQUFhLEVBQUU7QUFDZFAsTUFBQUEsVUFBVSxFQUFFLGdCQURFO0FBRWRDLE1BQUFBLEtBQUssRUFBRSxDQUNOO0FBQ0NDLFFBQUFBLElBQUksRUFBRSxPQURQO0FBRUNDLFFBQUFBLE1BQU0sRUFBRUMsZUFBZSxDQUFDQztBQUZ6QixPQURNO0FBRk87QUFuQkQsR0FUYTs7QUFzQzVCO0FBQ0Q7QUFDQTtBQUNDRyxFQUFBQSxVQXpDNEIsd0JBeUNmO0FBQ1pmLElBQUFBLG9CQUFvQixDQUFDRyxXQUFyQixDQUFpQ2EsUUFBakM7QUFDQWhCLElBQUFBLG9CQUFvQixDQUFDSSxVQUFyQixDQUFnQ2EsUUFBaEM7QUFDQWpCLElBQUFBLG9CQUFvQixDQUFDa0IsY0FBckI7QUFDQSxHQTdDMkI7O0FBK0M1QjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0NDLEVBQUFBLGdCQXBENEIsNEJBb0RYQyxRQXBEVyxFQW9ERDtBQUMxQixRQUFNQyxNQUFNLEdBQUdELFFBQWY7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxJQUFQLEdBQWN0QixvQkFBb0IsQ0FBQ0MsUUFBckIsQ0FBOEJzQixJQUE5QixDQUFtQyxZQUFuQyxDQUFkO0FBQ0EsV0FBT0YsTUFBUDtBQUNBLEdBeEQyQjs7QUEwRDVCO0FBQ0Q7QUFDQTtBQUNDRyxFQUFBQSxlQTdENEIsNkJBNkRWLENBRWpCLENBL0QyQjs7QUFnRTVCO0FBQ0Q7QUFDQTtBQUNDTixFQUFBQSxjQW5FNEIsNEJBbUVYO0FBQ2hCTyxJQUFBQSxJQUFJLENBQUN4QixRQUFMLEdBQWdCRCxvQkFBb0IsQ0FBQ0MsUUFBckM7QUFDQXdCLElBQUFBLElBQUksQ0FBQ0MsR0FBTCxhQUFjQyxhQUFkO0FBQ0FGLElBQUFBLElBQUksQ0FBQ3BCLGFBQUwsR0FBcUJMLG9CQUFvQixDQUFDSyxhQUExQztBQUNBb0IsSUFBQUEsSUFBSSxDQUFDTixnQkFBTCxHQUF3Qm5CLG9CQUFvQixDQUFDbUIsZ0JBQTdDO0FBQ0FNLElBQUFBLElBQUksQ0FBQ0QsZUFBTCxHQUF1QnhCLG9CQUFvQixDQUFDd0IsZUFBNUM7QUFDQUMsSUFBQUEsSUFBSSxDQUFDVixVQUFMO0FBQ0E7QUExRTJCLENBQTdCO0FBNkVBYixDQUFDLENBQUMwQixRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFNO0FBQ3ZCN0IsRUFBQUEsb0JBQW9CLENBQUNlLFVBQXJCO0FBQ0EsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBNaWtvUEJYIC0gZnJlZSBwaG9uZSBzeXN0ZW0gZm9yIHNtYWxsIGJ1c2luZXNzXG4gKiBDb3B5cmlnaHQgwqkgMjAxNy0yMDIzIEFsZXhleSBQb3J0bm92IGFuZCBOaWtvbGF5IEJla2V0b3ZcbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb247IGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uXG4gKiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8qIGdsb2JhbCBnbG9iYWxSb290VXJsLCBnbG9iYWxUcmFuc2xhdGUsIEZvcm0sIENvbmZpZyAqL1xuY29uc3QgTW9kdWxlVGVtcGxhdGVNb2RpZnkgPSB7XG5cdCRmb3JtT2JqOiAkKCcjbW9kdWxlLXRlbXBsYXRlLWZvcm0nKSxcblx0JGNoZWNrQm94ZXM6ICQoJyNtb2R1bGUtdGVtcGxhdGUtZm9ybSAudWkuY2hlY2tib3gnKSxcblx0JGRyb3BEb3duczogJCgnI21vZHVsZS10ZW1wbGF0ZS1mb3JtIC51aS5kcm9wZG93bicpLFxuXG5cdC8qKlxuXHQgKiBGaWVsZCB2YWxpZGF0aW9uIHJ1bGVzXG5cdCAqIGh0dHBzOi8vc2VtYW50aWMtdWkuY29tL2JlaGF2aW9ycy9mb3JtLmh0bWxcblx0ICovXG5cdHZhbGlkYXRlUnVsZXM6IHtcblx0XHR0ZXh0RmllbGQ6IHtcblx0XHRcdGlkZW50aWZpZXI6ICd0ZXh0X2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZHVsZV90ZW1wbGF0ZV9WYWxpZGF0ZVZhbHVlSXNFbXB0eSxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fSxcblx0XHRhcmVhRmllbGQ6IHtcblx0XHRcdGlkZW50aWZpZXI6ICd0ZXh0X2FyZWFfZmllbGQnLFxuXHRcdFx0cnVsZXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHR5cGU6ICdlbXB0eScsXG5cdFx0XHRcdFx0cHJvbXB0OiBnbG9iYWxUcmFuc2xhdGUubW9kdWxlX3RlbXBsYXRlX1ZhbGlkYXRlVmFsdWVJc0VtcHR5LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHR9LFxuXHRcdHBhc3N3b3JkRmllbGQ6IHtcblx0XHRcdGlkZW50aWZpZXI6ICdwYXNzd29yZF9maWVsZCcsXG5cdFx0XHRydWxlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dHlwZTogJ2VtcHR5Jyxcblx0XHRcdFx0XHRwcm9tcHQ6IGdsb2JhbFRyYW5zbGF0ZS5tb2R1bGVfdGVtcGxhdGVfVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdH0sXG5cdC8qKlxuXHQgKiBPbiBwYWdlIGxvYWQgaW5pdCBzb21lIFNlbWFudGljIFVJIGxpYnJhcnlcblx0ICovXG5cdGluaXRpYWxpemUoKSB7XG5cdFx0TW9kdWxlVGVtcGxhdGVNb2RpZnkuJGNoZWNrQm94ZXMuY2hlY2tib3goKTtcblx0XHRNb2R1bGVUZW1wbGF0ZU1vZGlmeS4kZHJvcERvd25zLmRyb3Bkb3duKCk7XG5cdFx0TW9kdWxlVGVtcGxhdGVNb2RpZnkuaW5pdGlhbGl6ZUZvcm0oKTtcblx0fSxcblxuXHQvKipcblx0ICogV2UgY2FuIG1vZGlmeSBzb21lIGRhdGEgYmVmb3JlIGZvcm0gc2VuZFxuXHQgKiBAcGFyYW0gc2V0dGluZ3Ncblx0ICogQHJldHVybnMgeyp9XG5cdCAqL1xuXHRjYkJlZm9yZVNlbmRGb3JtKHNldHRpbmdzKSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gc2V0dGluZ3M7XG5cdFx0cmVzdWx0LmRhdGEgPSBNb2R1bGVUZW1wbGF0ZU1vZGlmeS4kZm9ybU9iai5mb3JtKCdnZXQgdmFsdWVzJyk7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvKipcblx0ICogU29tZSBhY3Rpb25zIGFmdGVyIGZvcm1zIHNlbmRcblx0ICovXG5cdGNiQWZ0ZXJTZW5kRm9ybSgpIHtcblxuXHR9LFxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBmb3JtIHBhcmFtZXRlcnNcblx0ICovXG5cdGluaXRpYWxpemVGb3JtKCkge1xuXHRcdEZvcm0uJGZvcm1PYmogPSBNb2R1bGVUZW1wbGF0ZU1vZGlmeS4kZm9ybU9iajtcblx0XHRGb3JtLnVybCA9IGAke2dsb2JhbFJvb3RVcmx9bW9kdWxlLXRlbXBsYXRlL21vZHVsZS10ZW1wbGF0ZS9zYXZlYDtcblx0XHRGb3JtLnZhbGlkYXRlUnVsZXMgPSBNb2R1bGVUZW1wbGF0ZU1vZGlmeS52YWxpZGF0ZVJ1bGVzO1xuXHRcdEZvcm0uY2JCZWZvcmVTZW5kRm9ybSA9IE1vZHVsZVRlbXBsYXRlTW9kaWZ5LmNiQmVmb3JlU2VuZEZvcm07XG5cdFx0Rm9ybS5jYkFmdGVyU2VuZEZvcm0gPSBNb2R1bGVUZW1wbGF0ZU1vZGlmeS5jYkFmdGVyU2VuZEZvcm07XG5cdFx0Rm9ybS5pbml0aWFsaXplKCk7XG5cdH0sXG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG5cdE1vZHVsZVRlbXBsYXRlTW9kaWZ5LmluaXRpYWxpemUoKTtcbn0pO1xuXG4iXX0=