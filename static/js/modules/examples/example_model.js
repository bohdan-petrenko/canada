/**
 * Created by Petrenko on 12.11.2015.
 */
define('modules/examples/example_model',['jquery', 'knockout', 'text!modules/examples/example.html'], function($, ko, html) {
    $('body').append(html);

    function ExampleModel() {
        this.templateName = 'example';
        var self = this;
        var REQUEST_URL = "https://sandbox.globalmoney.ua/ts/";
        this.requestTypeOptions = [
            {key: 'check', text: 'Перевірка можливості оплати'},
            {key: 'pay', text: 'Проведення платежу'},
            {key: 'getstatus', text: 'Запит статусу платежу'}];
        this.selectedRequestType = ko.observable(self.requestTypeOptions[0]);
        //this.contentTypeOptions = ["application/json", "application/xml"];
        //this.selectedContentType = ko.observable(self.contentTypeOptions[0]);
        this.contentType = "application/json";
        this.requestContent = ko.observable();
        this.responseContent = ko.observable();
        this.requestUrl = ko.computed(function() {
            return REQUEST_URL + self.selectedRequestType().key;
        });
        this.requestMethod = "POST";
        this.statusCode = ko.observable();
        this.error = {
            isError: ko.observable(),
            errorText: ko.observable()
        };
        this.isNextAvailable = ko.observable();

        this.addRequestAuthContent = function() {
            this.requestContent(JSON.stringify(authContent, null, 4));
        };

        this.addTestContent = function() {
            var content = "";
            if (self.selectedRequestType().key == 'check') {
                self.currentTransactionId(-1);
                content = checkTestContent();
            } else if (self.selectedRequestType().key == 'pay') {
                content = payTestContent();
            } else if (self.selectedRequestType().key == 'getstatus') {
                content = statusTestContent();
            }
            this.requestContent(JSON.stringify(content, null, 4));
        };

        this.doRequest = function() {
            self.error.isError(false);
            self.responseContent("");
            self.statusCode("");
            self.isNextAvailable(false);
            try {
                JSON.parse(this.requestContent())
            } catch (e) {
                self.error.isError(true);
                self.error.errorText("Хибний формат JSON тіла запиту");
                return;
            }
            $.ajax({
                url: "proxy",
                type: this.requestMethod,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'ProxyUrl': this.requestUrl()
                },
                data: this.requestContent(),
                success: function (response) {
                    self.responseContent(JSON.stringify(response, null, 4));
                    if (response.result == 0) {
                        if (response.statuses.length == 1) {
                            if (response.statuses[0].status < 100) {
                                if (self.selectedRequestType().key == 'check' || self.selectedRequestType().key == 'pay') {
                                    self.isNextAvailable(true);
                                    self.currentTransactionId(response.statuses[0].transactionId);
                                } else if (response.statuses[0].status == 2 && self.selectedRequestType().key == 'getstatus') {
                                    self.isNextAvailable(true);
                                }
                            } else {
                                var code = +response.statuses[0].status;
                                self.error.isError(true);
                                self.error.errorText(errorCodeToText(code));
                            }
                        }
                    } else {
                        var code = +response.result;
                        self.error.isError(true);
                        self.error.errorText(errorCodeToText(code));
                    }
                },
                complete: function(jqXHR) {
                    self.statusCode(jqXHR.status);
                }
            });
        };

        this.doNext = function() {
            if (self.selectedRequestType().key == 'check') {
                self.selectedRequestType(self.requestTypeOptions[1]);
                self.addTestContent();
                self.isNextAvailable(false);
            } else if (self.selectedRequestType().key == 'pay') {
                self.selectedRequestType(self.requestTypeOptions[2]);
                self.addTestContent();
                self.isNextAvailable(false);
            } else if (self.selectedRequestType().key == 'getstatus') {
                self.doRequest();
            }
        };

        this.selectedRequestType.subscribe(function() {
            self.requestContent("");
            self.responseContent("");
            self.statusCode("");
        });


        this.currentTransactionId = ko.observable(-1);
        var authContent = function() {
            return {
                "terminalDescr": {
                    "serial": window.application.auth.terminal(),
                    "login": window.application.auth.login(),
                    "authCode": window.application.auth.password()
                }
            };
        };
        var checkTestContent = function() {
            return {
                "terminalDescr": {
                    "serial": window.application.auth.terminal(),
                    "login": window.application.auth.login(),
                    "authCode": window.application.auth.password()
                },
                "payments": [
                    {
                        "transactionId": +self.currentTransactionId(),
                        "serviceId": 1,
                        "timeStamp": new Date().getTime(),
                        "commission": 0,
                        "accountInfo": {
                            "accounts": {
                                "msisdn": "380632106797"
                            }
                        },
                        "offline": false,
                        "sourceType": 0,
                        "sourceId": window.application.auth.terminal(),
                        "amount": 100
                    }
                ]
            };
        };
        var payTestContent = function() {
            return {
                "terminalDescr": {
                    "serial": window.application.auth.terminal(),
                    "login": window.application.auth.login(),
                    "authCode": window.application.auth.password()
                },
                "payments": [
                    {
                        "transactionId": +self.currentTransactionId(),
                        "accountInfo": {
                            "accounts": {
                                "msisdn": "380632106797"
                            }
                        },
                        "amount": 100,
                        "commission": 0,
                        "offline": false,
                        "paymentInfo": {
                            "info": null,
                            "period": null,
                            "minPayment": null,
                            "debet": null,
                            "items": null,
                            "data": null
                        },
                        "serviceId": 1,
                        "sourceId": window.application.auth.terminal(),
                        "sourceType": 0,
                        "timeStamp": new Date().getTime()
                    }
                ]
            };
        };
        var statusTestContent = function() {
            return {
                "terminalDescr": {
                    "serial": window.application.auth.terminal(),
                    "login": window.application.auth.login(),
                    "authCode": window.application.auth.password()
                },
                "statuses": [
                    {
                        "transactionId": +self.currentTransactionId()
                    }
                ]
            };
        };

        function errorCodeToText(code) {
            if (code == 101) {
                return "Недостатньо коштів на рахунку агента. Код: 101.";
            } else if (code == 102) {
                return "Денний ліміт вичерпано. Код 102.";
            } else if (code == 120) {
                return "Денний ліміт вичерпано. Код 120.";
            } else if (code == 120) {
                return "Термінал на якому проводиться видача не співпадає з терміналом призначення який був вказаний при переказі готівки. Код 120.";
            } else if (code == 121) {
                return "Провайдер не знайдений. Код 121.";
            } else if (code == 122) {
                return "Провайдер заблокований. Код 122.";
            } else if (code == 123) {
                return "Термін роботи провайдера сплив. Код 123.";
            } else if (code == 124) {
                return "Платіж з таким ідентифікатором вже створено. Код 124.";
            } else if (code == 125) {
                return "Платіж не створено. Код 125.";
            } else if (code == 126) {
                return "Акаунт не знайдено. Код 126.";
            } else if (code == 127) {
                return "Агент заблокований. Код 127.";
            } else if (code == 142) {
                return "Платіж не перевірено. Код 142.";
            } else if (code == 401) {
                return "Внутрішня помилка сервера. Код 401.";
            } else if (code == 402) {
                return "Формат запиту невірний. Код 402.";
            } else if (code == 403) {
                return "Авторизація не пройдена. Код 403.";
            } else if (code == 143) {
                return "Дана операція за вказаним ТТН вже існує. Код 143.";
            } else if (code == 201) {
                return "Шлюз не знайдено. Код 201.";
            } else if (code == 202) {
                return "Помилка обробки на шлюзі. Код 202.";
            } else if (code == 203) {
                return "Пряме поповнення не підтримується. Код 203.";
            } else if (code == 204) {
                return "Ваучерне поповнення не підтримується. Код 204.";
            } else if (code == 205) {
                return "Провайдер заблокований на шлюзі. Код 205.";
            } else if (code == 206) {
                return "Сума платежу невірна. Код 206.";
            } else if (code == 207) {
                return "Помилка звірки. Код 207.";
            } else if (code == 208) {
                return "Платіж відмінено на шлюзі. Код 208.";
            } else if (code == 209) {
                return "Обрана невірна операція. Уточніть назву операції та спробуйте знову!. Код 209.";
            } else if (code == 211) {
                return "Кількість спроб проведення платежу на шлюзі вичерпана. Код 211.";
            } else if (code == 212) {
                return "Платіж відмінено кол-центром. Код 212.";
            } else if (code == 214) {
                return "Помилка авторизації на шлюзі. Код 214.";
            } else if (code == 215) {
                return "Внутрішня помилка шлюза. Код 215.";
            } else if (code == 217) {
                return "Час для перевірки статусу платежу вичерпано. Код 217.";
            } else if (code == 318) {
                return "Код активації для виводу коштів хибний. Код 318.";
            } else if (code == 319) {
                return "Код активації для виводу коштів не знайдено або сума вказана невірно. Код 319.";
            } else if (code == 501) {
                return "Кількість спроб вичерпано. Код 501.";
            } else if (code == 1000) {
                return "Помилка встановлення з'єднання з сервером. Зверніться до адміністратора. Код 1000.";
            } else {
                return "Код помилки " + code + ".";
            }
        };

        this.addTestContent();
    }

    return ExampleModel;
});
