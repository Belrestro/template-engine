requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-3.1.1',
        main : 'app/main',
        template : 'lib/template-engine',
    }
});
requirejs(['main']);