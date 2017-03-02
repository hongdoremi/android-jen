/**
 * Created by tuynu on 12/14/2016.
 */
"use strict";

require("./helpers/setup");
var Manager = require("./helpers/Manager4Test");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers');

var path = require('path');

describe("android webview", function () {
    this.timeout(25 * 60 * 1000);
    var driver;
    var allPassed = true;

    function randomInt(min,max){
        return Math.floor((Math.random() * max) + min);
    }

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
        //desired.udid = '192.168.57.102:5555';
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
        var email = "hongdu" + randomInt(0,100000) + "@gmail.com" ;

        return Manager.setup(wd, driver)
            //.callLogin(2,'cam@gmail.com', '11111111').sleep(12000)
           //  .callSignUp(email,'11111111','').sleep(5000)
           //  .log("Calling test callLogin")
           //  .callLogin(2,email,'11111111').sleep(12000)
           //  .log("Calling test play Tutorial")
           // .playTutorial().sleep(3000)
           // .collectComeBackBonus().sleep(5000)
           // .collectDailyBonusStreak().sleep(5000)
           // .callProfile().sleep(5000)
           // .callAchievement().sleep(5000)
           // .log("Calling test change avatar for samsung")
           // .callTestChangeAvaterSamsung().sleep(3000)
           // .callProfile().sleep(5000)
           // .callShop().sleep(3000)
           // .callPopupFriend().sleep(3000)
           // .callPopupSetting().sleep(3000)
           // .callGift().sleep(3000)
            //.callTestGameNezha().sleep(3000)
           //// .callTestDownloadGameDeepBlue().sleep(3000)
           // .callProfile().sleep(3000)
           // .log("Calling test callLogout")
           // .callLogout().sleep(2000)
           // //.callLogin(1,'','').sleep(12000)
           // ////.playTutorial().sleep(3000)
           // //.collectComeBackBonus()
           // //.sleep(2000)
           // //.collectDailyBonusStreak()
           // //.sleep(3000)
           // //.callProfile().sleep(5000)
           // //.callLogout().sleep(2000)
           // .callLogin(2,'cherry@gmail.com', '11111111').sleep(15000)
           // .callLogin(2,'meomeo@gmail.com', '11111111').sleep(15000)
           // .callLogin(2,'trungtam@gmail.com', '11111111').sleep(15000)
            .callLogin(2,'min1@g.com', '111111111').sleep(15000)
            .collectComeBackBonus()
            .sleep(2000)
            .collectDailyBonusStreak()
            .sleep(3000)
            .callProfile().sleep(5000)
            .callLogout().sleep(2000)
            //.callLogin(3,'','').sleep(15000)
            //.CollectComBackBonusWheelFacebook().sleep(3000)
            //.collectDailyBonusStreak().sleep(5000)
            //.callGiftFaceBook().sleep(2000)
            //.callLogout().sleep(2000);
    });
});
