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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtaW5kZXguanMiXSwibmFtZXMiOlsiTW9kdWxlVGVtcGxhdGVJbmRleCIsInZhcjEiLCIkdmFyMiIsIiQiLCIkbW9kdWxlU3RhdHVzIiwiJHN0YXR1c1RvZ2dsZSIsIiRkaXNhYmlsaXR5RmllbGRzIiwiaW5pdGlhbGl6ZSIsImNiT25DaGFuZ2VTdGF0dXNUb2dnbGUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiY2hlY2tib3giLCJyZW1vdmVDbGFzcyIsInNob3ciLCJhZGRDbGFzcyIsImhpZGUiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxtQkFBbUIsR0FBRztBQUMzQkMsRUFBQUEsSUFBSSxFQUFDLEtBRHNCO0FBRTNCQyxFQUFBQSxLQUFLLEVBQUVDLENBQUMsQ0FBQyxNQUFELENBRm1CO0FBRzNCQyxFQUFBQSxhQUFhLEVBQUVELENBQUMsQ0FBQyxTQUFELENBSFc7QUFJM0JFLEVBQUFBLGFBQWEsRUFBRUYsQ0FBQyxDQUFDLHVCQUFELENBSlc7QUFLM0JHLEVBQUFBLGlCQUFpQixFQUFFSCxDQUFDLENBQUMsYUFBRCxDQUxPO0FBTTNCSSxFQUFBQSxVQU4yQix3QkFNZjtBQUNYUCxJQUFBQSxtQkFBbUIsQ0FBQ1Esc0JBQXBCO0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0IscUJBQXhCLEVBQStDVixtQkFBbUIsQ0FBQ1Esc0JBQW5FO0FBQ0EsR0FUMEI7O0FBVTNCO0FBQ0Q7QUFDQTtBQUNDQSxFQUFBQSxzQkFiMkIsb0NBYUY7QUFDeEIsUUFBSVIsbUJBQW1CLENBQUNLLGFBQXBCLENBQWtDTSxRQUFsQyxDQUEyQyxZQUEzQyxDQUFKLEVBQThEO0FBQzdEWCxNQUFBQSxtQkFBbUIsQ0FBQ00saUJBQXBCLENBQXNDTSxXQUF0QyxDQUFrRCxVQUFsRDtBQUNBWixNQUFBQSxtQkFBbUIsQ0FBQ0ksYUFBcEIsQ0FBa0NTLElBQWxDO0FBQ0EsS0FIRCxNQUdPO0FBQ05iLE1BQUFBLG1CQUFtQixDQUFDTSxpQkFBcEIsQ0FBc0NRLFFBQXRDLENBQStDLFVBQS9DO0FBQ0FkLE1BQUFBLG1CQUFtQixDQUFDSSxhQUFwQixDQUFrQ1csSUFBbEM7QUFDQTtBQUNEO0FBckIwQixDQUE1QjtBQXlCQVosQ0FBQyxDQUFDYSxRQUFELENBQUQsQ0FBWUMsS0FBWixDQUFrQixZQUFNO0FBQ3ZCakIsRUFBQUEsbUJBQW1CLENBQUNPLFVBQXBCO0FBQ0EsQ0FGRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBNaWtvUEJYIC0gZnJlZSBwaG9uZSBzeXN0ZW0gZm9yIHNtYWxsIGJ1c2luZXNzXG4gKiBDb3B5cmlnaHQgwqkgMjAxNy0yMDIzIEFsZXhleSBQb3J0bm92IGFuZCBOaWtvbGF5IEJla2V0b3ZcbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb247IGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uXG4gKiBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmNvbnN0IE1vZHVsZVRlbXBsYXRlSW5kZXggPSB7XG5cdHZhcjE6J2ZvbycsXG5cdCR2YXIyOiAkKCcuZm9vJyksXG5cdCRtb2R1bGVTdGF0dXM6ICQoJyNzdGF0dXMnKSxcblx0JHN0YXR1c1RvZ2dsZTogJCgnI21vZHVsZS1zdGF0dXMtdG9nZ2xlJyksXG5cdCRkaXNhYmlsaXR5RmllbGRzOiAkKCcuZGlzYWJpbGl0eScpLFxuXHRpbml0aWFsaXplKCl7XG5cdFx0TW9kdWxlVGVtcGxhdGVJbmRleC5jYk9uQ2hhbmdlU3RhdHVzVG9nZ2xlKCk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ01vZHVsZVN0YXR1c0NoYW5nZWQnLCBNb2R1bGVUZW1wbGF0ZUluZGV4LmNiT25DaGFuZ2VTdGF0dXNUb2dnbGUpO1xuXHR9LFxuXHQvKipcblx0ICogQ2hhbmdlIHNvbWUgZm9ybSBlbGVtZW50cyBjbGFzc2VzIGRlcGVuZHMgb2YgbW9kdWxlIHN0YXR1c1xuXHQgKi9cblx0Y2JPbkNoYW5nZVN0YXR1c1RvZ2dsZSgpIHtcblx0XHRpZiAoTW9kdWxlVGVtcGxhdGVJbmRleC4kc3RhdHVzVG9nZ2xlLmNoZWNrYm94KCdpcyBjaGVja2VkJykpIHtcblx0XHRcdE1vZHVsZVRlbXBsYXRlSW5kZXguJGRpc2FiaWxpdHlGaWVsZHMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRNb2R1bGVUZW1wbGF0ZUluZGV4LiRtb2R1bGVTdGF0dXMuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRNb2R1bGVUZW1wbGF0ZUluZGV4LiRkaXNhYmlsaXR5RmllbGRzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0TW9kdWxlVGVtcGxhdGVJbmRleC4kbW9kdWxlU3RhdHVzLmhpZGUoKTtcblx0XHR9XG5cdH0sXG5cbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcblx0TW9kdWxlVGVtcGxhdGVJbmRleC5pbml0aWFsaXplKCk7XG59KTsiXX0=