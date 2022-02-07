"use strict";

/*
 * Copyright (C) MIKO LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nikolay Beketov, 11 2018
 *
 */
var idUrl = 'module-template';
var idForm = 'module-template-form';
var className = 'ModuleTemplate';
var inputClassName = 'mikopbx-module-input';
/* global globalRootUrl, globalTranslate, Form, Config */

var ModuleTemplate = {
  $formObj: $('#' + idForm),
  $checkBoxes: $('#' + idForm + ' .ui.checkbox'),
  $dropDowns: $('#' + idForm + ' .ui.dropdown'),
  saveTableAJAXUrl: globalRootUrl + idUrl + "/saveTableData",
  deleteRecordAJAXUrl: globalRootUrl + idUrl + "/delete",
  $disabilityFields: $('#' + idForm + '  .disability'),
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
        prompt: globalTranslate.mod_tpl_ValidateValueIsEmpty
      }]
    },
    areaField: {
      identifier: 'text_area_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.mod_tpl_ValidateValueIsEmpty
      }]
    },
    passwordField: {
      identifier: 'password_field',
      rules: [{
        type: 'empty',
        prompt: globalTranslate.mod_tpl_ValidateValueIsEmpty
      }]
    }
  },

  /**
   * On page load we init some Semantic UI library
   */
  initialize: function initialize() {
    // инициализируем чекбоксы и выподающие менюшки
    window[className].$checkBoxes.checkbox();
    window[className].$dropDowns.dropdown();
    window[className].checkStatusToggle();
    window.addEventListener('ModuleStatusChanged', window[className].checkStatusToggle);
    window[className].initializeForm();
    $('.menu .item').tab();
    $.get(idUrl + '/getTablesDescription', function (result) {
      for (var key in result['data']) {
        var tableName = key + '-table';

        if ($('#' + tableName).attr('id') === undefined) {
          continue;
        }

        window[className].initTable(tableName, result['data'][key]);
      }
    });
  },

  /**
   * Подготавливает список выбора
   * @param selected
   * @returns {[]}
   */
  makeDropdownList: function makeDropdownList(selectType, selected) {
    var values = [{
      name: ' --- ',
      value: '',
      selected: '' === selected
    }];
    $('#' + selectType + ' option').each(function (index, obj) {
      values.push({
        name: obj.text,
        value: obj.value,
        selected: selected === obj.value
      });
    });
    return values;
  },

  /**
   * Обработка изменения группы в списке
   */
  changeGroupInList: function changeGroupInList(value, text, choice) {
    var tdInput = $(choice).closest('td').find('input');
    tdInput.attr('data-value', value);
    tdInput.attr('value', value);
    var currentRowId = $(choice).closest('tr').attr('id');
    var tableName = $(choice).closest('table').attr('id').replace('-table', '');

    if (currentRowId !== undefined && tableName !== undefined) {
      window[className].sendChangesToServer(tableName, currentRowId);
    }
  },

  /**
   * Add new Table.
   */
  initTable: function initTable(tableName, options) {
    var columns = [];
    var columnsArray4Sort = [];

    for (var colName in options['cols']) {
      columns.push({
        data: colName
      });
      columnsArray4Sort.push(colName);
    }

    $('#' + tableName).DataTable({
      ajax: {
        url: idUrl + options.ajaxUrl + '?table=' + tableName.replace('-table', ''),
        dataSrc: 'data'
      },
      columns: columns,
      paging: true,
      sDom: 'rtip',
      deferRender: true,
      pageLength: 17,
      infoCallback: function infoCallback(settings, start, end, max, total, pre) {
        return '';
      },
      language: SemanticLocalization.dataTableLocalisation,
      ordering: false,

      /**
       * Builder row presentation
       * @param row
       * @param data
       */
      createdRow: function createdRow(row, data) {
        var cols = $('td', row);
        var headers = $('#' + tableName + ' thead tr th');

        for (var key in data) {
          var index = columnsArray4Sort.indexOf(key);

          if (key === 'rowIcon') {
            cols.eq(index).html('<i class="ui ' + data[key] + ' circle icon"></i>');
          } else if (key === 'delButton') {
            var templateDeleteButton = '<div class="ui small basic icon buttons action-buttons">' + '<a href="' + window[className].deleteRecordAJAXUrl + '/' + data.id + '" data-value = "' + data.DT_RowId + '"' + ' class="ui button delete two-steps-delete popuped" data-content="' + globalTranslate.bt_ToolTipDelete + '">' + '<i class="icon trash red"></i></a></div>';
            cols.eq(index).html(templateDeleteButton);
          } else if (key === 'priority') {
            cols.eq(index).addClass('dragHandle');
            cols.eq(index).html('<i class="ui sort circle icon"></i>'); // Приоритет устанавливаем для строки.

            $(row).attr('m-priority', data[key]);
          } else {
            var template = '<div class="ui transparent fluid input inline-edit">' + '<input colName="' + key + '" class="' + inputClassName + '" type="text" data-value="' + data[key] + '" value="' + data[key] + '"></div>';
            $('td', row).eq(index).html(template);
          }

          if (options['cols'][key] === undefined) {
            continue;
          }

          var additionalClass = options['cols'][key]['class'];

          if (additionalClass !== undefined && additionalClass !== '') {
            headers.eq(index).addClass(additionalClass);
          }

          var header = options['cols'][key]['header'];

          if (header !== undefined && header !== '') {
            headers.eq(index).html(header);
          }

          var selectMetaData = options['cols'][key]['select'];

          if (selectMetaData !== undefined) {
            var newTemplate = $('#template-select').html().replace('PARAM', data[key]);

            var _template = '<input class="' + inputClassName + '" colName="' + key + '" selectType="' + selectMetaData + '" style="display: none;" type="text" data-value="' + data[key] + '" value="' + data[key] + '"></div>';

            cols.eq(index).html(newTemplate + _template);
          }
        }
      },

      /**
       * Draw event - fired once the table has completed a draw.
       */
      drawCallback: function drawCallback(settings) {
        window[className].drowSelectGroup(settings.sTableId);
      }
    });
    var body = $('body'); // Клик по полю. Вход для редактирования значения.

    body.on('focusin', '.' + inputClassName, function (e) {
      $(e.target).transition('glow');
      $(e.target).closest('div').removeClass('transparent').addClass('changed-field');
      $(e.target).attr('readonly', false);
    }); // Отправка формы на сервер по Enter или Tab

    $(document).on('keydown', function (e) {
      var keyCode = e.keyCode || e.which;

      if (keyCode === 13 || keyCode === 9 && $(':focus').hasClass('mikopbx-module-input')) {
        window[className].endEditInput();
      }
    });
    body.on('click', 'a.delete', function (e) {
      e.preventDefault();
      var currentRowId = $(e.target).closest('tr').attr('id');
      var tableName = $(e.target).closest('table').attr('id').replace('-table', '');
      window[className].deleteRow(tableName, currentRowId);
    }); // Добавление новой строки
    // Отправка формы на сервер по уходу с поля ввода

    body.on('focusout', '.' + inputClassName, window[className].endEditInput); // Кнопка "Добавить новую запись"

    $('[id-table = "' + tableName + '"]').on('click', window[className].addNewRow);
  },

  /**
   * Перемещение строки, изменение приоритета.
   */
  cbOnDrop: function cbOnDrop(table, row) {
    var priorityWasChanged = false;
    var priorityData = {};
    $(table).find('tr').each(function (index, obj) {
      var ruleId = $(obj).attr('id');
      var oldPriority = parseInt($(obj).attr('m-priority'), 10);
      var newPriority = obj.rowIndex;

      if (!isNaN(ruleId) && oldPriority !== newPriority) {
        priorityWasChanged = true;
        priorityData[ruleId] = newPriority;
      }
    });

    if (priorityWasChanged) {
      $.api({
        on: 'now',
        url: "".concat(globalRootUrl).concat(idUrl, "/changePriority?table=") + $(table).attr('id').replace('-table', ''),
        method: 'POST',
        data: priorityData
      });
    }
  },

  /**
   * Окончание редактирования поля ввода.
   * Не относится к select.
   * @param e
   */
  endEditInput: function endEditInput(e) {
    var $el = $('.changed-field').closest('tr');
    $el.each(function (index, obj) {
      var currentRowId = $(obj).attr('id');
      var tableName = $(obj).closest('table').attr('id').replace('-table', '');

      if (currentRowId !== undefined && tableName !== undefined) {
        window[className].sendChangesToServer(tableName, currentRowId);
      }
    });
  },

  /**
   * Добавление новой строки в таблицу.
   * @param e
   */
  addNewRow: function addNewRow(e) {
    var idTable = $(e.target).attr('id-table');
    var table = $('#' + idTable);
    e.preventDefault();
    table.find('.dataTables_empty').remove(); // Отправим на запись все что не записано еще

    var $el = table.find('.changed-field').closest('tr');
    $el.each(function (index, obj) {
      var currentRowId = $(obj).attr('id');

      if (currentRowId !== undefined) {
        window[className].sendChangesToServer(currentRowId);
      }
    });
    var id = "new" + Math.floor(Math.random() * Math.floor(500));
    var rowTemplate = '<tr id="' + id + '" role="row" class="even">' + table.find('tr#TEMPLATE').html().replace('TEMPLATE', id) + '</tr>';
    table.find('tbody > tr:first').before(rowTemplate);
    window[className].drowSelectGroup(idTable);
  },

  /**
   * Обновление select элементов.
   * @param tableId
   */
  drowSelectGroup: function drowSelectGroup(tableId) {
    $('#' + tableId).find('tr#TEMPLATE').hide();
    var selestGroup = $('.select-group');
    selestGroup.each(function (index, obj) {
      var selectType = $(obj).closest('td').find('input').attr('selectType');
      $(obj).dropdown({
        values: window[className].makeDropdownList(selectType, $(obj).attr('data-value'))
      });
    });
    selestGroup.dropdown({
      onChange: window[className].changeGroupInList
    });
    $('#' + tableId).tableDnD({
      onDrop: window[className].cbOnDrop,
      onDragClass: 'hoveringRow',
      dragHandle: '.dragHandle'
    });
  },

  /**
   * Удаление строки
   * @param tableName
   * @param id - record id
   */
  deleteRow: function deleteRow(tableName, id) {
    var table = $('#' + tableName + '-table');

    if (id.substr(0, 3) === 'new') {
      table.find('tr#' + id).remove();
      return;
    }

    $.api({
      url: window[className].deleteRecordAJAXUrl + '?id=' + id + '&table=' + tableName,
      on: 'now',
      onSuccess: function onSuccess(response) {
        if (response.success) {
          table.find('tr#' + id).remove();

          if (table.find('tbody > tr').length === 0) {
            table.find('tbody').append('<tr class="odd"></tr>');
          }
        }
      }
    });
  },

  /**
   * Отправка данных на сервер при измении
   */
  sendChangesToServer: function sendChangesToServer(tableName, recordId) {
    var data = {
      'pbx-table-id': tableName,
      'pbx-row-id': recordId
    };
    var notEmpty = false;
    $("tr#" + recordId + ' .' + inputClassName).each(function (index, obj) {
      var colName = $(obj).attr('colName');

      if (colName !== undefined) {
        data[$(obj).attr('colName')] = $(obj).val();

        if ($(obj).val() !== '') {
          notEmpty = true;
        }
      }
    });

    if (notEmpty === false) {
      return;
    }

    $("tr#" + recordId + " .user.circle").removeClass('user circle').addClass('spinner loading');
    $.api({
      url: window[className].saveTableAJAXUrl,
      on: 'now',
      method: 'POST',
      data: data,
      successTest: function successTest(response) {
        return response !== undefined && Object.keys(response).length > 0 && response.success === true;
      },
      onSuccess: function onSuccess(response) {
        if (response.data !== undefined) {
          var rowId = response.data['pbx-row-id'];
          var table = $('#' + response.data['pbx-table-id'] + '-table');
          table.find("tr#" + rowId + " input").attr('readonly', true);
          table.find("tr#" + rowId + " div").removeClass('changed-field loading').addClass('transparent');
          table.find("tr#" + rowId + " .spinner.loading").addClass('user circle').removeClass('spinner loading');

          if (rowId !== response.data['newId']) {
            $("tr#".concat(rowId)).attr('id', response.data['newId']);
          }
        }
      },
      onFailure: function onFailure(response) {
        if (response.message !== undefined) {
          UserMessage.showMultiString(response.message);
        }

        $("tr#" + recordId + " .spinner.loading").addClass('user circle').removeClass('spinner loading');
      },
      onError: function onError(errorMessage, element, xhr) {
        if (xhr.status === 403) {
          window.location = globalRootUrl + "session/index";
        }
      }
    });
  },

  /**
   * Change some form elements classes depends of module status
   */
  checkStatusToggle: function checkStatusToggle() {
    if (window[className].$statusToggle.checkbox('is checked')) {
      window[className].$disabilityFields.removeClass('disabled');
      window[className].$moduleStatus.show();
    } else {
      window[className].$disabilityFields.addClass('disabled');
      window[className].$moduleStatus.hide();
    }
  },

  /**
   * Send command to restart module workers after data changes,
   * Also we can do it on TemplateConf->modelsEventChangeData method
   */
  applyConfigurationChanges: function applyConfigurationChanges() {
    window[className].changeStatus('Updating');
    $.api({
      url: "".concat(Config.pbxUrl, "/pbxcore/api/modules/") + className + "/reload",
      on: 'now',
      successTest: function successTest(response) {
        // test whether a JSON response is valid
        return Object.keys(response).length > 0 && response.result === true;
      },
      onSuccess: function onSuccess() {
        window[className].changeStatus('Connected');
      },
      onFailure: function onFailure() {
        window[className].changeStatus('Disconnected');
      }
    });
  },

  /**
   * We can modify some data before form send
   * @param settings
   * @returns {*}
   */
  cbBeforeSendForm: function cbBeforeSendForm(settings) {
    var result = settings;
    result.data = window[className].$formObj.form('get values');
    return result;
  },

  /**
   * Some actions after forms send
   */
  cbAfterSendForm: function cbAfterSendForm() {
    window[className].applyConfigurationChanges();
  },

  /**
   * Initialize form parameters
   */
  initializeForm: function initializeForm() {
    Form.$formObj = window[className].$formObj;
    Form.url = "".concat(globalRootUrl).concat(idUrl, "/save");
    Form.validateRules = window[className].validateRules;
    Form.cbBeforeSendForm = window[className].cbBeforeSendForm;
    Form.cbAfterSendForm = window[className].cbAfterSendForm;
    Form.initialize();
  },

  /**
   * Update the module state on form label
   * @param status
   */
  changeStatus: function changeStatus(status) {
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
};
$(document).ready(function () {
  window[className].initialize();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tb2R1bGUtdGVtcGxhdGUtaW5kZXguanMiXSwibmFtZXMiOlsiaWRVcmwiLCJpZEZvcm0iLCJjbGFzc05hbWUiLCJpbnB1dENsYXNzTmFtZSIsIk1vZHVsZVRlbXBsYXRlIiwiJGZvcm1PYmoiLCIkIiwiJGNoZWNrQm94ZXMiLCIkZHJvcERvd25zIiwic2F2ZVRhYmxlQUpBWFVybCIsImdsb2JhbFJvb3RVcmwiLCJkZWxldGVSZWNvcmRBSkFYVXJsIiwiJGRpc2FiaWxpdHlGaWVsZHMiLCIkc3RhdHVzVG9nZ2xlIiwiJG1vZHVsZVN0YXR1cyIsInZhbGlkYXRlUnVsZXMiLCJ0ZXh0RmllbGQiLCJpZGVudGlmaWVyIiwicnVsZXMiLCJ0eXBlIiwicHJvbXB0IiwiZ2xvYmFsVHJhbnNsYXRlIiwibW9kX3RwbF9WYWxpZGF0ZVZhbHVlSXNFbXB0eSIsImFyZWFGaWVsZCIsInBhc3N3b3JkRmllbGQiLCJpbml0aWFsaXplIiwid2luZG93IiwiY2hlY2tib3giLCJkcm9wZG93biIsImNoZWNrU3RhdHVzVG9nZ2xlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImluaXRpYWxpemVGb3JtIiwidGFiIiwiZ2V0IiwicmVzdWx0Iiwia2V5IiwidGFibGVOYW1lIiwiYXR0ciIsInVuZGVmaW5lZCIsImluaXRUYWJsZSIsIm1ha2VEcm9wZG93bkxpc3QiLCJzZWxlY3RUeXBlIiwic2VsZWN0ZWQiLCJ2YWx1ZXMiLCJuYW1lIiwidmFsdWUiLCJlYWNoIiwiaW5kZXgiLCJvYmoiLCJwdXNoIiwidGV4dCIsImNoYW5nZUdyb3VwSW5MaXN0IiwiY2hvaWNlIiwidGRJbnB1dCIsImNsb3Nlc3QiLCJmaW5kIiwiY3VycmVudFJvd0lkIiwicmVwbGFjZSIsInNlbmRDaGFuZ2VzVG9TZXJ2ZXIiLCJvcHRpb25zIiwiY29sdW1ucyIsImNvbHVtbnNBcnJheTRTb3J0IiwiY29sTmFtZSIsImRhdGEiLCJEYXRhVGFibGUiLCJhamF4IiwidXJsIiwiYWpheFVybCIsImRhdGFTcmMiLCJwYWdpbmciLCJzRG9tIiwiZGVmZXJSZW5kZXIiLCJwYWdlTGVuZ3RoIiwiaW5mb0NhbGxiYWNrIiwic2V0dGluZ3MiLCJzdGFydCIsImVuZCIsIm1heCIsInRvdGFsIiwicHJlIiwibGFuZ3VhZ2UiLCJTZW1hbnRpY0xvY2FsaXphdGlvbiIsImRhdGFUYWJsZUxvY2FsaXNhdGlvbiIsIm9yZGVyaW5nIiwiY3JlYXRlZFJvdyIsInJvdyIsImNvbHMiLCJoZWFkZXJzIiwiaW5kZXhPZiIsImVxIiwiaHRtbCIsInRlbXBsYXRlRGVsZXRlQnV0dG9uIiwiaWQiLCJEVF9Sb3dJZCIsImJ0X1Rvb2xUaXBEZWxldGUiLCJhZGRDbGFzcyIsInRlbXBsYXRlIiwiYWRkaXRpb25hbENsYXNzIiwiaGVhZGVyIiwic2VsZWN0TWV0YURhdGEiLCJuZXdUZW1wbGF0ZSIsImRyYXdDYWxsYmFjayIsImRyb3dTZWxlY3RHcm91cCIsInNUYWJsZUlkIiwiYm9keSIsIm9uIiwiZSIsInRhcmdldCIsInRyYW5zaXRpb24iLCJyZW1vdmVDbGFzcyIsImRvY3VtZW50Iiwia2V5Q29kZSIsIndoaWNoIiwiaGFzQ2xhc3MiLCJlbmRFZGl0SW5wdXQiLCJwcmV2ZW50RGVmYXVsdCIsImRlbGV0ZVJvdyIsImFkZE5ld1JvdyIsImNiT25Ecm9wIiwidGFibGUiLCJwcmlvcml0eVdhc0NoYW5nZWQiLCJwcmlvcml0eURhdGEiLCJydWxlSWQiLCJvbGRQcmlvcml0eSIsInBhcnNlSW50IiwibmV3UHJpb3JpdHkiLCJyb3dJbmRleCIsImlzTmFOIiwiYXBpIiwibWV0aG9kIiwiJGVsIiwiaWRUYWJsZSIsInJlbW92ZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJvd1RlbXBsYXRlIiwiYmVmb3JlIiwidGFibGVJZCIsImhpZGUiLCJzZWxlc3RHcm91cCIsIm9uQ2hhbmdlIiwidGFibGVEbkQiLCJvbkRyb3AiLCJvbkRyYWdDbGFzcyIsImRyYWdIYW5kbGUiLCJzdWJzdHIiLCJvblN1Y2Nlc3MiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJsZW5ndGgiLCJhcHBlbmQiLCJyZWNvcmRJZCIsIm5vdEVtcHR5IiwidmFsIiwic3VjY2Vzc1Rlc3QiLCJPYmplY3QiLCJrZXlzIiwicm93SWQiLCJvbkZhaWx1cmUiLCJtZXNzYWdlIiwiVXNlck1lc3NhZ2UiLCJzaG93TXVsdGlTdHJpbmciLCJvbkVycm9yIiwiZXJyb3JNZXNzYWdlIiwiZWxlbWVudCIsInhociIsInN0YXR1cyIsImxvY2F0aW9uIiwic2hvdyIsImFwcGx5Q29uZmlndXJhdGlvbkNoYW5nZXMiLCJjaGFuZ2VTdGF0dXMiLCJDb25maWciLCJwYnhVcmwiLCJjYkJlZm9yZVNlbmRGb3JtIiwiZm9ybSIsImNiQWZ0ZXJTZW5kRm9ybSIsIkZvcm0iLCJtb2RfdHBsX0Nvbm5lY3RlZCIsIm1vZF90cGxfRGlzY29ubmVjdGVkIiwibW9kX3RwbF9VcGRhdGVTdGF0dXMiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLEtBQUssR0FBTyxpQkFBbEI7QUFDQSxJQUFNQyxNQUFNLEdBQU0sc0JBQWxCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHLGdCQUFsQjtBQUNBLElBQU1DLGNBQWMsR0FBRyxzQkFBdkI7QUFFQTs7QUFDQSxJQUFNQyxjQUFjLEdBQUc7QUFDdEJDLEVBQUFBLFFBQVEsRUFBRUMsQ0FBQyxDQUFDLE1BQUlMLE1BQUwsQ0FEVztBQUV0Qk0sRUFBQUEsV0FBVyxFQUFFRCxDQUFDLENBQUMsTUFBSUwsTUFBSixHQUFXLGVBQVosQ0FGUTtBQUd0Qk8sRUFBQUEsVUFBVSxFQUFFRixDQUFDLENBQUMsTUFBSUwsTUFBSixHQUFXLGVBQVosQ0FIUztBQUl0QlEsRUFBQUEsZ0JBQWdCLEVBQUVDLGFBQWEsR0FBR1YsS0FBaEIsR0FBd0IsZ0JBSnBCO0FBS3RCVyxFQUFBQSxtQkFBbUIsRUFBRUQsYUFBYSxHQUFHVixLQUFoQixHQUF3QixTQUx2QjtBQU10QlksRUFBQUEsaUJBQWlCLEVBQUVOLENBQUMsQ0FBQyxNQUFJ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LGFBQWxCLENBQ0UrRixXQURGLENBQ2MsT0FEZCxFQUVFQSxXQUZGLENBRWMsS0FGZCxFQUdFZCxRQUhGLENBR1csTUFIWDtBQUlBckUsUUFBQUEsTUFBTSxDQUFDeEIsU0FBRCxDQUFOLENBQWtCWSxhQUFsQixDQUFnQzRFLElBQWhDLENBQXFDckUsZUFBZSxDQUFDOEosb0JBQXJEO0FBQ0E7O0FBQ0QsV0FBSyxVQUFMO0FBQ0N6SixRQUFBQSxNQUFNLENBQUN4QixTQUFELENBQU4sQ0FBa0JZLGFBQWxCLENBQ0UrRixXQURGLENBQ2MsT0FEZCxFQUVFQSxXQUZGLENBRWMsS0FGZCxFQUdFZCxRQUhGLENBR1csTUFIWDtBQUlBckUsUUFBQUEsTUFBTSxDQUFDeEIsU0FBRCxDQUFOLENBQWtCWSxhQUFsQixDQUFnQzRFLElBQWhDLGlEQUE0RXJFLGVBQWUsQ0FBQytKLG9CQUE1RjtBQUNBOztBQUNEO0FBQ0MxSixRQUFBQSxNQUFNLENBQUN4QixTQUFELENBQU4sQ0FBa0JZLGFBQWxCLENBQ0UrRixXQURGLENBQ2MsT0FEZCxFQUVFQSxXQUZGLENBRWMsS0FGZCxFQUdFZCxRQUhGLENBR1csTUFIWDtBQUlBckUsUUFBQUEsTUFBTSxDQUFDeEIsU0FBRCxDQUFOLENBQWtCWSxhQUFsQixDQUFnQzRFLElBQWhDLENBQXFDckUsZUFBZSxDQUFDOEosb0JBQXJEO0FBQ0E7QUE1QkY7QUE4QkE7QUF0ZHFCLENBQXZCO0FBeWRBN0ssQ0FBQyxDQUFDd0csUUFBRCxDQUFELENBQVl1RSxLQUFaLENBQWtCLFlBQU07QUFDdkIzSixFQUFBQSxNQUFNLENBQUN4QixTQUFELENBQU4sQ0FBa0J1QixVQUFsQjtBQUNBLENBRkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChDKSBNSUtPIExMQyAtIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqIFVuYXV0aG9yaXplZCBjb3B5aW5nIG9mIHRoaXMgZmlsZSwgdmlhIGFueSBtZWRpdW0gaXMgc3RyaWN0bHkgcHJvaGliaXRlZFxuICogUHJvcHJpZXRhcnkgYW5kIGNvbmZpZGVudGlhbFxuICogV3JpdHRlbiBieSBOaWtvbGF5IEJla2V0b3YsIDExIDIwMThcbiAqXG4gKi9cbmNvbnN0IGlkVXJsICAgICA9ICdtb2R1bGUtdGVtcGxhdGUnO1xuY29uc3QgaWRGb3JtICAgID0gJ21vZHVsZS10ZW1wbGF0ZS1mb3JtJztcbmNvbnN0IGNsYXNzTmFtZSA9ICdNb2R1bGVUZW1wbGF0ZSc7XG5jb25zdCBpbnB1dENsYXNzTmFtZSA9ICdtaWtvcGJ4LW1vZHVsZS1pbnB1dCc7XG5cbi8qIGdsb2JhbCBnbG9iYWxSb290VXJsLCBnbG9iYWxUcmFuc2xhdGUsIEZvcm0sIENvbmZpZyAqL1xuY29uc3QgTW9kdWxlVGVtcGxhdGUgPSB7XG5cdCRmb3JtT2JqOiAkKCcjJytpZEZvcm0pLFxuXHQkY2hlY2tCb3hlczogJCgnIycraWRGb3JtKycgLnVpLmNoZWNrYm94JyksXG5cdCRkcm9wRG93bnM6ICQoJyMnK2lkRm9ybSsnIC51aS5kcm9wZG93bicpLFxuXHRzYXZlVGFibGVBSkFYVXJsOiBnbG9iYWxSb290VXJsICsgaWRVcmwgKyBcIi9zYXZlVGFibGVEYXRhXCIsXG5cdGRlbGV0ZVJlY29yZEFKQVhVcmw6IGdsb2JhbFJvb3RVcmwgKyBpZFVybCArIFwiL2RlbGV0ZVwiLFxuXHQkZGlzYWJpbGl0eUZpZWxkczogJCgnIycraWRGb3JtKycgIC5kaXNhYmlsaXR5JyksXG5cdCRzdGF0dXNUb2dnbGU6ICQoJyNtb2R1bGUtc3RhdHVzLXRvZ2dsZScpLFxuXHQkbW9kdWxlU3RhdHVzOiAkKCcjc3RhdHVzJyksXG5cdC8qKlxuXHQgKiBGaWVsZCB2YWxpZGF0aW9uIHJ1bGVzXG5cdCAqIGh0dHBzOi8vc2VtYW50aWMtdWkuY29tL2JlaGF2aW9ycy9mb3JtLmh0bWxcblx0ICovXG5cdHZhbGlkYXRlUnVsZXM6IHtcblx0XHR0ZXh0RmllbGQ6IHtcblx0XHRcdGlkZW50aWZpZXI6ICd0ZXh0X2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0YXJlYUZpZWxkOiB7XG5cdFx0XHRpZGVudGlmaWVyOiAndGV4dF9hcmVhX2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdFx0cGFzc3dvcmRGaWVsZDoge1xuXHRcdFx0aWRlbnRpZmllcjogJ3Bhc3N3b3JkX2ZpZWxkJyxcblx0XHRcdHJ1bGVzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR0eXBlOiAnZW1wdHknLFxuXHRcdFx0XHRcdHByb21wdDogZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfVmFsaWRhdGVWYWx1ZUlzRW1wdHksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0sXG5cdH0sXG5cdC8qKlxuXHQgKiBPbiBwYWdlIGxvYWQgd2UgaW5pdCBzb21lIFNlbWFudGljIFVJIGxpYnJhcnlcblx0ICovXG5cdGluaXRpYWxpemUoKSB7XG5cdFx0Ly8g0LjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDRh9C10LrQsdC+0LrRgdGLINC4INCy0YvQv9C+0LTQsNGO0YnQuNC1INC80LXQvdGO0YjQutC4XG5cdFx0d2luZG93W2NsYXNzTmFtZV0uJGNoZWNrQm94ZXMuY2hlY2tib3goKTtcblx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kZHJvcERvd25zLmRyb3Bkb3duKCk7XG5cdFx0d2luZG93W2NsYXNzTmFtZV0uY2hlY2tTdGF0dXNUb2dnbGUoKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignTW9kdWxlU3RhdHVzQ2hhbmdlZCcsIHdpbmRvd1tjbGFzc05hbWVdLmNoZWNrU3RhdHVzVG9nZ2xlKTtcblx0XHR3aW5kb3dbY2xhc3NOYW1lXS5pbml0aWFsaXplRm9ybSgpO1xuXHRcdCQoJy5tZW51IC5pdGVtJykudGFiKCk7XG5cdFx0JC5nZXQoIGlkVXJsICsgJy9nZXRUYWJsZXNEZXNjcmlwdGlvbicsIGZ1bmN0aW9uKCByZXN1bHQgKSB7XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gcmVzdWx0WydkYXRhJ10pIHtcblx0XHRcdFx0bGV0IHRhYmxlTmFtZSA9IGtleSArICctdGFibGUnO1xuXHRcdFx0XHRpZiggJCgnIycrdGFibGVOYW1lKS5hdHRyKCdpZCcpID09PSB1bmRlZmluZWQpe1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLmluaXRUYWJsZSh0YWJsZU5hbWUsIHJlc3VsdFsnZGF0YSddW2tleV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHQvKipcblx0ICog0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXRgiDRgdC/0LjRgdC+0Log0LLRi9Cx0L7RgNCwXG5cdCAqIEBwYXJhbSBzZWxlY3RlZFxuXHQgKiBAcmV0dXJucyB7W119XG5cdCAqL1xuXHRtYWtlRHJvcGRvd25MaXN0KHNlbGVjdFR5cGUsIHNlbGVjdGVkKSB7XG5cdFx0Y29uc3QgdmFsdWVzID0gW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lOiAnIC0tLSAnLFxuXHRcdFx0XHR2YWx1ZTogJycsXG5cdFx0XHRcdHNlbGVjdGVkOiAoJycgPT09IHNlbGVjdGVkKSxcblx0XHRcdH1cblx0XHRdO1xuXHRcdCQoJyMnK3NlbGVjdFR5cGUrJyBvcHRpb24nKS5lYWNoKChpbmRleCwgb2JqKSA9PiB7XG5cdFx0XHR2YWx1ZXMucHVzaCh7XG5cdFx0XHRcdG5hbWU6IG9iai50ZXh0LFxuXHRcdFx0XHR2YWx1ZTogb2JqLnZhbHVlLFxuXHRcdFx0XHRzZWxlY3RlZDogKHNlbGVjdGVkID09PSBvYmoudmFsdWUpLFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHZhbHVlcztcblx0fSxcblx0LyoqXG5cdCAqINCe0LHRgNCw0LHQvtGC0LrQsCDQuNC30LzQtdC90LXQvdC40Y8g0LPRgNGD0L/Qv9GLINCyINGB0L/QuNGB0LrQtVxuXHQgKi9cblx0Y2hhbmdlR3JvdXBJbkxpc3QodmFsdWUsIHRleHQsIGNob2ljZSkge1xuXHRcdGxldCB0ZElucHV0ID0gJChjaG9pY2UpLmNsb3Nlc3QoJ3RkJykuZmluZCgnaW5wdXQnKTtcblx0XHR0ZElucHV0LmF0dHIoJ2RhdGEtdmFsdWUnLCBcdHZhbHVlKTtcblx0XHR0ZElucHV0LmF0dHIoJ3ZhbHVlJywgXHRcdHZhbHVlKTtcblx0XHRsZXQgY3VycmVudFJvd0lkID0gJChjaG9pY2UpLmNsb3Nlc3QoJ3RyJykuYXR0cignaWQnKTtcblx0XHRsZXQgdGFibGVOYW1lICAgID0gJChjaG9pY2UpLmNsb3Nlc3QoJ3RhYmxlJykuYXR0cignaWQnKS5yZXBsYWNlKCctdGFibGUnLCAnJyk7XG5cdFx0aWYgKGN1cnJlbnRSb3dJZCAhPT0gdW5kZWZpbmVkICYmIHRhYmxlTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS5zZW5kQ2hhbmdlc1RvU2VydmVyKHRhYmxlTmFtZSwgY3VycmVudFJvd0lkKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEFkZCBuZXcgVGFibGUuXG5cdCAqL1xuXHRpbml0VGFibGUodGFibGVOYW1lLCBvcHRpb25zKSB7XG5cdFx0bGV0IGNvbHVtbnMgPSBbXTtcblx0XHRsZXQgY29sdW1uc0FycmF5NFNvcnQgPSBbXVxuXHRcdGZvciAobGV0IGNvbE5hbWUgaW4gb3B0aW9uc1snY29scyddKSB7XG5cdFx0XHRjb2x1bW5zLnB1c2goIHtkYXRhOiBjb2xOYW1lfSk7XG5cdFx0XHRjb2x1bW5zQXJyYXk0U29ydC5wdXNoKGNvbE5hbWUpO1xuXHRcdH1cblx0XHQkKCcjJyArIHRhYmxlTmFtZSkuRGF0YVRhYmxlKCB7XG5cdFx0XHRhamF4OiB7XG5cdFx0XHRcdHVybDogaWRVcmwgKyBvcHRpb25zLmFqYXhVcmwgKyAnP3RhYmxlPScgK3RhYmxlTmFtZS5yZXBsYWNlKCctdGFibGUnLCAnJyksXG5cdFx0XHRcdGRhdGFTcmM6ICdkYXRhJ1xuXHRcdFx0fSxcblx0XHRcdGNvbHVtbnM6IGNvbHVtbnMsXG5cdFx0XHRwYWdpbmc6IHRydWUsXG5cdFx0XHRzRG9tOiAncnRpcCcsXG5cdFx0XHRkZWZlclJlbmRlcjogdHJ1ZSxcblx0XHRcdHBhZ2VMZW5ndGg6IDE3LFxuXHRcdFx0aW5mb0NhbGxiYWNrKCBzZXR0aW5ncywgc3RhcnQsIGVuZCwgbWF4LCB0b3RhbCwgcHJlICkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9LFxuXHRcdFx0bGFuZ3VhZ2U6IFNlbWFudGljTG9jYWxpemF0aW9uLmRhdGFUYWJsZUxvY2FsaXNhdGlvbixcblx0XHRcdG9yZGVyaW5nOiBmYWxzZSxcblx0XHRcdC8qKlxuXHRcdFx0ICogQnVpbGRlciByb3cgcHJlc2VudGF0aW9uXG5cdFx0XHQgKiBAcGFyYW0gcm93XG5cdFx0XHQgKiBAcGFyYW0gZGF0YVxuXHRcdFx0ICovXG5cdFx0XHRjcmVhdGVkUm93KHJvdywgZGF0YSkge1xuXHRcdFx0XHRsZXQgY29scyAgICA9ICQoJ3RkJywgcm93KTtcblx0XHRcdFx0bGV0IGhlYWRlcnMgPSAkKCcjJysgdGFibGVOYW1lICsgJyB0aGVhZCB0ciB0aCcpO1xuXHRcdFx0XHRmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdGxldCBpbmRleCA9IGNvbHVtbnNBcnJheTRTb3J0LmluZGV4T2Yoa2V5KTtcblx0XHRcdFx0XHRpZihrZXkgPT09ICdyb3dJY29uJyl7XG5cdFx0XHRcdFx0XHRjb2xzLmVxKGluZGV4KS5odG1sKCc8aSBjbGFzcz1cInVpICcgKyBkYXRhW2tleV0gKyAnIGNpcmNsZSBpY29uXCI+PC9pPicpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ2RlbEJ1dHRvbicpe1xuXHRcdFx0XHRcdFx0bGV0IHRlbXBsYXRlRGVsZXRlQnV0dG9uID0gJzxkaXYgY2xhc3M9XCJ1aSBzbWFsbCBiYXNpYyBpY29uIGJ1dHRvbnMgYWN0aW9uLWJ1dHRvbnNcIj4nICtcblx0XHRcdFx0XHRcdFx0JzxhIGhyZWY9XCInICsgd2luZG93W2NsYXNzTmFtZV0uZGVsZXRlUmVjb3JkQUpBWFVybCArICcvJyArXG5cdFx0XHRcdFx0XHRcdGRhdGEuaWQgKyAnXCIgZGF0YS12YWx1ZSA9IFwiJyArIGRhdGEuRFRfUm93SWQgKyAnXCInICtcblx0XHRcdFx0XHRcdFx0JyBjbGFzcz1cInVpIGJ1dHRvbiBkZWxldGUgdHdvLXN0ZXBzLWRlbGV0ZSBwb3B1cGVkXCIgZGF0YS1jb250ZW50PVwiJyArIGdsb2JhbFRyYW5zbGF0ZS5idF9Ub29sVGlwRGVsZXRlICsgJ1wiPicgK1xuXHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJpY29uIHRyYXNoIHJlZFwiPjwvaT48L2E+PC9kaXY+Jztcblx0XHRcdFx0XHRcdGNvbHMuZXEoaW5kZXgpLmh0bWwodGVtcGxhdGVEZWxldGVCdXR0b24pO1xuXHRcdFx0XHRcdH1lbHNlIGlmKGtleSA9PT0gJ3ByaW9yaXR5Jyl7XG5cdFx0XHRcdFx0XHRjb2xzLmVxKGluZGV4KS5hZGRDbGFzcygnZHJhZ0hhbmRsZScpXG5cdFx0XHRcdFx0XHRjb2xzLmVxKGluZGV4KS5odG1sKCc8aSBjbGFzcz1cInVpIHNvcnQgY2lyY2xlIGljb25cIj48L2k+Jyk7XG5cdFx0XHRcdFx0XHQvLyDQn9GA0LjQvtGA0LjRgtC10YIg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LTQu9GPINGB0YLRgNC+0LrQuC5cblx0XHRcdFx0XHRcdCQocm93KS5hdHRyKCdtLXByaW9yaXR5JywgZGF0YVtrZXldKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGxldCB0ZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwidWkgdHJhbnNwYXJlbnQgZmx1aWQgaW5wdXQgaW5saW5lLWVkaXRcIj4nICtcblx0XHRcdFx0XHRcdFx0JzxpbnB1dCBjb2xOYW1lPVwiJytrZXkrJ1wiIGNsYXNzPVwiJytpbnB1dENsYXNzTmFtZSsnXCIgdHlwZT1cInRleHRcIiBkYXRhLXZhbHVlPVwiJytkYXRhW2tleV0gKyAnXCIgdmFsdWU9XCInICsgZGF0YVtrZXldICsgJ1wiPjwvZGl2Pic7XG5cdFx0XHRcdFx0XHQkKCd0ZCcsIHJvdykuZXEoaW5kZXgpLmh0bWwodGVtcGxhdGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihvcHRpb25zWydjb2xzJ11ba2V5XSA9PT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsZXQgYWRkaXRpb25hbENsYXNzID0gb3B0aW9uc1snY29scyddW2tleV1bJ2NsYXNzJ107XG5cdFx0XHRcdFx0aWYoYWRkaXRpb25hbENsYXNzICE9PSB1bmRlZmluZWQgJiYgYWRkaXRpb25hbENsYXNzICE9PSAnJyl7XG5cdFx0XHRcdFx0XHRoZWFkZXJzLmVxKGluZGV4KS5hZGRDbGFzcyhhZGRpdGlvbmFsQ2xhc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsZXQgaGVhZGVyID0gb3B0aW9uc1snY29scyddW2tleV1bJ2hlYWRlciddO1xuXHRcdFx0XHRcdGlmKGhlYWRlciAhPT0gdW5kZWZpbmVkICYmIGhlYWRlciAhPT0gJycpe1xuXHRcdFx0XHRcdFx0aGVhZGVycy5lcShpbmRleCkuaHRtbChoZWFkZXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGxldCBzZWxlY3RNZXRhRGF0YSA9IG9wdGlvbnNbJ2NvbHMnXVtrZXldWydzZWxlY3QnXTtcblx0XHRcdFx0XHRpZihzZWxlY3RNZXRhRGF0YSAhPT0gdW5kZWZpbmVkKXtcblx0XHRcdFx0XHRcdGxldCBuZXdUZW1wbGF0ZSA9ICQoJyN0ZW1wbGF0ZS1zZWxlY3QnKS5odG1sKCkucmVwbGFjZSgnUEFSQU0nLCBkYXRhW2tleV0pO1xuXHRcdFx0XHRcdFx0bGV0IHRlbXBsYXRlID0gJzxpbnB1dCBjbGFzcz1cIicraW5wdXRDbGFzc05hbWUrJ1wiIGNvbE5hbWU9XCInK2tleSsnXCIgc2VsZWN0VHlwZT1cIicrc2VsZWN0TWV0YURhdGErJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiB0eXBlPVwidGV4dFwiIGRhdGEtdmFsdWU9XCInK2RhdGFba2V5XSArICdcIiB2YWx1ZT1cIicgKyBkYXRhW2tleV0gKyAnXCI+PC9kaXY+Jztcblx0XHRcdFx0XHRcdGNvbHMuZXEoaW5kZXgpLmh0bWwobmV3VGVtcGxhdGUgKyB0ZW1wbGF0ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0LyoqXG5cdFx0XHQgKiBEcmF3IGV2ZW50IC0gZmlyZWQgb25jZSB0aGUgdGFibGUgaGFzIGNvbXBsZXRlZCBhIGRyYXcuXG5cdFx0XHQgKi9cblx0XHRcdGRyYXdDYWxsYmFjayhzZXR0aW5ncykge1xuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS5kcm93U2VsZWN0R3JvdXAoc2V0dGluZ3Muc1RhYmxlSWQpO1xuXHRcdFx0fSxcblx0XHR9ICk7XG5cblx0XHRsZXQgYm9keSA9ICQoJ2JvZHknKTtcblx0XHQvLyDQmtC70LjQuiDQv9C+INC/0L7Qu9GOLiDQktGF0L7QtCDQtNC70Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDQt9C90LDRh9C10L3QuNGPLlxuXHRcdGJvZHkub24oJ2ZvY3VzaW4nLCAnLicraW5wdXRDbGFzc05hbWUsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHQkKGUudGFyZ2V0KS50cmFuc2l0aW9uKCdnbG93Jyk7XG5cdFx0XHQkKGUudGFyZ2V0KS5jbG9zZXN0KCdkaXYnKS5yZW1vdmVDbGFzcygndHJhbnNwYXJlbnQnKS5hZGRDbGFzcygnY2hhbmdlZC1maWVsZCcpO1xuXHRcdFx0JChlLnRhcmdldCkuYXR0cigncmVhZG9ubHknLCBmYWxzZSk7XG5cdFx0fSlcblx0XHQvLyDQntGC0L/RgNCw0LLQutCwINGE0L7RgNC80Ysg0L3QsCDRgdC10YDQstC10YAg0L/QviBFbnRlciDQuNC70LggVGFiXG5cdFx0JChkb2N1bWVudCkub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0bGV0IGtleUNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcblx0XHRcdGlmIChrZXlDb2RlID09PSAxMyB8fCBrZXlDb2RlID09PSA5ICYmICQoJzpmb2N1cycpLmhhc0NsYXNzKCdtaWtvcGJ4LW1vZHVsZS1pbnB1dCcpKSB7XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLmVuZEVkaXRJbnB1dCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ym9keS5vbignY2xpY2snLCAnYS5kZWxldGUnLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0bGV0IGN1cnJlbnRSb3dJZCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ3RyJykuYXR0cignaWQnKTtcblx0XHRcdGxldCB0YWJsZU5hbWUgICAgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCd0YWJsZScpLmF0dHIoJ2lkJykucmVwbGFjZSgnLXRhYmxlJywgJycpO1xuXHRcdFx0d2luZG93W2NsYXNzTmFtZV0uZGVsZXRlUm93KHRhYmxlTmFtZSwgY3VycmVudFJvd0lkKTtcblx0XHR9KTsgLy8g0JTQvtCx0LDQstC70LXQvdC40LUg0L3QvtCy0L7QuSDRgdGC0YDQvtC60LhcblxuXHRcdC8vINCe0YLQv9GA0LDQstC60LAg0YTQvtGA0LzRiyDQvdCwINGB0LXRgNCy0LXRgCDQv9C+INGD0YXQvtC00YMg0YEg0L/QvtC70Y8g0LLQstC+0LTQsFxuXHRcdGJvZHkub24oJ2ZvY3Vzb3V0JywgJy4nK2lucHV0Q2xhc3NOYW1lLCB3aW5kb3dbY2xhc3NOYW1lXS5lbmRFZGl0SW5wdXQpO1xuXG5cdFx0Ly8g0JrQvdC+0L/QutCwIFwi0JTQvtCx0LDQstC40YLRjCDQvdC+0LLRg9GOINC30LDQv9C40YHRjFwiXG5cdFx0JCgnW2lkLXRhYmxlID0gXCInK3RhYmxlTmFtZSsnXCJdJykub24oJ2NsaWNrJywgd2luZG93W2NsYXNzTmFtZV0uYWRkTmV3Um93KTtcblx0fSxcblxuXHQvKipcblx0ICog0J/QtdGA0LXQvNC10YnQtdC90LjQtSDRgdGC0YDQvtC60LgsINC40LfQvNC10L3QtdC90LjQtSDQv9GA0LjQvtGA0LjRgtC10YLQsC5cblx0ICovXG5cdGNiT25Ecm9wKHRhYmxlLCByb3cpIHtcblx0XHRsZXQgcHJpb3JpdHlXYXNDaGFuZ2VkID0gZmFsc2U7XG5cdFx0Y29uc3QgcHJpb3JpdHlEYXRhID0ge307XG5cdFx0JCh0YWJsZSkuZmluZCgndHInKS5lYWNoKChpbmRleCwgb2JqKSA9PiB7XG5cdFx0XHRjb25zdCBydWxlSWQgPSAkKG9iaikuYXR0cignaWQnKTtcblx0XHRcdGNvbnN0IG9sZFByaW9yaXR5ID0gcGFyc2VJbnQoJChvYmopLmF0dHIoJ20tcHJpb3JpdHknKSwgMTApO1xuXHRcdFx0Y29uc3QgbmV3UHJpb3JpdHkgPSBvYmoucm93SW5kZXg7XG5cdFx0XHRpZiAoIWlzTmFOKCBydWxlSWQgKSAmJiBvbGRQcmlvcml0eSAhPT0gbmV3UHJpb3JpdHkpIHtcblx0XHRcdFx0cHJpb3JpdHlXYXNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0cHJpb3JpdHlEYXRhW3J1bGVJZF0gPSBuZXdQcmlvcml0eTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRpZiAocHJpb3JpdHlXYXNDaGFuZ2VkKSB7XG5cdFx0XHQkLmFwaSh7XG5cdFx0XHRcdG9uOiAnbm93Jyxcblx0XHRcdFx0dXJsOiBgJHtnbG9iYWxSb290VXJsfSR7aWRVcmx9L2NoYW5nZVByaW9yaXR5P3RhYmxlPWArJCh0YWJsZSkuYXR0cignaWQnKS5yZXBsYWNlKCctdGFibGUnLCAnJyksXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhOiBwcmlvcml0eURhdGEsXG5cdFx0XHR9KTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqINCe0LrQvtC90YfQsNC90LjQtSDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINC/0L7Qu9GPINCy0LLQvtC00LAuXG5cdCAqINCd0LUg0L7RgtC90L7RgdC40YLRgdGPINC6IHNlbGVjdC5cblx0ICogQHBhcmFtIGVcblx0ICovXG5cdGVuZEVkaXRJbnB1dChlKXtcblx0XHRsZXQgJGVsID0gJCgnLmNoYW5nZWQtZmllbGQnKS5jbG9zZXN0KCd0cicpO1xuXHRcdCRlbC5lYWNoKGZ1bmN0aW9uIChpbmRleCwgb2JqKSB7XG5cdFx0XHRsZXQgY3VycmVudFJvd0lkID0gJChvYmopLmF0dHIoJ2lkJyk7XG5cdFx0XHRsZXQgdGFibGVOYW1lICAgID0gJChvYmopLmNsb3Nlc3QoJ3RhYmxlJykuYXR0cignaWQnKS5yZXBsYWNlKCctdGFibGUnLCAnJyk7XG5cdFx0XHRpZiAoY3VycmVudFJvd0lkICE9PSB1bmRlZmluZWQgJiYgdGFibGVOYW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0d2luZG93W2NsYXNzTmFtZV0uc2VuZENoYW5nZXNUb1NlcnZlcih0YWJsZU5hbWUsIGN1cnJlbnRSb3dJZCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqINCU0L7QsdCw0LLQu9C10L3QuNC1INC90L7QstC+0Lkg0YHRgtGA0L7QutC4INCyINGC0LDQsdC70LjRhtGDLlxuXHQgKiBAcGFyYW0gZVxuXHQgKi9cblx0YWRkTmV3Um93KGUpe1xuXHRcdGxldCBpZFRhYmxlID0gJChlLnRhcmdldCkuYXR0cignaWQtdGFibGUnKTtcblx0XHRsZXQgdGFibGUgICA9ICQoJyMnK2lkVGFibGUpO1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR0YWJsZS5maW5kKCcuZGF0YVRhYmxlc19lbXB0eScpLnJlbW92ZSgpO1xuXHRcdC8vINCe0YLQv9GA0LDQstC40Lwg0L3QsCDQt9Cw0L/QuNGB0Ywg0LLRgdC1INGH0YLQviDQvdC1INC30LDQv9C40YHQsNC90L4g0LXRidC1XG5cdFx0bGV0ICRlbCA9IHRhYmxlLmZpbmQoJy5jaGFuZ2VkLWZpZWxkJykuY2xvc2VzdCgndHInKTtcblx0XHQkZWwuZWFjaChmdW5jdGlvbiAoaW5kZXgsIG9iaikge1xuXHRcdFx0bGV0IGN1cnJlbnRSb3dJZCA9ICQob2JqKS5hdHRyKCdpZCcpO1xuXHRcdFx0aWYgKGN1cnJlbnRSb3dJZCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLnNlbmRDaGFuZ2VzVG9TZXJ2ZXIoY3VycmVudFJvd0lkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRsZXQgaWQgPSBcIm5ld1wiK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1hdGguZmxvb3IoNTAwKSk7XG5cdFx0bGV0IHJvd1RlbXBsYXRlID0gJzx0ciBpZD1cIicraWQrJ1wiIHJvbGU9XCJyb3dcIiBjbGFzcz1cImV2ZW5cIj4nK3RhYmxlLmZpbmQoJ3RyI1RFTVBMQVRFJykuaHRtbCgpLnJlcGxhY2UoJ1RFTVBMQVRFJywgaWQpKyc8L3RyPic7XG5cdFx0dGFibGUuZmluZCgndGJvZHkgPiB0cjpmaXJzdCcpLmJlZm9yZShyb3dUZW1wbGF0ZSk7XG5cdFx0d2luZG93W2NsYXNzTmFtZV0uZHJvd1NlbGVjdEdyb3VwKGlkVGFibGUpO1xuXHR9LFxuXHQvKipcblx0ICog0J7QsdC90L7QstC70LXQvdC40LUgc2VsZWN0INGN0LvQtdC80LXQvdGC0L7Qsi5cblx0ICogQHBhcmFtIHRhYmxlSWRcblx0ICovXG5cdGRyb3dTZWxlY3RHcm91cCh0YWJsZUlkKSB7XG5cdFx0JCgnIycgKyB0YWJsZUlkKS5maW5kKCd0ciNURU1QTEFURScpLmhpZGUoKTtcblx0XHRsZXQgc2VsZXN0R3JvdXAgPSAkKCcuc2VsZWN0LWdyb3VwJyk7XG5cdFx0c2VsZXN0R3JvdXAuZWFjaCgoaW5kZXgsIG9iaikgPT4ge1xuXHRcdFx0bGV0IHNlbGVjdFR5cGUgPSAkKG9iaikuY2xvc2VzdCgndGQnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ3NlbGVjdFR5cGUnKTtcblx0XHRcdCQob2JqKS5kcm9wZG93bih7XG5cdFx0XHRcdHZhbHVlczogd2luZG93W2NsYXNzTmFtZV0ubWFrZURyb3Bkb3duTGlzdChzZWxlY3RUeXBlLCAkKG9iaikuYXR0cignZGF0YS12YWx1ZScpKSxcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHRcdHNlbGVzdEdyb3VwLmRyb3Bkb3duKHtcblx0XHRcdG9uQ2hhbmdlOiB3aW5kb3dbY2xhc3NOYW1lXS5jaGFuZ2VHcm91cEluTGlzdCxcblx0XHR9KTtcblxuXHRcdCQoJyMnICsgdGFibGVJZCkudGFibGVEbkQoe1xuXHRcdFx0b25Ecm9wOiB3aW5kb3dbY2xhc3NOYW1lXS5jYk9uRHJvcCxcblx0XHRcdG9uRHJhZ0NsYXNzOiAnaG92ZXJpbmdSb3cnLFxuXHRcdFx0ZHJhZ0hhbmRsZTogJy5kcmFnSGFuZGxlJyxcblx0XHR9KTtcblx0fSxcblx0LyoqXG5cdCAqINCj0LTQsNC70LXQvdC40LUg0YHRgtGA0L7QutC4XG5cdCAqIEBwYXJhbSB0YWJsZU5hbWVcblx0ICogQHBhcmFtIGlkIC0gcmVjb3JkIGlkXG5cdCAqL1xuXHRkZWxldGVSb3codGFibGVOYW1lLCBpZCkge1xuXHRcdGxldCB0YWJsZSA9ICQoJyMnKyB0YWJsZU5hbWUrJy10YWJsZScpO1xuXHRcdGlmIChpZC5zdWJzdHIoMCwzKSA9PT0gJ25ldycpIHtcblx0XHRcdHRhYmxlLmZpbmQoJ3RyIycraWQpLnJlbW92ZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQkLmFwaSh7XG5cdFx0XHR1cmw6IHdpbmRvd1tjbGFzc05hbWVdLmRlbGV0ZVJlY29yZEFKQVhVcmwrJz9pZD0nK2lkKycmdGFibGU9Jyt0YWJsZU5hbWUsXG5cdFx0XHRvbjogJ25vdycsXG5cdFx0XHRvblN1Y2Nlc3MocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHR0YWJsZS5maW5kKCd0ciMnK2lkKS5yZW1vdmUoKTtcblx0XHRcdFx0XHRpZiAodGFibGUuZmluZCgndGJvZHkgPiB0cicpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0dGFibGUuZmluZCgndGJvZHknKS5hcHBlbmQoJzx0ciBjbGFzcz1cIm9kZFwiPjwvdHI+Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqINCe0YLQv9GA0LDQstC60LAg0LTQsNC90L3Ri9GFINC90LAg0YHQtdGA0LLQtdGAINC/0YDQuCDQuNC30LzQtdC90LjQuFxuXHQgKi9cblx0c2VuZENoYW5nZXNUb1NlcnZlcih0YWJsZU5hbWUsIHJlY29yZElkKSB7XG5cdFx0bGV0IGRhdGEgPSB7ICdwYngtdGFibGUtaWQnOiB0YWJsZU5hbWUsICdwYngtcm93LWlkJzogIHJlY29yZElkfTtcblx0XHRsZXQgbm90RW1wdHkgPSBmYWxzZTtcblx0XHQkKFwidHIjXCIrcmVjb3JkSWQgKyAnIC4nICsgaW5wdXRDbGFzc05hbWUpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBvYmopIHtcblx0XHRcdGxldCBjb2xOYW1lID0gJChvYmopLmF0dHIoJ2NvbE5hbWUnKTtcblx0XHRcdGlmKGNvbE5hbWUgIT09IHVuZGVmaW5lZCl7XG5cdFx0XHRcdGRhdGFbJChvYmopLmF0dHIoJ2NvbE5hbWUnKV0gPSAkKG9iaikudmFsKCk7XG5cdFx0XHRcdGlmKCQob2JqKS52YWwoKSAhPT0gJycpe1xuXHRcdFx0XHRcdG5vdEVtcHR5ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYobm90RW1wdHkgPT09IGZhbHNlKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0JChcInRyI1wiK3JlY29yZElkK1wiIC51c2VyLmNpcmNsZVwiKS5yZW1vdmVDbGFzcygndXNlciBjaXJjbGUnKS5hZGRDbGFzcygnc3Bpbm5lciBsb2FkaW5nJyk7XG5cdFx0JC5hcGkoe1xuXHRcdFx0dXJsOiB3aW5kb3dbY2xhc3NOYW1lXS5zYXZlVGFibGVBSkFYVXJsLFxuXHRcdFx0b246ICdub3cnLFxuXHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0c3VjY2Vzc1Rlc3QocmVzcG9uc2UpIHtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlICE9PSB1bmRlZmluZWQgJiYgT2JqZWN0LmtleXMocmVzcG9uc2UpLmxlbmd0aCA+IDAgJiYgcmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRvblN1Y2Nlc3MocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGxldCByb3dJZCA9IHJlc3BvbnNlLmRhdGFbJ3BieC1yb3ctaWQnXTtcblx0XHRcdFx0XHRsZXQgdGFibGUgPSAkKCcjJytyZXNwb25zZS5kYXRhWydwYngtdGFibGUtaWQnXSsnLXRhYmxlJyk7XG5cdFx0XHRcdFx0dGFibGUuZmluZChcInRyI1wiICsgcm93SWQgKyBcIiBpbnB1dFwiKS5hdHRyKCdyZWFkb25seScsIHRydWUpO1xuXHRcdFx0XHRcdHRhYmxlLmZpbmQoXCJ0ciNcIiArIHJvd0lkICsgXCIgZGl2XCIpLnJlbW92ZUNsYXNzKCdjaGFuZ2VkLWZpZWxkIGxvYWRpbmcnKS5hZGRDbGFzcygndHJhbnNwYXJlbnQnKTtcblx0XHRcdFx0XHR0YWJsZS5maW5kKFwidHIjXCIgKyByb3dJZCArIFwiIC5zcGlubmVyLmxvYWRpbmdcIikuYWRkQ2xhc3MoJ3VzZXIgY2lyY2xlJykucmVtb3ZlQ2xhc3MoJ3NwaW5uZXIgbG9hZGluZycpO1xuXG5cdFx0XHRcdFx0aWYgKHJvd0lkICE9PSByZXNwb25zZS5kYXRhWyduZXdJZCddKXtcblx0XHRcdFx0XHRcdCQoYHRyIyR7cm93SWR9YCkuYXR0cignaWQnLCByZXNwb25zZS5kYXRhWyduZXdJZCddKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRvbkZhaWx1cmUocmVzcG9uc2UpIHtcblx0XHRcdFx0aWYgKHJlc3BvbnNlLm1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFVzZXJNZXNzYWdlLnNob3dNdWx0aVN0cmluZyhyZXNwb25zZS5tZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkKFwidHIjXCIgKyByZWNvcmRJZCArIFwiIC5zcGlubmVyLmxvYWRpbmdcIikuYWRkQ2xhc3MoJ3VzZXIgY2lyY2xlJykucmVtb3ZlQ2xhc3MoJ3NwaW5uZXIgbG9hZGluZycpO1xuXHRcdFx0fSxcblx0XHRcdG9uRXJyb3IoZXJyb3JNZXNzYWdlLCBlbGVtZW50LCB4aHIpIHtcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDQwMykge1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IGdsb2JhbFJvb3RVcmwgKyBcInNlc3Npb24vaW5kZXhcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHQvKipcblx0ICogQ2hhbmdlIHNvbWUgZm9ybSBlbGVtZW50cyBjbGFzc2VzIGRlcGVuZHMgb2YgbW9kdWxlIHN0YXR1c1xuXHQgKi9cblx0Y2hlY2tTdGF0dXNUb2dnbGUoKSB7XG5cdFx0aWYgKHdpbmRvd1tjbGFzc05hbWVdLiRzdGF0dXNUb2dnbGUuY2hlY2tib3goJ2lzIGNoZWNrZWQnKSkge1xuXHRcdFx0d2luZG93W2NsYXNzTmFtZV0uJGRpc2FiaWxpdHlGaWVsZHMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzLnNob3coKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2luZG93W2NsYXNzTmFtZV0uJGRpc2FiaWxpdHlGaWVsZHMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzLmhpZGUoKTtcblx0XHR9XG5cdH0sXG5cdC8qKlxuXHQgKiBTZW5kIGNvbW1hbmQgdG8gcmVzdGFydCBtb2R1bGUgd29ya2VycyBhZnRlciBkYXRhIGNoYW5nZXMsXG5cdCAqIEFsc28gd2UgY2FuIGRvIGl0IG9uIFRlbXBsYXRlQ29uZi0+bW9kZWxzRXZlbnRDaGFuZ2VEYXRhIG1ldGhvZFxuXHQgKi9cblx0YXBwbHlDb25maWd1cmF0aW9uQ2hhbmdlcygpIHtcblx0XHR3aW5kb3dbY2xhc3NOYW1lXS5jaGFuZ2VTdGF0dXMoJ1VwZGF0aW5nJyk7XG5cdFx0JC5hcGkoe1xuXHRcdFx0dXJsOiBgJHtDb25maWcucGJ4VXJsfS9wYnhjb3JlL2FwaS9tb2R1bGVzL2ArY2xhc3NOYW1lK2AvcmVsb2FkYCxcblx0XHRcdG9uOiAnbm93Jyxcblx0XHRcdHN1Y2Nlc3NUZXN0KHJlc3BvbnNlKSB7XG5cdFx0XHRcdC8vIHRlc3Qgd2hldGhlciBhIEpTT04gcmVzcG9uc2UgaXMgdmFsaWRcblx0XHRcdFx0cmV0dXJuIE9iamVjdC5rZXlzKHJlc3BvbnNlKS5sZW5ndGggPiAwICYmIHJlc3BvbnNlLnJlc3VsdCA9PT0gdHJ1ZTtcblx0XHRcdH0sXG5cdFx0XHRvblN1Y2Nlc3MoKSB7XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLmNoYW5nZVN0YXR1cygnQ29ubmVjdGVkJyk7XG5cdFx0XHR9LFxuXHRcdFx0b25GYWlsdXJlKCkge1xuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS5jaGFuZ2VTdGF0dXMoJ0Rpc2Nvbm5lY3RlZCcpO1xuXHRcdFx0fSxcblx0XHR9KTtcblx0fSxcblx0LyoqXG5cdCAqIFdlIGNhbiBtb2RpZnkgc29tZSBkYXRhIGJlZm9yZSBmb3JtIHNlbmRcblx0ICogQHBhcmFtIHNldHRpbmdzXG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKi9cblx0Y2JCZWZvcmVTZW5kRm9ybShzZXR0aW5ncykge1xuXHRcdGNvbnN0IHJlc3VsdCA9IHNldHRpbmdzO1xuXHRcdHJlc3VsdC5kYXRhID0gd2luZG93W2NsYXNzTmFtZV0uJGZvcm1PYmouZm9ybSgnZ2V0IHZhbHVlcycpO1xuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cdC8qKlxuXHQgKiBTb21lIGFjdGlvbnMgYWZ0ZXIgZm9ybXMgc2VuZFxuXHQgKi9cblx0Y2JBZnRlclNlbmRGb3JtKCkge1xuXHRcdHdpbmRvd1tjbGFzc05hbWVdLmFwcGx5Q29uZmlndXJhdGlvbkNoYW5nZXMoKTtcblx0fSxcblx0LyoqXG5cdCAqIEluaXRpYWxpemUgZm9ybSBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRpbml0aWFsaXplRm9ybSgpIHtcblx0XHRGb3JtLiRmb3JtT2JqID0gd2luZG93W2NsYXNzTmFtZV0uJGZvcm1PYmo7XG5cdFx0Rm9ybS51cmwgPSBgJHtnbG9iYWxSb290VXJsfSR7aWRVcmx9L3NhdmVgO1xuXHRcdEZvcm0udmFsaWRhdGVSdWxlcyA9IHdpbmRvd1tjbGFzc05hbWVdLnZhbGlkYXRlUnVsZXM7XG5cdFx0Rm9ybS5jYkJlZm9yZVNlbmRGb3JtID0gd2luZG93W2NsYXNzTmFtZV0uY2JCZWZvcmVTZW5kRm9ybTtcblx0XHRGb3JtLmNiQWZ0ZXJTZW5kRm9ybSA9IHdpbmRvd1tjbGFzc05hbWVdLmNiQWZ0ZXJTZW5kRm9ybTtcblx0XHRGb3JtLmluaXRpYWxpemUoKTtcblx0fSxcblx0LyoqXG5cdCAqIFVwZGF0ZSB0aGUgbW9kdWxlIHN0YXRlIG9uIGZvcm0gbGFiZWxcblx0ICogQHBhcmFtIHN0YXR1c1xuXHQgKi9cblx0Y2hhbmdlU3RhdHVzKHN0YXR1cykge1xuXHRcdHN3aXRjaCAoc3RhdHVzKSB7XG5cdFx0XHRjYXNlICdDb25uZWN0ZWQnOlxuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdncmV5Jylcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3JlZCcpXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdncmVlbicpO1xuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzLmh0bWwoZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfQ29ubmVjdGVkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdEaXNjb25uZWN0ZWQnOlxuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdncmVlbicpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdyZWQnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnZ3JleScpO1xuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzLmh0bWwoZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfRGlzY29ubmVjdGVkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdVcGRhdGluZyc6XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLiRtb2R1bGVTdGF0dXNcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2dyZWVuJylcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3JlZCcpXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdncmV5Jyk7XG5cdFx0XHRcdHdpbmRvd1tjbGFzc05hbWVdLiRtb2R1bGVTdGF0dXMuaHRtbChgPGkgY2xhc3M9XCJzcGlubmVyIGxvYWRpbmcgaWNvblwiPjwvaT4ke2dsb2JhbFRyYW5zbGF0ZS5tb2RfdHBsX1VwZGF0ZVN0YXR1c31gKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdncmVlbicpXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdyZWQnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnZ3JleScpO1xuXHRcdFx0XHR3aW5kb3dbY2xhc3NOYW1lXS4kbW9kdWxlU3RhdHVzLmh0bWwoZ2xvYmFsVHJhbnNsYXRlLm1vZF90cGxfRGlzY29ubmVjdGVkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxufTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuXHR3aW5kb3dbY2xhc3NOYW1lXS5pbml0aWFsaXplKCk7XG59KTtcblxuIl19