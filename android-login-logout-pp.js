/**
 * Created by tuynu on 12/14/2016.
 */
"use strict";

require("./helpers/setup");

var keyCodeMapper = require("./helpers/KeyCodeMapper");
var buttonPosition =  require("./helpers/ButtonPosition");
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
    function getXEstimateByWidthFrom1920 (x){
        return x*windowSize.width/1920;
    };
    function getYEstimateByHeighFrom1080(y){
        return y*windowSize.height/1080;
    };

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



        // javascript
        function tap(opts,log) {
            if(log !== null && log !== undefined){
                console.log(log);
            }
            console.log("X" + opts.X +";windowWidht:"+opts.Y);
            var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
            var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

            var action = new wd.TouchAction(this);
            action
                .tap({x: newX, y: newY});
            return action.perform();
        }   // javascript
        wd.addPromiseChainMethod('tap', tap);

        function tapWithOutModified(opts,log) {
            if(log !== null && log !== undefined){
                console.log(log);
            }
            //console.log("X" + opts.X +";windowWidht:"+opts.Y);
            //var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
            //var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

            var action = new wd.TouchAction(this);
            action
                .tap({x: opts.X, y: opts.Y});
            return action.perform();
        }   // javascript
        wd.addPromiseChainMethod('tapWithOutModified', tapWithOutModified);

        function swipe(opts,log) {
            if(log !== null && log !== undefined){
                console.log(log);
            }
            console.log("X" + opts.X +";windowWidht:"+opts.Y);
            var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
            var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

            var action = new wd.TouchAction(this);
            action
                .press({x: newX, y: newY})
                .wait(1000)
                .moveTo({x: 10, y: 10})
                .release();
            return action.perform();
        }
        wd.addPromiseChainMethod('swipe', swipe);

        function hold(opts,time,log) {
            if(log !== null && log !== undefined){
                console.log(log);
            }
            console.log("X" + opts.X +";windowWidht:"+opts.Y);
            var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
            var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

            var action = new wd.TouchAction(this);
            action
                .press({x: newX, y: newY})
                .wait(time)
                .release();
            return action.perform();
        }
        wd.addPromiseChainMethod('hold', hold);


        // change context to webview
        function changeContextToWebView(){
            return driver.contexts()
                .then(function (ctxs) {
                    console.log("switch to WEBVIEW");
                    return driver.context(ctxs[1]);
                    //return driver.context("WEBVIEW");
                });
        }
        wd.addPromiseChainMethod('changeContextToWebView', changeContextToWebView);

        // change context to webview
        function changeContextToNative(){
            return driver.contexts()
                .then(function (ctxs) {
                    console.log("switch to NATIVE");
                    return driver.context(ctxs[0]);
                    //return driver.context("WEBVIEW");
                });
        }
        wd.addPromiseChainMethod('changeContextToNative', changeContextToNative);


        function sendKey(key){
            var chain = driver;
            var keycode = key.charCodeAt(0)-68;
            chain.pressDeviceKey(keycode);
            return chain;
        }
        wd.addPromiseChainMethod('sendKey', sendKey);

        function sendString(string){
            var chain = driver;

            chain = chain.keys(string);
            //
            //for(var i = 0; i < string.length; i++){
            //    var char = string[i];
            //    var keyCode = "";
            //    if(keyCodeMapper.needShiftMapDict.hasOwnProperty(char)){
            //        keyCode = keyCodeMapper.needShiftMapDict[char];
            //        chain = chain.pressDeviceKey(keyCode);
            //    }
            //    else{
            //        keyCode = keyCodeMapper.mapJsCodeToAndroidCode(char);
            //        chain = chain.pressDeviceKey(keyCode);
            //    }
            //}
            return chain;
        }
        wd.addPromiseChainMethod('sendString', sendString);
        function sendEnterKey(){
            var chain = driver;
            //chain = chain.pressDeviceKey(SPECIAL_KEYS.Enter);
            chain = chain.pressDeviceKey(66);
            return chain;
        }
        wd.addPromiseChainMethod('sendEnterKey', sendEnterKey);
        function clearTextField(){
            var chain = driver;
            for(var i = 0; i < 39; i++){
                chain = chain.pressDeviceKey(67);
            }
            return chain;
        }
        wd.addPromiseChainMethod('clearTextField', clearTextField);


        return driver
            .sleep(10000)
            .getWindowSize()
            .then(function(size){
                windowSize = size;
                console.log(windowSize);
            })
            //.changeContextToWebView()
            //.elementById('pp-login-with-acc-btn')
            //.click()
            //.sleep(1000)
            //.elementById('pp-login-username')
            //.click()
            //.clear()
            //.sendKeys('dat@gmail.com')
            //.elementById('pp-login-password')
            //.sendKeys('111111111')
            //hide keyboard
            //.elementById('pp-login-btn')
            //.click()
            //click login button
            //.elementById('pp-login-btn')
            //.click()
            //wait for login
            //.sleep(5000)
            //.changeContextToNative()

            /**
             * Login facebook
             */
            //.tap(buttonPosition.login.loginFacebookBtn,"Click login facebook")
            //.sleep(5000)
            //.tap(buttonPosition.login.loginFacebookEmailInput,"Click facebook email input")
            //.sendString('phan_zmleiey_thanh@tfbnw.net')
            //.sendEnterKey()
            //.sleep(1000)
            //.sendString('brumob')
            //.sendEnterKey()
            /**
             * End login facebook
             */
            /**
             * Login account
             */
            .tap(buttonPosition.login.loginScene,"Show Log in")
            .sleep(1000)
            .tap(buttonPosition.login.loginEmailInput,"Prepare for input mail")
            .sleep(1000)
            .clearTextField()
            .sendString('duong@g.com')
            .sendEnterKey()
            .sendString('111111111')
            .sendEnterKey()
            /**
             * End login account
             */
            .sleep(20000)
            .tap(buttonPosition.header.profileAvatar,"Click profile")
            .sleep(2000)
            .tap(buttonPosition.popup.profile.closeBtn,"Closing profile")
            .sleep(2000)
            .tap(buttonPosition.header.buyCoinButton,"Click popup shop")
            .sleep(1000)
            .tap(buttonPosition.header.crownButton, "Click tap crown")
            .sleep(1000)
            .tap(buttonPosition.header.coinsButton, "Click tap coins")
            .sleep(1000)
            .tap(buttonPosition.header.closedShop, "Closed shop")
            .sleep(1000)
            //.swipe(1553, 510, "luot lobby")
           // .sleep(1000)
            .tap(950, 337, "download deepblue")

            .hold(950, 337, "Remove deepblue")
            .sleep(1000)
           // .tap({X: 1670, Y: 126},"close popup shop swipe")
            ////.swipe({X: 1670, Y: 126},"close popup shop swipe")
            //.sleep(1000)
            ////click setting button
            //.tap({X: 1850,Y: 60 },"click setting button")
            //.sleep(1000)
            //.tap({X: 1346,Y: 178 },"click logout button")
            ////wait to show setting popup
            .sleep(30000);

    });
});
