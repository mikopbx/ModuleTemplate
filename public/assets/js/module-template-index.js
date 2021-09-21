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
//# sourceMappingURL=module-template-index.js.map