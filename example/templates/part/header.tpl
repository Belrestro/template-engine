<header>
    {{if nav}}
        <nav>
            <ul>
                {{repeat menu as item}}
                    <li><a href="{{item.link}}">{{item.name}}</a></li>
                {{/repeat}}
                {{if addNav}}
                    {{repeat additionalNav as item}}
                        <li><a href="{{item.link}}">{{item.name}}</a></li>
                    {{/repeat}}
                {{/if}}
            </ul>
        </nav>
    {{/if}}
</header>