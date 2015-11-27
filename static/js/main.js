require([
    'jquery',
    'knockout',
    'davis',
    'require',
    'bootstrap',
    'md5',
    'easy.dropdown',
    'ripples',
    'modules/helpers'
    //'modules/protocol/protocol_model',
    //'modules/examples/example_model',
    //'modules/samples/samples_model'
], function ($, ko, Davis, require, bootstrapJs, md5, EasyDropDown, ripples, helpers
    //, ProtocolModel, ExampleModel, SamplesModel
        ) {
    window.application = {};

    //window.application.servers = [
    //    {name: 'Сервер транзакцій', html: 'ts-protocol.html', route: "ts"}
    //];

    //window.application.runServerMenuRoute = function(data) {
    //    window.location.hash = "#" + data.route;
    //};

    window.application.template = ko.observable();

    window.application.error = {
        errorText: ko.observable(),
        isError: ko.observable()
    };

    window.application.auth = {
        login: ko.observable(),
        password: ko.observable(),
        isLoggedIn: ko.observable(),
        doLogin: function() {
            this.isLoggedIn(true);
            //var error = window.application.error;
            //var self = this;
            //error.isError(false);
            //
            //if (!this.login() || !this.password() || !this.terminal()) {
            //    error.errorText(!this.login() ? 'Введіть ваш логін' : !this.password()
            //        ? 'Введіть пароль' : 'Введіть ідентифікатор терміналу');
            //    error.isError(true);
            //} else {
            //    $.ajax({
            //        url: "auth",
            //        type: "GET",
            //        contentType: "application/json; charset=utf-8",
            //        data: {
            //                "login": self.login(),
            //                "password": md5(self.password()),
            //                "terminal": +self.terminal()
            //              },
            //        statusCode: {
            //            200: function() {
            //                window.location.hash = "#ts";
            //                self.isLoggedIn(true);
            //                self.password(md5(self.password()));
            //            },
            //            401: function () {
            //                        error.errorText('Email або пароль не вірні, або Ви не маєте прав на доступ');
            //                        error.isError(true);
            //            }
            //        }
            //    });
            //}
        },
        doLogout: function () {
            this.isLoggedIn(false);
            this.login("");
            this.password("");
        }
    };

    ko.bindingHandlers.materialForm = {
        init: function(element, valueAccessor) {
            if (!valueAccessor()) {return;}
            $(element).on("input propertychange", ".label-floating", function(e) {
                $(this).toggleClass("is-empty", !$(e.target).val());
            }).on("focus", ".label-floating", function() {
                $(this).addClass("is-focused");
            }).on("blur", ".label-floating", function() {
                $(this).removeClass("is-focused");
            });
        },
        update: function(element, valueAccessor) {
        }
    };

    ko.bindingHandlers.numbersOnly = {
        init: function(element, valueAccessor) {
            if (!valueAccessor()) {return;}
            $(element).keyup(function () {
                if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
                    this.value = this.value.replace(/[^0-9\.]/g, '');
                    $(element).trigger('input');
                }
            });
        },
        update: function(element, valueAccessor) {
        }
    };

    ko.bindingHandlers.dropdown = {
        init: function(element, valueAccessor) {
            if (!valueAccessor()) {return;}
            var instantiate = function(domNode, settings){
                    domNode.id = !domNode.id ? 'EasyDropDown'+rand() : domNode.id;
                    var instance = new EasyDropDown();
                    if(!instance.instances[domNode.id]){
                        instance.instances[domNode.id] = instance;
                        instance.init(domNode, settings);
                    };
                },
                rand = function(){
                    return ('00000'+(Math.random()*16777216<<0).toString(16)).substr(-6).toUpperCase();
                },
                json = $(element).attr('data-settings'),
                settings = json ? $.parseJSON(json) : {};
            instantiate($(element), settings);
        },
        update: function(element, valueAccessor, allBindings) {
            var selectedElementObj = ko.unwrap(valueAccessor());
            var key = allBindings.get('optionsText');
            var selectedElement = key ? selectedElementObj[key] : selectedElementObj;
            var view = $($(element).parent().parent());
            $(view.find('.selected')).text(selectedElement);
            $(view.find('ul li')).each(function() {
                $(this).removeClass('active');
                if ($(this).text() == selectedElement) {
                    $(this).addClass('active');
                }
            });
        }
    };

    ko.bindingHandlers.ripples = {
        init: function(element, valueAccessor) {
            var ripplesOn = valueAccessor();
            if (ripplesOn) {
                $(element).ripples();
            }
        },
        update: function(element, valueAccessor) {
        }
    };

    window.require = require;
    Davis.extend(Davis.hashRouting({
        forceHashRouting : true
    }));

    var router = Davis(function() {
        //this.configure(function() {
        //    this.generateRequestOnPageLoad = true;
        //});
        //
        //this.get('/', function(req) {
        //    if (window.application.auth.isLoggedIn()) {
        //        req.redirect("ts");
        //    } else {
        //        req.redirect('login');
        //    }
        //});
        //
        //this.get('login', function(req) {
        //    if (window.application.auth.isLoggedIn()) {
        //        req.redirect("");
        //    }
        //});
        //
        //this.get('ts', function(req) {
        //    $('.servers-menu-element').removeClass('active');
        //    $('.servers-menu-element#ts').addClass('active');
        //    req.redirect("ts/protocol");
        //});
        //
        //this.get('ts/protocol', function(req) {
        //    $('.document-menu ul li').removeClass('active');
        //    $($('.document-menu ul li.protocol')).addClass('active');
        //    window.application.template(new ProtocolModel());
        //    $.get('resources/wiki/html/ts-protocol.html').done(function(e){window.application.template().page(e);})
        //});
        //
        //this.get('ts/example', function(req) {
        //    $('.document-menu ul li').removeClass('active');
        //    $($('.document-menu ul li.example')).addClass('active');
        //    window.application.template(new ExampleModel());
        //});
        //
        //this.get('ts/samples', function(req) {
        //    $('.document-menu ul li').removeClass('active');
        //    $($('.document-menu ul li.sources')).addClass('active');
        //    window.application.template(new SamplesModel());
        //});
        //
        //this.before(function(req) {
        //    var auth = window.application.auth;
        //    if (auth.login() && auth.password() && auth.terminal()) {
        //        return;
        //    }
        //    $.ajax({
        //        url: "get_user",
        //        type: "GET",
        //        contentType: "application/json; charset=utf-8",
        //        statusCode: {
        //            401: function () {
        //                window.location.hash = "#login";
        //                auth.isLoggedIn(false);
        //            }
        //        },
        //        success: function(data, textStatus, request){
        //            auth.login(request.getResponseHeader("login"));
        //            auth.password(request.getResponseHeader("password"));
        //            auth.terminal(request.getResponseHeader("terminal"));
        //            auth.isLoggedIn(true);
        //        }
        //    });
        //});
    });

    ko.applyBindings(window.application);
    router.start();
});
