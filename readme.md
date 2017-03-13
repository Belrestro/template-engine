<h1>Front end template engine</h1>

<p>This template engine is ought to load and compile distant templates into plan text or html</p>
<p >Engine is now in hard dependency with jQuery</p>

<p>Engine features</p>
<ul>
    <li>Flexible file extensions</li>
    <li>Templates within templates</li>
    <li>Template variables with isolated scope</li>
    <li>Template variable attributes to override or prevent absence of value</li>
    <li>`if` and `repeat` statement</li>
</ul>


<h5>Configuration</h5>

<p>Property `config` stores `paths` and `extension`</p>

<ul>
    <li>`base` in `paths` is the folder that stores all your templates, default value is `templates`. Other properties represents folders that ought to contain types of templates depending on purpose, if some type of template is not set here, template will load as if it was in `part`.</li>
    <li>`extension` is file extension of your templates, when you set templates within templates engine will look for this type of file.</li>
</ul>

<h5>When you include this as module you will get</h5>
<ol>
    <li>Render : function (pathToTemplate, htmlEntityToRender, dataToRender, callback), `pathToTemplate` is absolute path from your root with file name end extension, dataToRender is object with properties that represent template variables at a certain level of nesting, depending from template that is now rendering, callback is a function that will be called when engine is finished loading template only argument is compiled template</li>
    <li>Init : function (dataToRender), this function reads html attribute `page-template` and renders  template that is stored in `page` folder in your `base`, dataToRender is the same object as in Render function.</li>
</ol>

<h5>Templates and variables</h5>

<ul>
    <li>{{variableName}} represents a variable in template, if data is not present for this variable in your dataToRender object it will be replaced as nothing, or you can set default attribute (string) which is to render it instead, like {{variableName default="There’s no spoon"}}</li>
    <li>{{template.tpl}} represents a template within template, it will load from your `base` folder according to your config, and type attribute set in it, such as {{template.tpl type="snippet"}}, also can contain all kinds of attributes that can override values set in object to render in template. Scope of template loaded inside template is limited to its representation in dataToRender with the same name at certain level of nesting with the same name and no extension</li>
    <li>{{if condition}} content {{/if}} conditional part of template which may or may not be shown depending on condition. For now condition is absence of presence of certain data in dataToRender, and it's value, for ex. : {{if nav}}<nav></nav>{{/if}} if nav is present in dataToRender but set to false this part will be replaced with nothing. You can put as many {{if}}{{/if}} statements in {{if}}{{/if}} statements as you like. Negative condition is also supported {{if !nav}}{{/if}}</li>
    <li>{{repeat array as item}}{{/repeat}} is part of template witch will be repeated and values like {{item}} can be set.</li>
</ul>

