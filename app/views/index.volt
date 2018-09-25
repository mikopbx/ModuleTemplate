<form class="ui large grey segment form" id="module-template-form">
    <div class="eight wide field">
        <label>{{ t._('mod_tpl_Server1CHostPort') }}</label>
        <div class="inline fields">
            <div class="twelve wide field">
                {{ form.render('server1chost') }}
            </div>
            <div class="four wide field">
                {{ form.render('server1cport') }}
            </div>
        </div>
    </div>
    <div class="five wide field">
        <label>{{ t._('mod_tpl_PublicationName') }}</label>
        {{ form.render('database') }}
    </div>
    <div class="five wide field">
        <label>{{ t._('mod_tpl_Login') }}</label>
        {{ form.render('login') }}
    </div>
    <div class="five wide field">
        <label>{{ t._('mod_tpl_Password') }}</label>
        {{ form.render('secret') }}
    </div>
    {{ partial("partials/submitbutton",['indexurl':'pbx-extension-modules/index/']) }}
</form>