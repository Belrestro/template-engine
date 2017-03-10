define(['jquery','template-engine'], function ($, templateEngine) {
    templateEngine.init({
        header : {
            menu : [
                {
                    link : 'http://google.com',
                    name : 'Google',
                }, {
                    link : 'http://twitter.com',
                    name : 'Twitter',
                }, {
                    link : 'http://facebook.com',
                    name : 'Facebook',
                }
            ], additionalNav : [
                {
                    link : 'http://snapchat.com',
                    name : 'snapChat',
                }
            ]
        }, content : {
                title : 'Hi there !',
        }
    });
});