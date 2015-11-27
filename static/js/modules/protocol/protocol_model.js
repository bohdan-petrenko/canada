/**
 * Created by Petrenko on 11.11.2015.
 */
define('modules/protocol/protocol_model',['jquery', 'knockout', 'text!modules/protocol/protocol.html'], function($, ko, html) {
    $('body').append(html);

    function ProtocolModel() {
        this.templateName = 'protocol';
        this.page = ko.observable();
    }

    return ProtocolModel;
});