angular.module('mainApp', ["ui.router", "ngStorage", "pascalprecht.translate"]).config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang || 'cn';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.translations('cn', cn);
    $translateProvider.translations('en', en);

}]);

angular.module("mainApp").filter("T", function ($translate) {
    return function (key) {
        if (key) {
            return $translate.instant(key);
        }
    };
});

angular.module('mainApp').controller('mainController', function ($scope, $localStorage, $http, $translate, $compile, $interval) {

    $scope.theTime = new Date().toLocaleTimeString();

    $scope.conf = function () {
        if (confirm("确认退出系统吗？")) alert('确定');
    };

    function init() {
        $('#tabcontent').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'padding': '5px', 'height': ($(window).height() - 146) + 'px' });
        $("#top_msg,#bottom_msg").height(($(window).height() - 110) / 2);
        $(".direct-chat-messages,.msg-body").css({ 'height': (($(window).height() - 245) / 2) + 'px' });
        $interval(function () {
            $scope.theTime = new Date().toLocaleTimeString();
        }, 1000);
    }
    init();

    $scope.addtab = function () {
        var len = $('#tablabel>li').length;
        $('#tablabel').append('<li><a data-toggle="tab" href="#tab' + (len + 1) + '" aria-expanded="true">tab' + (len + 1) + '</a></li>');
        $('#tabcontent').append('<div class="row tab-pane" id="tab' + (len + 1) + '"></div>');
    };
    
    $scope.addwg = function (flag,colm) {
        var wg = {
            "blank": "node_modules/wg-blank/wg-blank.html",
            "price": "node_modules/wg-price/wg-price.html",
            "order": "node_modules/wg-order/wg-order.html",
            "query": "node_modules/wg-query/wg-query.html",
            "log": "node_modules/wg-log/wg-log.html"
        };
        var html = '<div class="col-lg-' + colm + ' col-md-' + colm + ' col-sm-' + colm + '"><div ng-include="\'' + wg[flag] + '\'"></div></div>';
        var tpl = $compile(html);
        var e = tpl($scope);
        $("#tabcontent>div[class*='active']").append(e);
        //alert($("#tabcontent>div[class*='active']").html());
    };

    $scope.changetemp = function (f) {
        //alert(f);
        var wg = {
            "blank": "node_modules/wg-blank/wg-blank.html",
            "price": "node_modules/wg-price/wg-price.html",
            "order": "node_modules/wg-order/wg-order.html",
            "query": "node_modules/wg-query/wg-query.html",
            "log": "node_modules/wg-log/wg-log.html"
        };
        $http.get('/js/temp.json?' + Math.random()).success(function (data) {
            //alert(data[f][0]['name']);
            var temp = data[f];
            $('#tablabel,#tabcontent').empty();
            for (var i = 0; i < temp.length; i++) {
                $('#tablabel').append('<li><a data-toggle="tab" href="#tab' + (i + 1) + '" aria-expanded="true">' + temp[i].name + '</a></li>');
                $('#tabcontent').append('<div class="row tab-pane" id="tab' + (i + 1) + '"></div>');

                for (var j = 0; j < temp[i].wg.length; j++) {
                    var html = '<div class="col-lg-' + temp[i].wg[j].col + ' col-md-' + temp[i].wg[j].col + ' col-sm-' + temp[i].wg[j].col + '"><div ng-include="\'' + wg[temp[i].wg[j].id] + '\'"></div></div>';
                    var tpl = $compile(html);
                    var e = tpl($scope);
                    $("#tab" + (i + 1)).append(e);
                }
            }
        });
    };

});
