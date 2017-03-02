/**
 * Created by Oanh on 12/17/2016.
 */
/**
 * Created by tuynu on 12/14/2016.
 */
"use strict";

require("./helpers/setup");

var keyCodeMapper = require("./helpers/KeyCodeMapper");
var Manager =  require("./helpers/Manager4Test");
var SPECIAL_KEYS = require("./helpers/special-keys");
var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');
var path = require('path');

describe("android webview", function () {
    this.timeout(300000);
    var driver;
    var allPassed = true;
    var windowSize;

    before(function () {
        var serverConfig = process.env.npm_package_config_sauce ?
            serverConfigs.sauce : serverConfigs.local;
        driver = wd.promiseChainRemote(serverConfig);

        require("./helpers/logging").configure(driver);

        var desired =
                //process.env.npm_package_config_sauce ?
                //_.clone(require("./helpers/caps").android18)
                //    :
                _.clone(require("./helpers/caps").android18)
            ;
        //desired.app = path.resolve('apps/lobby.apk');//require("./helpers/apps").selendroidTestApp;
        desired.appPackage = 'com.lobbyteam.playpalace.unity';
        desired.appActivity = 'com.lobbyteam.playpalace.unity.MainActivity';
        //desired.deviceName = '192.168.251.101:5555';
        desired.udid = '7ac2cc22';

        if (process.env.npm_package_config_sauce) {
            desired.name = 'android - webview';
            desired.tags = ['sample'];
        }
        return driver
            .init(desired)
            .setImplicitWaitTimeout(3000);
    });

    after(function () {
        return driver
            .quit()
            .finally(function () {
                if (process.env.npm_package_config_sauce) {
                    return driver.sauceJobStatus(allPassed);
                }
            });
    });

    afterEach(function () {
        allPassed = allPassed && this.currentTest.state === 'passed';
    });

    it("should switch to webview", function () {

        return Manager.setup(wd, driver)
            .callLogin(2, 'duong@g.com', '111111111')
            .sleep(10000)
            //.callTestProfileAndShop()
            //.sleep(1000)
            //.callTestPopupFriends()
            //.sleep(1000)
            .callTestAchievementAndGift();
            //.sleep(1000)
            //.callTestDownloadGame();
            //.callTestChangeAvaterSamsung();
            //.callTestSpins();
    });
});
