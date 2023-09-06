{{ form('module-template/module-template/save', 'role': 'form', 'class': 'ui large form','id':'module-template-form') }}
    {{ form.render('id') }}

    <div class="ui ribbon label">
        <i class="phone icon"></i> 123456
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('module_template_TextFieldLabel') }}</label>
        {{ form.render('text_field') }}
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('module_template_TextAreaFieldLabel') }}</label>
        {{ form.render('text_area_field') }}
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('module_template_PasswordFieldLabel') }}</label>
        {{ form.render('password_field') }}
    </div>

    <div class="four wide field disability">
        <label>{{ t._('module_template_IntegerFieldLabel') }}</label>
        {{ form.render('integer_field') }}
    </div>

    <div class="field disability">
        <div class="ui segment">
            <div class="ui checkbox">
                <label>{{ t._('module_template_CheckBoxFieldLabel') }}</label>
                {{ form.render('checkbox_field') }}
            </div>
        </div>
    </div>

    <div class="field disability">
        <div class="ui segment">
            <div class="ui toggle checkbox">
                <label>{{ t._('module_template_ToggleFieldLabel') }}</label>
                {{ form.render('toggle_field') }}
            </div>
        </div>
    </div>

    <div class="ten wide field disability">
        <label >{{ t._('module_template_DropDownFieldLabel') }}</label>
        {{ form.render('dropdown_field') }}
    </div>

    {{ partial("partials/submitbutton",['indexurl':'module-template/module-template/index']) }}
{{ endform() }}