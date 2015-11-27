/**
 * Created by Petrenko on 11.11.2015.
 */
define('modules/samples/samples_model',['jquery', 'knockout', 'text!modules/samples/samples.html'], function($, ko, html) {
    $('body').append(html);

    function SamplesModel() {
        this.templateName = 'samples';
    }

    return SamplesModel;
});