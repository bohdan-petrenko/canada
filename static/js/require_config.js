/**
 * Created by anton on 23.07.14.
 */

require.config({

    //  псевдонимы и пути используемых библиотек и плагинов
    baseUrl: 'js',
    paths: {
        'davis': 'davis',
        'knockout': 'knockout-3.3.0',
        'jquery': 'jquery-2.1.4',
        'moment': 'moment-with-locales',
        'bootstrap': 'bootstrap',
        'md5': 'md5',
        'ripples': 'ripples',
        'chosen': 'chosen.jquery'
    },

    shim: {
        'davis': {deps: ['jquery'], exports: 'Davis'},
        'bootstrap': { deps: ['jquery'], exports: 'bootstrap'},
        'md5': { deps: ['jquery'], exports: 'md5'},
        'ripples': { deps: ['jquery'], exports: 'ripples'},
        'chosen': { deps: ['jquery'], exports: 'chosen'}
    },

    // запустить приложение
    deps: ['main']
});