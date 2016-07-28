/**
 * Created by hsl on 16/6/28.
 */
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

angular.module('mainApp').controller('mainController', function ($scope, $localStorage, $http, $translate, $compile) {

    $scope.user = $localStorage.user;

    $scope.dcon = "";
    $scope.widget = "";

    $scope.includeUrl = ""; //node_modules/wg-ebs/wg-ebs.html
    $scope.includeUrl1 = "";
    $scope.includeUrl2 = "";
    $scope.includeUrl3 = "";
    $scope.includeUrl4 = "";
    $scope.includeUrl5 = "";

    $scope.show = function (name) {
        $scope.includeUrl = "node_modules/" + name + "/" + name + ".html";
    }

    $scope.saveUser = function () {
        $localStorage.user = $scope.newUser;
        $scope.user = $localStorage.user;
    }

    function ShowDFWA(bshow) {
        $scope.dfwa.setVisible(bshow);
    }

    function ShowDFWB(bshow) {
        $scope.dfwb.setVisible(bshow);
    }
    function ShowDFWC(bshow) {
        $scope.dfwc.setVisible(bshow);
    }
    function ShowDFWD(bshow) {
        $scope.dfwd.setVisible(bshow);
    }

    function addX() {
        $scope.dfwx = $scope.dfp.createDFPanel("聊天");
        $scope.dfwx.setInitialLayoutReference($scope.dfwb);
        /*
                $scope.dfwx.addContentDiv(document.getElementById("dockfloatdivx"));
        */
        $scope.dfwx.initLayout(150, 300, 200, 300, DSXDFPanel.dockLeft);
    }

    $scope.switching = function (lang) {
        $translate.use(lang);
        window.localStorage.lang = lang;
        //window.location.reload();
    };


    $scope.loads = 0;


    function init() {
        $scope.loads = 2 + $scope.loads;
        if ($scope.loads == 2) {

            $scope.dfp = DSXDFUtil.createDSXDFUtil();
            //$scope.dfp.loadStatesFromKey("LAYOUT_NOW");
            $scope.dfp.addFixedPanel(document.getElementById("fixedontop"), DSXDFUtil.fixedTop);
            $scope.dfp.addFixedPanel(document.getElementById("centerdiv"), DSXDFUtil.fixedCenter);
            $scope.dfp.addFixedPanel(document.getElementById("fixedbottom"), DSXDFUtil.fixedBottom);

            $http.get('/test/layout.json?' + Math.random()).success(function (data) {
                var lay = data.layout[data.sel];
                alert(lay.length);
                for (var i = 0; i < lay.length; i++) {
                    var div = document.createElement('div');
                    div.style.overflow = 'auto';
                    div.innerHTML = '<h1>哈哈</h1>我是新来的';

                    alert(i);
                    $scope['dfw' + i] = $scope.dfp.createDFPanel("title " + i);
                    if (i == 0) {
                        $scope['dfw' + i].addContentDiv(document.getElementById("msgdiv"));
                    }
                    else if (i == 1) {
                        $scope['dfw' + i].setInitialLayoutReference($scope['dfw' + (i - 1)]);
                        //$scope['dfw' + i].addContentDiv(div);
                    }
                    else {
                        document.body.appendChild(div);
                        $scope['dfw' + i].addContentDiv(div);
                    }
                    $scope['dfw' + i].initLayout(lay[i].left, lay[i].top, lay[i].width, lay[i].height, lay[i].position);
                }
            });



        }

    }
    init();

    $scope.newdialog = function () {
        //alert(9876);
        $("#dialog").dialog({ containment: "#centerdiv", scroll: false });
        //$("#dialog").draggable({ containment: "#centerdiv", scroll: false });
    };

    $scope.addcont = function () {
        //alert($scope.dcon);
        $("#dialog" + $scope.dcon).dialog({ width: 800, height: 600 });
    }

    $scope.selwidget = function () {
        //alert($scope.widget);
        $scope['includeUrl' + $scope.dcon] = $scope.widget;
    }

    $scope.test = function () {
        //var tx = $(window.frames["ifr2"].document).find("input[id='txtx']").click();  //ie
        //var setwg = $(document.getElementById('ifr2').contentWindow.document).find("input[id='wg']").val($scope.widget);
        var txt = $(document.getElementById('ifr2').contentWindow.document).find("input[id='txtx']").click();   //all
    }

    $scope.divtab = function () {
        alert('xxxxxx');

        var tpl = $compile('<div id="draggable1" style="border:1px solid red; height:300px;width:300px;background:#f3f3f3;"><h3>全局 容器drag</h3><div ng-include="includeUrl1"></div></div>');
        var e = tpl($scope);
        e.draggable({ containment: "#ifr2", handle: "h3" });
        $('#ifr2').append(e);

        
        //$element.append(e);
        //$('#ifr2').html($compile('<div id="draggable1" style="border:1px solid red; height:300px;width:300px;background:#f3f3f3;"><h3>全局 容器drag</h3></div>'))($scope);
    }

    function loadDefaultLayout() {
        init();
    }
    function loadSaveLayout() { }

    function saveLayout() {
        $scope.dfp.saveStatesIntoKey("LAYOUT_NOW");

    }

    $scope.ShowDFWA = ShowDFWA;
    $scope.ShowDFWB = ShowDFWB;
    $scope.ShowDFWC = ShowDFWC;
    $scope.ShowDFWD = ShowDFWD;
    $scope.loadDefaultLayout = loadDefaultLayout;
    $scope.loadSaveLayout = loadSaveLayout;
    $scope.saveLayout = saveLayout;
    $scope.init = init;
    $scope.addX = addX;
});
