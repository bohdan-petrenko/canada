/**
 * Created by Petrenko on 12.11.2015.
 */
define('modules/device/device_model',['jquery', 'knockout', 'text!modules/device/search.html', 'text!modules/device/edit.html'], function($, ko, searchView, editView) {
    $('body').append(searchView);
    $('body').append(editView);

    function DeviceModel() {
        this.templateName = ko.observable('search');
        var self = this;
        this.tac = ko.observable();
        this.name = ko.observable();
        this.model = ko.observable();
        this.foundedDevices = ko.observableArray();
        this.cantAdd = ko.computed(function() {
            if (!self.tac() || !self.name() || !self.model())
                return true;
            return false;
        });

        this.searchDevice = function() {
            self.foundedDevices([]);
            if (self.tac()) {
                self.foundedDevices.push({tac: self.tac(), name: self.name(), model: self.model()});
            } else {
                self.foundedDevices.push({tac: new Date().getTime(), name: self.name(), model: self.model()});
                self.foundedDevices.push({tac: new Date().getTime(), name: self.name(), model: self.model()});
                self.foundedDevices.push({tac: new Date().getTime(), name: self.name(), model: self.model()});
            }
        };
        this.addDevice = function() {
            self.editDevice(self.tac(), self.name(), self.model());
        };

        this.editDevice = function(tac, name, model) {
            self.templateName('edit');
            self.tac(tac);
            self.name(name);
            self.model(model);
        };

        //EDIT DEVICE
        this.options = ko.observableArray(['apple', 'pear', 'plum', 'cherry', 'merry', 'grape', 'mulberry']);
        this.selectedOptions = ko.observableArray();
        this.activateNavItem = function(el) {
            $(el).siblings().each(function() {
                $(this).removeClass('active')
            });
            $(el).addClass('active');
        };
        this.nextNavItem = function() {
            var $selected = $('#options-nav li.active');
            if ($selected.next().length) {
                $selected.removeClass('active');
                $selected.next().addClass('active');
            }
        };
        this.previousNavItem = function() {
            var $selected = $('#options-nav li.active');
            if ($selected.prev().length) {
                $selected.removeClass('active');
                $selected.prev().addClass('active');
            }
        };
        this.cancelDeviceUpdating = function() {
            self.templateName('search');
        };
        this.updateDeviceDetails = function() {
            self.templateName('search');
        };
    }

    return DeviceModel;
});
