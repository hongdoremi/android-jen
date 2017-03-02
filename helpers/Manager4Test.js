/**
 * Created by Oanh on 12/17/2016.
 */
var buttonPosition =  require("./ButtonPosition");
var driver = null;
function objectIsNull(object) {
    return (object == null || object == undefined );
}
function objectNotNull(object){
    return !objectIsNull(object);
}
module.exports = {
    that:this,
    setup: function(wd, d){
        driver = d;
        var windowSize = null;
        var that = this;
        function getXEstimateByWidthFrom1920 (x){
            return x*windowSize.width/1920;
        }
        function getYEstimateByHeighFrom1080(y){
            return y*windowSize.height/1080;
        }

        function tap(opts,log) {
            if(objectNotNull(log)){
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

        //:Luot sang trai: {X:-1,Y:0}
        //:Luot sang phai: {X:1,Y:0}
        //:Luot len: {X:0,Y:-1}
        //:Luot xuong: {X:0,Y:1}
        function swipe(opts, direction, log) {
            if(log !== null && log !== undefined){
                console.log(log);
            }
            console.log("X" + opts.X +";windowWidht:"+opts.Y);
            var newX = getXEstimateByWidthFrom1920(opts.X);//*windowSize.width/1920;
            var newY = getYEstimateByHeighFrom1080(opts.Y);//*windowSize.height/1080;

            var end = {x: getXEstimateByWidthFrom1920(opts.X + 100 * direction.x),
                y: getYEstimateByHeighFrom1080(opts.Y + 100 * direction.y)};

            var action = new wd.TouchAction(this);
            action
                .press({x: newX, y: newY})
                .wait(1000)
                .moveTo(end)
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

        function sendString(string,log){
            if(objectNotNull(log)){
                console.log(log);
            }
            var chain = driver;

            chain = chain.keys(string);
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
        function sendBackKey(){
            var chain = driver;
            //chain = chain.pressDeviceKey(SPECIAL_KEYS.Enter);
            chain = chain.pressDeviceKey(4);
            return chain;
        }
        wd.addPromiseChainMethod('sendBackKey', sendBackKey);
        function clearTextField(ignore){
            var chain = driver;
            if(!ignore) {
                for (var i = 0; i < 39; i++) {
                    chain = chain.pressDeviceKey(67);
                }
            }
            return chain;
        }
        var isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        };
        wd.addPromiseChainMethod('clearTextField', clearTextField);
        for(var key in that){
            if(that.hasOwnProperty(key) && isFunction(that[key])){
                wd.addPromiseChainMethod(key, that[key]);
            }
        }
        //wd.addPromiseChainMethod('callLogin', this.callLogin);
        //wd.addPromiseChainMethod('callLogout', this.callLogout);
        //wd.addPromiseChainMethod('callChangeAvatar', this.callChangeAvatar);
        //wd.addPromiseChainMethod('callEditName', this.callEditName);
        //wd.addPromiseChainMethod('callAchievement', this.callAchievement);
        //wd.addPromiseChainMethod('collectComeBackBonus', this.collectComeBackBonus);
        //wd.addPromiseChainMethod('collectDailyBonusStreak', this.collectDailyBonusStreak);
        //wd.addPromiseChainMethod('callTestDownloadGameDeepBlue', this.callTestDownloadGameDeepBlue);
        //wd.addPromiseChainMethod('callTestDownloadGameGoldenEggs', this.callTestDownloadGameGoldenEggs);
        //wd.addPromiseChainMethod('callTestDownloadGamePharaoh', this.callTestDownloadGamePharaoh);
        //wd.addPromiseChainMethod('callTestDownloadGameBoxing', this.callTestDownloadGameBoxing);
        //wd.addPromiseChainMethod('collectDailyBonusStreak', this.collectDailyBonusStreak);
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //wd.addPromiseChainMethod('callTestProfileAndShop', this.callTestProfileAndShop);
        //wd.addPromiseChainMethod('callTestDownloadGame', this.callTestDownloadGame);
        //wd.addPromiseChainMethod('callTestPopupFriends', this.callTestPopupFriends);
        //wd.addPromiseChainMethod('callTestAchievementAndGift', this.callTestAchievementAndGift);
        //wd.addPromiseChainMethod('callTestChangeAvaterSamsung', this.callTestChangeAvaterSamsung);
        //wd.addPromiseChainMethod('callTestSpins', this.callTestSpins);

        return driver
            .sleep(15000)
            .getWindowSize()
            .then(function(size) {
                windowSize = size;
                console.log(windowSize);
            });
    },
    callLogin: function(accountType, email, pass){
        var info = {
            btnLogin: null,
            sleep: 0,
            btnInput: null,
            ignoreClearText: false,
            email: email,
            pass: pass
        };
        switch(accountType){
            case 1:
                info.sleep = 5000;
                return driver
                    .tap(buttonPosition.login.loginGuest,"Login guest")
                    .sleep(info.sleep);
                break;
            case 2:
                info.btnLogin = buttonPosition.login.loginScene;
                info.sleep = 1000;
                info.btnInput = buttonPosition.login.loginEmailInput;
                info.ignoreClearText = false;
                break;
            case 3:
                info.btnLogin = buttonPosition.login.loginFacebookBtn;
                info.sleep = 5000;
                info.btnInput = buttonPosition.login.loginFacebookEmailInput;
                info.ignoreClearText = true;
                break;
        }
        if(info.sleep > 0){
            return driver
                .tap(info.btnLogin,"Show Log in")
                .sleep(info.sleep)
                .tap(info.btnInput,"Prepare for input mail")
                .sleep(1000)
                .clearTextField(info.ignoreClearText)
                .sendString(info.email)
                .sendEnterKey()
                .sleep(1000)
                .sendString(info.pass)
                .sendEnterKey();
        }
        return driver;
    },
    callSignUp: function(email, pass, refCode ){

        var info = {
            email: email,
            pass: pass,
            rePass: pass,
            refCode: refCode

        };
        return driver
            .tap(buttonPosition.login.loginScene,"Show Log in")
            .sleep(1000)
            .tap(buttonPosition.login.signUpScene,"Prepare for input mail")
            .sleep(1000)
            .tap(buttonPosition.login.signUp.emailInput)
            //.clearTextField()
            .sendString(info.email,"mail sign up :"+info.email)
            .sendEnterKey()
            .sleep(1000)
            .sendString(info.pass)
            .sendEnterKey()
            .sleep(1000)
            .sendString(info.rePass)
            .sendEnterKey()
            .sleep(1000)
            .sendString(info.refCode)
            .sendEnterKey()
            .sleep(3000)
            .tap(buttonPosition.login.popupError.ok)
    },
    log: function(str){
        console.log(str);
    },
    sleepWithLog:function(timeOut,str){
        console.log(str);
        return driver.sleep();
    },
    callLogout: function(){
        console.log("Log Out");
        return driver.sleep(1000)
        ////click setting button
        .tap(buttonPosition.header.settingButton,"click setting button")
        .sleep(1000)
        .tap({X: 1439,Y: 172 },"click logout button");
    },
    callChangeAvatarForMayAo: function(){
        return driver
            .tap(buttonPosition.header.profileAvatar, "profileAvatar")
            .sleep(2000)
            .tap(buttonPosition.popup.profile.changeAvatarBtn, "changeAvatarBtn")
            .sleep(2000)
            .tap(buttonPosition.popup.profile.changeAvatarBtn, "changeAvatarBtn")
            .sleep(4000)
            .tap(buttonPosition.popup.btnOKChangeAvatar, "btnOKChangeAvatar");
    },
    callEditName: function(){
        return driver
            .tap(buttonPosition.header.profileAvatar, "Open profile")
            .sleep(2000)
            .tap(buttonPosition.popup.profile.editNameBtn, "Click change name")
            .tap(buttonPosition.popup.profile.editNameBtn, "Click change name")
            .sleep(2000)
            .tap(buttonPosition.popup.editName.btneditname, "Click input field")
            .sleep(3000)
            .sendString('brumob')
            .sleep(2000)
            .clearTextField()
            .sleep(2000)
            .sendString('nguyen to')
            .sleep(2000)
            .tap(buttonPosition.popup.editName.btnsendeditname, "Click send")
            .tap(buttonPosition.popup.editName.btnsendeditname, "Click send")
            .sleep(1500)
            .tap(buttonPosition.popup.editName.btnOKeditname, "Click Ok")
            .sleep(3000);
    },
    callAchievement: function() {
        return driver
            .tap(buttonPosition.footer.achievementButton,"achievementButton")
            .sleep(1000)
            .tap(buttonPosition.popup.achievement.btnCollectAch1, "collect achievement")
            .sleep(3000)
            .tap(buttonPosition.popup.achievement.btnCollectAch2, "collect achievement")
            .sleep(3000)
            .tap(buttonPosition.popup.achievement.btnCollectAch3, "collect achievement")
            .sleep(3000)
            .tap(buttonPosition.popup.achievement.btnGame,"btnGame")
            .sleep(2000)
            .tap(buttonPosition.popup.achievement.btnCollectAch1, "collect achievement")
            .sleep(3000)
            .tap(buttonPosition.popup.achievement.btnCollectAch2, "collect achievement")
            .sleep(3000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .tap(buttonPosition.popup.achievement.btnSocial, "btnSocial")
            .sleep(1000)
            .tap(buttonPosition.popup.achievement.btnCollectAch1, "collect achievement")
            .sleep(3000)
            .tap(buttonPosition.popup.achievement.btnCollectAch2, "collect achievement")
            .sleep(3000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .tap(buttonPosition.popup.achievement.btnGeneral, "btnGeneral")
            .sleep(1000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(1000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(1000)
            .tap(buttonPosition.popup.achievement.btnCloseAch, "btnCloseAch")
            .sleep(2000);
    },
    callGift: function(){
        return driver.sleep(2000)
            .tap(buttonPosition.footer.giftButton,"Click button Gift").sleep(3000)
            .tap(buttonPosition.header.inboxFriendButton,"Click button inbox").sleep(3000)
            .tap(buttonPosition.footer.leaderboadButton,"Click button LeaderBoard").sleep(3000)
            .tap(buttonPosition.header.totalBetFriendButton, "click totalBetFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.coinsFriendButton, "click coinsFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.inboxFriendButton, "click tap inbox").sleep(3000)
            .tap(buttonPosition.header.closedFriends)
            .sleep(3000);
    },
    callGiftFaceBook: function(){
        return driver.sleep(2000)
            .tap(buttonPosition.header.friendButton, "click popup friend").sleep(2000)
            //.tap(buttonPosition.header.popupLeaderBoardFaceBook,"popupLeaderBoardFaceBook").sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnFriend,"btnFriend").sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.clickSendGift1,"clickSendGift1").sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnSendGift,"btnSendGift").sleep(7000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.Invite,"Click Send").sleep(8000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnOK,"Click OK").sleep(3000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.clickInvite,"clickSendGift1").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.clickInvite,"clickSendGift1").sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnInvite,"btnSendGift").sleep(3000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.Invite,"Click Invite").sleep(8000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnOK,"Click OK").sleep(3000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnLeaderBoard,"btnLeaderBoard").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.totalBetFriendButton, "click totalBetFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.coinsFriendButton, "click coinsFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.inboxFriendButton, "click tap inbox").sleep(3000)
            .tap(buttonPosition.header.popupLeaderBoardFaceBook.btnAcceptAll,"btnAcceptAll").sleep(3000)
            .tap(buttonPosition.header.closedFriends)
            .sleep(3000);
    },
    callProfile: function(){
        return driver
            .sleep(5000)
            .tap(buttonPosition.header.profileAvatar,"Click profile")
            .sleep(2000)
            .tap(buttonPosition.popup.profile.closeBtn,"Closing profile")
            .sleep(5000)
            .swipe({X: 1510, Y: 550}, {X: -1,Y: 0})
            .sleep(2000)
            .swipe({X: 754, Y: 514}, {X: 1,Y: 0})
            .sleep(2000)
            .swipe({X: 1510, Y: 550}, {X: -1,Y: 0})
            .sleep(2000)
            .swipe({X: 754, Y: 514}, {X: 1,Y: 0})
            .sleep(2000)
            .tap(buttonPosition.footer.freecoingift,"Click collect free coin gift")
            .sleep(5000)
            .tap(buttonPosition.footer.freecoingift,"Click collect free coin gift")
            .sleep(5000)
            .tap(buttonPosition.footer.freecoingift,"Click collect free coin gift")
            .sleep(5000)
            .tap(buttonPosition.footer.freecoingift,"Click collect free coin gift")
            .sleep(5000);
    },
    callShop: function(){
        return driver
            .tap(buttonPosition.header.popupShop, "click popup shop").sleep(3000)
            .tap(buttonPosition.header.crownButton, "Click tap crown")
            .sleep(2000)
            .tap(buttonPosition.header.coinsButton, "Click tap coins")
            .sleep(2000)
            .tap(buttonPosition.header.buyCoinButton, "Click buy coin")
            .sleep(3000)
            .tap(buttonPosition.popup.shop.closeError, "Click Popup Error")
            .sleep(3000)
            .tap(buttonPosition.header.crownButton, "Click tap crown")
            .sleep(2000)
            .tap(buttonPosition.header.buyCrownButton, "Click buy crown")
            .sleep(3000)
            .tap(buttonPosition.popup.shop.closeError, "Click Popup Error")
            .sleep(3000)
            .tap(buttonPosition.header.coinsButton, "Click tap coins")
            .sleep(2000)
            .tap(buttonPosition.header.watchVideo, "Click video")
            .sleep(12000)
            .tap(buttonPosition.header.btnOKVideo, "Click collect video")
            .sleep(2000)
            .sleep(2000)
            .swipe({X: 1510, Y: 550}, {X: -1,Y: 0})
            .sleep(2000)
            .swipe({X: 754, Y: 514}, {X: 1,Y: 0})
            .sleep(2000)
            .tap(buttonPosition.popup.shop.closeBtnShop,"Closing shop")
            .sleep(5000);
    },
    callTestAchievementAndGift: function(){
        return driver.
             tap(buttonPosition.footer.achievementButton, " Click achivement")
            .sleep(1000)
            .swipe({X: 1079, Y: 912}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1129, Y: 336}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.footer.collectAchievementButton, "Click Collect")
            .sleep(5000)
            .tap(buttonPosition.footer.gameAchievementButton, "Click Tap Game")
            .sleep(1000)
            .tap(buttonPosition.footer.socialAchievementButton, "Click Tap Social")
            .sleep(1000)
            .tap(buttonPosition.footer.generalAchievementButton, "Click Tap General")
            .sleep(1000)
            .tap(buttonPosition.footer.closedAchievement, "Closed Achievement")
            .sleep(1000)
            .tap(buttonPosition.footer.giftButton, "Closed giftButton")
            .sleep(1000)
            .tap(buttonPosition.footer.leaderboadButton, "Closed leaderboadButton")
            .sleep(1000)
            .tap(buttonPosition.header.totalBetFriendButton, "Click Tap TotalBet")
            .sleep(1000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.coinsFriendButton, "Click Tap Coins")
            .sleep(1000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.closedFriends)
            .sleep(1000)
    },
    callPopupFriend: function(){
        return driver.sleep(10000)
            .tap(buttonPosition.header.friendButton, "click popup friend").sleep(2000)
            .tap(buttonPosition.header.totalBetFriendButton, "click totalBetFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.coinsFriendButton, "click coinsFriendButton").sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1172, Y: 820}, {X: 0,Y: -1})
            .sleep(2000)
            .swipe({X: 1193, Y: 427}, {X: 0,Y: 1})
            .sleep(2000)
            .tap(buttonPosition.header.inboxFriendButton, "click tap inbox").sleep(3000)
            .tap(buttonPosition.header.closedFriends)
            .sleep(3000);
    },
    callPopupSetting: function(){
        return driver.sleep(5000)
            .tap(buttonPosition.header.settingButton, "click popup setting").sleep(3000)
            .tap(buttonPosition.header.settingButtonMusic, "click background music").sleep(3000)
            .tap(buttonPosition.header.settingButtonMusic, "click background music").sleep(3000)
            .tap(buttonPosition.header.settingButtonSound, "click sound effect").sleep(3000)
            .tap(buttonPosition.header.settingButtonSound, "click sound effect").sleep(3000)
            .tap(buttonPosition.header.settingButtonLanguage,"click Language").sleep(3000)
            .tap(buttonPosition.header.settingButtonLanguage1,"click Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonOKLanguage,"click OK Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonLanguage,"click Language").sleep(3000)
            .tap(buttonPosition.header.settingButtonLanguage2,"click Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonOKLanguage,"click OK Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonLanguage,"click Language").sleep(3000)
            .tap(buttonPosition.header.settingButtonLanguage3,"click Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonOKLanguage,"click OK Language").sleep(2000)
            //.tap(buttonPosition.header.settingButtonLanguage4,"click Language").sleep(2000)
            //.tap(buttonPosition.header.settingButtonLanguage5,"click Language").sleep(2000)
            //.tap(buttonPosition.header.settingButtonLanguage6,"click Language").sleep(2000)
            //.tap(buttonPosition.header.settingButtonOKLanguage,"click OK Language").sleep(2000)
            .tap(buttonPosition.header.settingButtonPolicy, "click button Policy").sleep(6000)
            .sendBackKey().sleep(2000)
            .tap(buttonPosition.header.settingButtonSevice, "click button service").sleep(5000)
            .sendBackKey().sleep(8000)
            //.tap(buttonPosition.header.settingButtonVersion, "click Version")
            //.tap(buttonPosition.header.settingButtonVersion, "click Version")
            //.tap(buttonPosition.header.settingButtonVersion, "click Version")
            //.tap(buttonPosition.header.settingButtonVersion, "click Version")
            //.tap(buttonPosition.header.settingButtonVersion, "click Version").sleep(2000)
            //.tap(buttonPosition.header.settingButtonCloseVersion,"Click X")
            //.tap(buttonPosition.header.settingButtonCloseVersion,"Click X")
            //.sleep(3000)
            .tap(buttonPosition.header.settingButtonClose, "click Close").sleep(3000);
    },
    callTestGameNezha: function(){
        return driver.sleep(2000)
            .tap(buttonPosition.body.nezha, "Click nezha")
            .sleep(8000)
            .hold(buttonPosition.body.spins,2100, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.subTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.btnInfo,"Click i").sleep(2000)
            .tap(buttonPosition.body.btnInfoAddBet,"Click Add Total Bet").sleep(2000)
            .tap(buttonPosition.body.btnInfoSubBet,"Click Sub Total Bet").sleep(2000)
            .tap(buttonPosition.body.btnInfoAddPayLine,"Click Add Payline").sleep(2000)
            .tap(buttonPosition.body.btnInfoSubPayLine,"Click Sub Payline").sleep(2000)
            .tap(buttonPosition.body.btnInfoInFo,"Click tap info").sleep(2000)
            .swipe({X: 1557, Y: 605}, {X: -1,Y: 0},"Luot trai 1")
            .sleep(2000)
            .swipe({X: 1557, Y: 605}, {X: -1,Y: 0},"Luot trai 2")
            .sleep(2000)
            .swipe({X: 1557, Y: 605}, {X: -1,Y: 0},"Luot trai 3")
            .sleep(2000)
            .swipe({X: 1557, Y: 605}, {X: -1,Y: 0},"Luot trai 4")
            .sleep(2000)
            .swipe({X: 1557, Y: 605}, {X: -1,Y: 0},"Luot trai 5")
            .sleep(2000)
            .swipe({X: 327, Y: 587}, {X: 1,Y: 0},"Luot phai 1")
            .sleep(2000)
            .swipe({X: 327, Y: 587}, {X: 1,Y: 0},"Luot phai 2")
            .sleep(2000)
            .swipe({X: 327, Y: 587}, {X: 1,Y: 0},"Luot phai 3")
            .sleep(2000)
            .swipe({X: 327, Y: 587}, {X: 1,Y: 0},"Luot phai 4")
            .sleep(2000)
            .swipe({X: 327, Y: 587}, {X: 1,Y: 0},"Luot phai 5")
            .sleep(2000)
            .tap(buttonPosition.body.btnInfoBet,"Click tap Bet").sleep(2000)
            .tap(buttonPosition.body.btnInfoClose,"Click Close").sleep(2000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);

    },
    callTestDownloadGameDeepBlue: function(){
        return driver.
            tap(buttonPosition.body.deepblue, "Click download deepblue")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .hold(buttonPosition.body.deepblue, 2100, "Remove deepblue")
            .sleep(2000)
            .tap({X:941, Y:658}, "click remove")
            .sleep(8000)
            .tap(buttonPosition.body.deepblue, "Click download deepblue")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .tap(buttonPosition.body.deepblue, "Click deepblue")
            .sleep(8000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);
    },
    callTestDownloadGameGoldenEggs: function(){
        return driver.
            tap(buttonPosition.body.goldeneggs, "Click download goldeneggs")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(10000)
            .hold(buttonPosition.body.goldeneggs, 2100, "Remove goldeneggs")
            .sleep(2000)
            .tap({X:941, Y:658}, "click remove")
            .sleep(8000)
            .tap(buttonPosition.body.goldeneggs, "Click download goldeneggs")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .tap(buttonPosition.body.goldeneggs, "Click goldeneggs")
            .sleep(8000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);
    },
    callTestDownloadGamePharaoh: function(){
        return driver.
            tap(buttonPosition.body.pharaoh, "Click download pharaoh")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .hold(buttonPosition.body.pharaoh, 2100, "Remove pharaoh")
            .sleep(2000)
            .tap({X:941, Y:658}, "click remove")
            .sleep(8000)
            .tap(buttonPosition.body.pharaoh, "Click download pharaoh")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .tap(buttonPosition.body.pharaoh, "Click pharaoh")
            .sleep(8000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);
    },
    callTestDownloadGameBoxing: function(){
        return driver.
            tap(buttonPosition.body.boxing, "Click download boxing")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .hold(buttonPosition.body.boxing, 2100, "Remove boxing")
            .sleep(2000)
            .tap({X:941, Y:658}, "click remove")
            .sleep(8000)
            .tap(buttonPosition.body.boxing, "Click download boxing")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .tap(buttonPosition.body.boxing, "Click boxing")
            .sleep(8000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);
    },
    callTestDownloadGameRomanEmpire: function(){
        return driver.
            tap(buttonPosition.body.romanEmpire, "Click download romanEmpire")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .hold(buttonPosition.body.romanEmpire, 2100, "Remove romanEmpire")
            .sleep(2000)
            .tap({X:941, Y:658}, "click remove")
            .sleep(8000)
            .tap(buttonPosition.body.romanEmpire, "Click download romanEmpire")
            .sleep(1000)
            .tap({X:941, Y:658}, "click download")
            .sleep(8000)
            .tap(buttonPosition.body.romanEmpire, "Click romanEmpire")
            .sleep(8000)
            .tap(buttonPosition.body.addTotalBet, "click Total Bet")
            .sleep(5000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.body.spins, "click Spin")
            .sleep(7000)
            .tap(buttonPosition.header.home,"Click home").sleep(3000);
    },
    callTestChangeAvaterSamsung: function(){
        return driver.
             sleep(10000)
            .tap(buttonPosition.header.profileAvatar,"Click profile")
            .sleep(2000)
            .tap(buttonPosition.header.cameraAvatar,"Click Camera")
            .sleep(4000)
            .tap({X: 549, Y: 832}, "Click Photos")
            .sleep(4000)
            .tap({X: 163, Y: 983}, "Click OGQ")
            .sleep(5000)
            .tap({X: 106, Y: 492}, "Click Image")
            .sleep(5000)
            .tap({X: 945, Y: 654}, "Click OK")
            .sleep(1000)
            .sleep(7000)
            .tap(buttonPosition.header.profileAvatar,"Click profile")
            .sleep(2000)
            .tap(buttonPosition.header.editName,"Click EditName")
            .sleep(4000)
            .tap({X: 961, Y: 577}, "Click Change Name")
            .sleep(5000)
            .sendString('hong test').sleep(5000)
            .sendEnterKey()
            .sleep(4000)
            .tap({X: 945, Y: 654}, "Click OK")
            .sleep(3000)
    },
    callTestSpins: function(){
        return driver.
            tap(buttonPosition.body.nezha, "Click nezha")
            .sleep(5000)
            .tap(buttonPosition.body.addTotalBet, "Click TotalBet")
            .sleep(2000)
            .tap(buttonPosition.body.spins, "Click Spins")
            .sleep(5000)
    },
    collectComeBackBonus: function(){
        return driver
            .tap(buttonPosition.popup.btnComeBackBonus,"click collect").sleep(1500)
            .tap(buttonPosition.popup.btnComeBackBonus,"click collect").sleep(1500)
            .tap(buttonPosition.popup.btnComeBackBonus,"click collect").sleep(1500)
            .sleep(1500);
    },
    collectDailyBonusStreak: function(){
        return driver
            .tap(buttonPosition.popup.btnDailyBonusStreak,"click collect").sleep(1500)
            .tap(buttonPosition.popup.btnDailyBonusStreak,"click collect").sleep(1500)
            .tap(buttonPosition.popup.btnDailyBonusStreak,"click collect").sleep(1500)
            .sleep(1500);
    },
    playTutorial:function(){
    return driver.sleep(2000)
        .tap(buttonPosition.body.tutorial.btnClaim,"Click button Collect Claim").sleep(5000)
        .tap(buttonPosition.body.nezha,"Click Game Nezha").sleep(7000)
        .tap(buttonPosition.body.addTotalBet,"addTotalBet").sleep(5000)
        .tap(buttonPosition.body.spins,"spins").sleep(12000)
        .tap(buttonPosition.header.home,"home").sleep(3000)
        .tap(buttonPosition.footer.achievementButton,"achievementButton").sleep(3000)
        .tap(buttonPosition.popup.achievement.btnCollectAch1,"btnCollectAch1").sleep(8000)
        .tap(buttonPosition.popup.achievement.btnCloseAch,"btnCloseAch").sleep(3000)
        .tap(buttonPosition.body.tutorial.btnTutorialShop,"btnTutorialShop").sleep(3000)
        .tap(buttonPosition.header.watchVideo,"watchVideo").sleep(1000)
        .tap(buttonPosition.header.watchVideo,"watchVideo").sleep(12000)
        .tap(buttonPosition.header.btnOKVideo,"btnOKVideo").sleep(4000)
        .tap(buttonPosition.popup.btnDailyBonusStreak,"btnDailyBonusStreak").sleep(3000)
        .tap(buttonPosition.header.watchVideo,"watchVideo").sleep(12000)
        .tap(buttonPosition.header.btnOKVideo,"btnOKVideo").sleep(4000)
        .tap(buttonPosition.header.closedShop,"closedShop").sleep(1000);
    },
    CollectComBackBonusWheelFacebook: function(){
        return driver.tap(buttonPosition.body.facebookBonusWheel.btnSpin,"Click Spin").sleep(7000)
            .tap(buttonPosition.body.facebookBonusWheel.btnCollectDailyWheel,"Click Collect comeback bonus wheel").sleep(6000);
    }
};

