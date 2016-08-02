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

    $scope.temp = {};

    $scope.thistabwg = { t: '', wg: { id: '', col: '' } };

    $scope.theTime = new Date().toLocaleTimeString();

    $scope.conf = function () {
        if (confirm("确认退出系统吗？")) alert('确定');
    };


    $scope.addtab = function () {
        var len = $('#tablabel>li').length;
        var tname = $('#tabname').val();
        //$('#tablabel').append('<li><a data-toggle="tab" href="#tab' + (len + 1) + '" aria-expanded="true">tab' + (len + 1) + '</a></li>');
        $('#tablabel').append('<li><a data-toggle="tab" href="#tab' + (len + 1) + '" aria-expanded="true">' + tname + '</a></li>');
        $('#tabcontent').append('<div class="row tab-pane" id="tab' + (len + 1) + '"></div>');
        $('#tablabel a:last').tab('show');
        $('#addtabsconfrim').hide();

        $scope.thistabwg.t = tname; 
        addtabtojson(tname);
    };

    $scope.showtabname = function () {
        $('#addtabsconfrim').show();
    };

    $scope.addwg = function (flag, colm) {
        var wg = {
            "blank": "node_modules/wg-blank/wg-blank.html",
            "price": "node_modules/wg-price/wg-price.html",
            "order": "node_modules/wg-order/wg-order.html",
            "query": "node_modules/wg-query/wg-query.html",
            "log": "node_modules/wg-log/wg-log.html",
            "ebs1": "node_modules/wg-ebs1/wg-ebs1.html"
        };
        var html = '<div class="col-lg-' + colm + ' col-md-' + colm + ' col-sm-' + colm + '"><div ng-include="\'' + wg[flag] + '\'"></div></div>';
        var tpl = $compile(html);
        //var e = tpl($scope);
        $("#tabcontent>div[class*='active']").append(tpl($scope));

        $scope.thistabwg.wg.id = flag;
        $scope.thistabwg.wg.col = colm;

        addwgtojson();
    };

    $scope.changetemp = function (f) {
        chgtemp(f);
    };

    $scope.showsavetemp = function () {
        //alert(JSON.stringify($scope.temp));
        $('#tempjson').val(JSON.stringify($scope.temp));
        $('#saveTemplate').show();
    }

    $scope.savetemp = function () {
        alert('save...');
    };

    $scope.inputaddwg = function (e) {
        var wg = {
            "blank": 12,
            "price": 4,
            "order": 8,
            "query": 6,
            "log": 6,
            "ebs1": 12
        };
        if (e.which == 13) {
            //alert($scope.wgflag);
            if (wg[$scope.wgflag]) {
                //alert(wg[$scope.wgflag])
                $scope.addwg($scope.wgflag, wg[$scope.wgflag]);
                $scope.wgflag = '';
            }
            else {
                alert('one of them [blank,price,order,query,log,ebs1]');
            }
        }
        
    };

    var init = function () {
        $('#tabcontent').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden', 'padding': '5px', 'height': ($(window).height() - 146) + 'px' });
        $("#top_msg,#bottom_msg").height(($(window).height() - 110) / 2);
        $(".direct-chat-messages,.msg-body").css({ 'height': (($(window).height() - 245) / 2) + 'px' });
        $interval(function () {
            $scope.theTime = new Date().toLocaleTimeString();
        }, 1000);
    };

    var chgtemp = function (f) {
        var wg = {
            "blank": "node_modules/wg-blank/wg-blank.html",
            "price": "node_modules/wg-price/wg-price.html",
            "order": "node_modules/wg-order/wg-order.html",
            "query": "node_modules/wg-query/wg-query.html",
            "log": "node_modules/wg-log/wg-log.html",
            "ebs1": "node_modules/wg-ebs1/wg-ebs1.html"
        };
        $http.get('/js/temp.json?' + Math.random()).success(function (data) {
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

            $('#tablabel a:first').tab('show')

            $scope.temp = {};
            $scope.temp[f] = data[f];
            if (data[f][0]) $scope.thistabwg.t = data[f][0].name;
            //alert(JSON.stringify($scope.temp));

            getactivetab();
        });
    };

    var getactivetab = function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var activeTab = $(e.target).text();
            //var activeTab = $(e.target).id;
            var previousTab = $(e.relatedTarget).text();

            $scope.thistabwg.t = activeTab;

            //alert(activeTab);
        });
    };

    var addtabtojson = function (tname) {
        for (tabs in $scope.temp) {
            $scope.temp[tabs].push({
                "name": tname,
                "wg": []
            });
        }
        //alert(JSON.stringify($scope.temp));
    };

    var addwgtojson = function () {
        for (tabs in $scope.temp) {
            for (var i = 0; i < $scope.temp[tabs].length; i++) {
                if ($scope.temp[tabs][i].name == $scope.thistabwg.t) {
                    $scope.temp[tabs][i].wg.push($scope.thistabwg.wg);
                    break;
                }
            }
        }

        //alert(JSON.stringify($scope.temp));
    };


    //--------------------init-------------------------
    init();
    chgtemp('init');
});
