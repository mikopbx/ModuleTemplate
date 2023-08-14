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

var ModuleTemplateIndex = {
  var1: 'foo',
  $var2: $('.foo'),
  $moduleStatus: $('#status'),
  $statusToggle: $('#module-status-toggle'),
  $disabilityFields: $('.disability'),
  initialize: function initialize() {
    ModuleTemplateIndex.cbOnChangeStatusToggle();
    window.addEventListener('ModuleStatusChanged', ModuleTemplateIndex.cbOnChangeStatusToggle);
  },

  /**
   * Change some form elements classes depends of module status
   */
  cbOnChangeStatusToggle: function cbOnChangeStatusToggle() {
    if (ModuleTemplateIndex.$statusToggle.checkbox('is checked')) {
      ModuleTemplateIndex.$disabilityFields.removeClass('disabled');
      ModuleTemplateIndex.$moduleStatus.show();
    } else {
      ModuleTemplateIndex.$disabilityFields.addClass('disabled');
      ModuleTemplateIndex.$moduleStatus.hide();
    }
  }
};
$(document).ready(function () {
  ModuleTemplateIndex.initialize();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtaW5kZXguanMiXSwibmFtZXMiOlsiTW9kdWxlVGVtcGxhdGVJbmRleCIsInZhcjEiLCIkdmFyMiIsIiQiLCIkbW9kdWxlU3RhdHVzIiwiJHN0YXR1c1RvZ2dsZSIsIiRkaXNhYmlsaXR5RmllbGRzIiwiaW5pdGlhbGl6ZSIsImNiT25DaGFuZ2VTdGF0dXNUb2dnbGUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiY2hlY2tib3giLCJyZW1vdmVDbGFzcyIsInNob3ciLCJhZGRDbGFzcyIsImhpZGUiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLG1CQUFtQixHQUFHO0FBQzNCQyxFQUFBQSxJQUFJLEVBQUMsS0FEc0I7QUFFM0JDLEVBQUFBLEtBQUssRUFBRUMsQ0FBQyxDQUFDLE1BQUQsQ0FGbUI7QUFHM0JDLEVBQUFBLGFBQWEsRUFBRUQsQ0FBQyxDQUFDLFNBQUQsQ0FIVztBQUkzQkUsRUFBQUEsYUFBYSxFQUFFRixDQUFDLENBQUMsdUJBQUQsQ0FKVztBQUszQkcsRUFBQUEsaUJBQWlCLEVBQUVILENBQUMsQ0FBQyxhQUFELENBTE87QUFNM0JJLEVBQUFBLFVBTjJCLHdCQU1mO0FBQ1hQLElBQUFBLG1CQUFtQixDQUFDUSxzQkFBcEI7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixxQkFBeEIsRUFBK0NWLG1CQUFtQixDQUFDUSxzQkFBbkU7QUFDQSxHQVQwQjs7QUFVM0I7QUFDRDtBQUNBO0FBQ0NBLEVBQUFBLHNCQWIyQixvQ0FhRjtBQUN4QixRQUFJUixtQkFBbUIsQ0FBQ0ssYUFBcEIsQ0FBa0NNLFFBQWxDLENBQTJDLFlBQTNDLENBQUosRUFBOEQ7QUFDN0RYLE1BQUFBLG1CQUFtQixDQUFDTSxpQkFBcEIsQ0FBc0NNLFdBQXRDLENBQWtELFVBQWxEO0FBQ0FaLE1BQUFBLG1CQUFtQixDQUFDSSxhQUFwQixDQUFrQ1MsSUFBbEM7QUFDQSxLQUhELE1BR087QUFDTmIsTUFBQUEsbUJBQW1CLENBQUNNLGlCQUFwQixDQUFzQ1EsUUFBdEMsQ0FBK0MsVUFBL0M7QUFDQWQsTUFBQUEsbUJBQW1CLENBQUNJLGFBQXBCLENBQWtDVyxJQUFsQztBQUNBO0FBQ0Q7QUFyQjBCLENBQTVCO0FBeUJBWixDQUFDLENBQUNhLFFBQUQsQ0FBRCxDQUFZQyxLQUFaLENBQWtCLFlBQU07QUFDdkJqQixFQUFBQSxtQkFBbUIsQ0FBQ08sVUFBcEI7QUFDQSxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTW9kdWxlVGVtcGxhdGVJbmRleCA9IHtcblx0dmFyMTonZm9vJyxcblx0JHZhcjI6ICQoJy5mb28nKSxcblx0JG1vZHVsZVN0YXR1czogJCgnI3N0YXR1cycpLFxuXHQkc3RhdHVzVG9nZ2xlOiAkKCcjbW9kdWxlLXN0YXR1cy10b2dnbGUnKSxcblx0JGRpc2FiaWxpdHlGaWVsZHM6ICQoJy5kaXNhYmlsaXR5JyksXG5cdGluaXRpYWxpemUoKXtcblx0XHRNb2R1bGVUZW1wbGF0ZUluZGV4LmNiT25DaGFuZ2VTdGF0dXNUb2dnbGUoKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignTW9kdWxlU3RhdHVzQ2hhbmdlZCcsIE1vZHVsZVRlbXBsYXRlSW5kZXguY2JPbkNoYW5nZVN0YXR1c1RvZ2dsZSk7XG5cdH0sXG5cdC8qKlxuXHQgKiBDaGFuZ2Ugc29tZSBmb3JtIGVsZW1lbnRzIGNsYXNzZXMgZGVwZW5kcyBvZiBtb2R1bGUgc3RhdHVzXG5cdCAqL1xuXHRjYk9uQ2hhbmdlU3RhdHVzVG9nZ2xlKCkge1xuXHRcdGlmIChNb2R1bGVUZW1wbGF0ZUluZGV4LiRzdGF0dXNUb2dnbGUuY2hlY2tib3goJ2lzIGNoZWNrZWQnKSkge1xuXHRcdFx0TW9kdWxlVGVtcGxhdGVJbmRleC4kZGlzYWJpbGl0eUZpZWxkcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdE1vZHVsZVRlbXBsYXRlSW5kZXguJG1vZHVsZVN0YXR1cy5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdE1vZHVsZVRlbXBsYXRlSW5kZXguJGRpc2FiaWxpdHlGaWVsZHMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRNb2R1bGVUZW1wbGF0ZUluZGV4LiRtb2R1bGVTdGF0dXMuaGlkZSgpO1xuXHRcdH1cblx0fSxcblxufTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHRNb2R1bGVUZW1wbGF0ZUluZGV4LmluaXRpYWxpemUoKTtcbn0pOyJdfQ==