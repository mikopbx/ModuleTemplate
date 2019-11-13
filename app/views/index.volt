<form class="ui large grey segment form" id="module-template-form">
    {{ form.render('id') }}

    <div class="ten wide field disability">
        <label >{{ t._('mod_tpl_TextFieldLabel') }}</label>
        {{ form.render('text_field') }}
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('mod_tpl_TextAreaFieldLabel') }}</label>
        {{ form.render('text_area_field') }}
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('mod_tpl_PasswordFieldLabel') }}</label>
        {{ form.render('password_field') }}
    </div>

    <div class="four wide field disability">
        <label>{{ t._('mod_tpl_IntegerFieldLabel') }}</label>
        {{ form.render('integer_field') }}
    </div>

    <div class="field disability">
        <div class="ui segment">
            <div class="ui checkbox">
                <label>{{ t._('mod_tpl_CheckBoxFieldLabel') }}</label>
                {{ form.render('checkbox_field') }}
            </div>
        </div>
    </div>

    <div class="field disability">
        <div class="ui segment">
            <div class="ui toggle checkbox">
                <label>{{ t._('mod_tpl_ToggleFieldLabel') }}</label>
                {{ form.render('toggle_field') }}
            </div>
        </div>
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('mod_tpl_DropDownFieldLabel') }}</label>
        {{ form.render('dropdown_field') }}
    </div>

    {{ partial("partials/submitbutton",['indexurl':'pbx-extension-modules/index/']) }}
</form>