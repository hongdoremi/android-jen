"use strict";

require("./helpers/setup");

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
      _.clone(require("./helpers/caps").android18)
            //:
      //_.clone(require("./helpers/caps").android19)
        ;
    //desired.app = path.resolve('apps/lobby.apk');//require("./helpers/apps").selendroidTestApp;
    desired.appPackage = 'com.lobbyteam.playpalace.unity';
    desired.appActivity = 'com.lobbyteam.playpalace.unity.MainActivity';
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
      function tap(opts) {
          console.log("X" + opts.X +";windowWidht:"+windowSize.width);
          var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
          var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

          var action = new wd.TouchAction(this);
          action
              .tap({x: newX, y: newY});
          return action.perform();
      }
      wd.addPromiseChainMethod('tap', tap);

      // change context to webview
      function changeContextToWebView(){
          return driver.contexts()
              .then(function (ctxs) {
                  console.log("switch to WEBVIEW");
                  return driver.context(ctxs[ctxs.length - 1]);
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

    return driver
        .sleep(10000)
        .getWindowSize()
        .then(function(size){
            windowSize = size;
        })
        .changeContextToWebView()
        .elementById('pp-login-with-acc-btn')
        .click()
        .sleep(1000)
        .elementById('pp-login-username')
        .click()
        .clear()
        .sendKeys('dat@gmail.com')
        .elementById('pp-login-password')
        .sendKeys('111111111')
        .elementById('pp-login-btn')
        .click()
        .elementById('pp-login-btn')
        .click()
        .sleep(5000)
        .changeContextToNative()
        .tap({X: 64,Y: 58 })
        //.press
        //.elementById('pp-login-as-guest-btn')
      //.elementByName('buttonStartWebviewCD')
      //  .click()
      //.sleep(5000)
        //  .execute('mobile: tap', {
        //      tapCount: '2',
        //  touchCount:'2',
        //  duration:'1',
        //  x:'960',
        //  y:'350'})
        //.tap({X: 10,Y: 10 })
        //.execute('alert("cool");')
        //.tap(1,960,360,1)
        .sleep(15000);
      //.source().then(function (source) {
      //});


      //return driver
      //return driver
      //  .sleep(15000)
      //  .contexts()
      //  .then(function (ctxs) {
      //    console.log(ctxs);
      //    return driver.context(ctxs[ctxs.length - 1]);
      //    //return driver.context("WEBVIEW");
      //  })
      //  .sleep(10000)
      //  .elementById('facebook-logo')
      ////.elementByName('buttonStartWebviewCD')
      //  .click()
      //.sleep(5000)
      //.elementById('name_input')
      //  .clear()
      //  .sendKeys('Appium User')
      //  .sendKeys(wd.SPECIAL_KEYS.Return)
      //.sleep(1000)
      //.source().then(function (source) {
      //  source.should.include('This is my way of saying hello');
      //  source.should.include('Appium User');
      //});


  });
});
