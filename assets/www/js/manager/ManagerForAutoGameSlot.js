/**
 * Created by Phan on 11/26/2016.
 */
function ManagerForAutoGameSlot(my) {

    var excelHeaderPrefix = {
        freeCoinGiftInfo:"#"
    };

    var that = this;
    var currentTimeInGameClock = null;

    var arrayFreeCoinGift = null;
    var timeOutToClosePopupWhenLevelUp = 1000;
    //var modifyCollectTime = 1.0/(60*15); //Debug only
    var modifyCollectTime = 1.0; //Debug only
    var buttonAutoFCGPosition = null;
    var isCollectingFreeCoinGift = false;
    var nextCollectTimeText = null;
    var waitingTime = [60 * 60 * 1000, 30 * 60 * 1000, 15 * 60 * 1000];
    var buttonCoinGift = [];
    var btnAutoPlayVideo = null;
    var autoCollect = null;

    var btnDailyBonusSpin = null;
    var btnDailyBonusStreak = null;

    var currentStreakOnOutOfMoney = false;

    this.manualClickAutoSpinButton = function () {
        my.currentGameSlot.getGame().onSpin();
    };


    var setNextCollectTimeText = function (currentTimeInMs) {
        nextCollectTimeText.text = Helper.Time.millisecondTimeToStringNormalTime(currentTimeInMs, true);
    };
    /**
     * #Thanh
     * Init next collect time text
     * @param group
     * @returns {*}
     */
    var initNextCollectTimeText = function (group) {
        var style = {
            font: "50px PassionOne-Regular",
            fill: "#009933"
        };
        var text = my.add.text(200, 100, "", style, group);
        return text;
    };

    /**
     * #Thanh
     * Init free coin gift array as hardcode
     * @returns {*[]}
     */
    var initFreeCoinGift = function () {
        var array = [
            {
                coinReward: 30000,
                waitingTime: 1000 * 60 * 60 * modifyCollectTime
            },
            {
                coinReward: 15000,
                waitingTime: 1000 * 60 * 30 * modifyCollectTime
            },
            {
                coinReward: 8000,
                waitingTime: 1000 * 60 * 15 * modifyCollectTime
            }
        ];

        return array;
    };

    /**
     * #Thanh
     * Init last collect info
     * @param currentTimeInMs
     * @param lastCoinGift
     * @returns {{}}
     */
    var initLastCollectInfo = function (currentTimeInMs, lastCoinGift) {
        var info = {};
        info.nextCollectTime = currentTimeInMs;
        info.nextCoinGiftId = lastCoinGift ? lastCoinGift : 0;


        //if(lastCoinGift == null){
        //
        //}else{
        //    info.collectReward = lastCoinGift.coinReward;
        //    info.nextWatingTime = lastCoinGift.waitingTime;
        //    for(var i = 1; i<arrayFreeCoinGift.length;i++){
        //        info.nextCoinGift = arrayFreeCoinGift[i];
        //        if(arrayFreeCoinGift[i-1].waitingTime == info.nextWatingTime){
        //            break;
        //        }
        //    }
        //}

        //info.nextCollectTime = currentTimeInMs + info.nextWatingTime;
        return info;

    };
    /**
     * Collect free coin gift
     * @param coinGift
     */
    var collectFreeCoinGift = function (currentTimeInMs, coinGiftIndex, callback) {
        var resultFunc = function (isSuccess, data, response) {
            if (isSuccess) {
                console.log("Collecting auto free coin gift at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInMs, true) + " success. Received " + data.coin_reward);
                that.updateFreeCoinGiftForCurrentLevelInfo(coinGiftIndex);

            } else {
                console.log("Collecting auto free coin gift at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInMs, true) + " failed. Code " + data.core_result_code);
            }
            var _pos = that.autoCollectFCG ? {x:1600 * 0.55, y: 750 * 0.45} : buttonCoinGift[coinGiftIndex];
            LobbyC.MainMenu.createCoinAnimation(_pos, null, null, null, function () {
            }, null);
            if (callback) callback(isSuccess);
            isCollectingFreeCoinGift = false;
        };
        Manager4DebugTestAlgorithm.callAPIFreeCoinGift(
            coinGiftIndex,
            LobbyC.MainMenu.referenceKey,
            null,
            resultFunc);
    };
    /**
     * #THanh
     * Check and collect free coin gift based on last collect info
     * @param currentTimeInMs
     */
    var checkAndCollectFreeCoinGift = function (currentTimeInMs) {
        //if (!that.autoCollectFCG || isCollecting)
        //if (!that.autoCollectFCG )
        /**
         * Return when auto collect free coin gift when out of money enabled and is on out of money streak
         */
        if (!that.autoCollectFCG || currentStreakOnOutOfMoney )
            return;
        /**
         * Return when playing tutorial or no token has been entered
         */
        if(LobbyUserData.dataTutorial.isPlayingTutorial || Manager4DebugTestAlgorithm.getToken() === "" ) return;
        if (LobbyConfig.autoTestLastCollectInfo == null) {
            console.log("LobbyConfig.autoTestLastCollectInfo = null, resetting last collect info next gift to first coin gift!");
            LobbyConfig.autoTestLastCollectInfo = initLastCollectInfo(currentTimeInMs, null);
        }
        if (currentTimeInMs >=  LobbyConfig.autoTestLastCollectInfo.nextCollectTime) {
            that.manualCollectFreeCoinGift(currentTimeInGameClock, -1, function(){
                if(LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId < 2){
                    LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId+=1;
                }
            });
        }
    };
   
    /**
     * #Thanh
     * Add time allowing manual collect
     * @param index
     * @param clock
     */
    this.manualCollectFreeCoinGift = function (clock, index, fcallback) {
        //if (isCollecting) return;

        isCollectingFreeCoinGift = true;
        if (Lobby.Utils.objectIsNull(clock)) clock = currentTimeInGameClock;
        if (LobbyConfig.autoTestLastCollectInfo == null) {
            console.log("LobbyConfig.autoTestLastCollectInfo = null, resetting last collect info next gift to first coin gift!");
            LobbyConfig.autoTestLastCollectInfo = initLastCollectInfo(clock.getTimeInMs(), null);
        }
        var manualCollectInfoId = null;
        var nextWaitingTime = null;
        var callback = Lobby.Utils.nullFunction;
        if (index >= 0) {
            manualCollectInfoId = index;
            nextWaitingTime = waitingTime[index];
            callback = function(isSuccess){
                if (Lobby.Utils.objectNotNull(fcallback)) {
                    fcallback(isSuccess);
                }
            }
        }
        else{
            currentTimeInGameClock.setTimeInMs(LobbyConfig.autoTestLastCollectInfo.nextCollectTime);
            currentTimeInGameClock.updateFunction(LobbyConfig.autoTestLastCollectInfo.nextCollectTime,false);
            manualCollectInfoId = LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId;
            nextWaitingTime = waitingTime[LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId];


            //update timer before call api to avoid collect 1 gift 2 time
            var collectedTime = LobbyConfig.autoTestLastCollectInfo.nextCollectTime;

            LobbyConfig.autoTestLastCollectInfo.nextCollectTime += nextWaitingTime;
            setNextCollectTimeText(LobbyConfig.autoTestLastCollectInfo.nextCollectTime);
            callback = function (isSuccess) {
                if (isSuccess) {
                    if (Lobby.Utils.objectNotNull(fcallback)) {
                        fcallback(isSuccess);
                    }
                } else {
                    //recollect if collect fail
                    collectFreeCoinGift(currentTimeInGameClock.getTimeInMs(), manualCollectInfoId, callback);
                }

            };
        }
        collectFreeCoinGift(collectedTime, manualCollectInfoId, callback);
    };
    /**
     * #Thanh
     * Clear all hook and interval
     */
    var onParentGroupDestroy = function () {
        if (that.autoPlayVideoInterval != null) window.clearInterval(that.autoPlayVideoInterval);
        currentTimeInGameClock.updateFunction = Lobby.Utils.nullFunction;
    };
    /**
     * #DAT
     * Auto collect lucky spin
     */
    this.manualCollectLuckySpinDaily = function (callback, ignoreAnimation) {
        if (Lobby.Utils.objectIsNull(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin)) {
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin = 0;
        }
        Manager4DebugTestAlgorithm.callAPILuckySpinDaily(LobbyC.MainMenu.referenceKey,
            function (isSuccess, data, response) {
                if (isSuccess) {
                    LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin++;
                    console.log("Collecting auto lucky spin daily at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true) + " success. Received " + data.coin_reward);
                    if(!ignoreAnimation) {
                        LobbyC.MainMenu.createCoinAnimation(null, null, null, null, function () {
                        }, null);
                    }
                    if (Lobby.Utils.objectNotNull(callback)) {
                        callback(data);
                    }
                }
                else{
                    console.log("Collecting auto lucky spin daily at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true) + " failed.");
                }
            });
    };
    /**
     * #DAT
     * Auto collect daily bonus streak
     */
    this.manualCollectDailyBonusStreak = function (callback, ignoreAnimation) {

        if (Lobby.Utils.objectIsNull(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS)) {
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = 1;
        }
        Manager4DebugTestAlgorithm.callAPIDailyBonusStreak(
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS,
            LobbyC.MainMenu.referenceKey,
            function (isSuccess, data, response) {
                if (isSuccess) {
                    console.log("Collecting auto bonus streak at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true) + " success. Received " + data.coin_reward);

                    LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS++;
                    if (LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS > 7) {
                        LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = 1;
                    }
                    if (Lobby.Utils.objectNotNull(callback)) {
                        callback(data);
                    }
                    if(!ignoreAnimation) {
                        LobbyC.MainMenu.createCoinAnimation(null, null, null, null, function () {
                        }, null);
                    }
                }else{
                    console.log("Collecting auto bonus streak at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true) + " failed.");
                }
            }
        );
    };

    this.autoClosePopupWhenLevelUp = function (closeFunction) {
        if (!that.isAutoClosingPopupWhenLevelUp) return;
        window.setTimeout(closeFunction, timeOutToClosePopupWhenLevelUp);
    };
    this.updateFreeCoinGiftForCurrentLevelInfo = function(collectedCoinGiftId){
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo)) {
            LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo = {};
            LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo.arrayCollect = new Array(arrayFreeCoinGift.length);
            for(var i = 0; i< arrayFreeCoinGift.length; i++){
                LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo.arrayCollect[i] = 0;
            }
            LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo.totalCollectInfo = 0;
        }
        LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo.arrayCollect[collectedCoinGiftId]++;
        LobbyConfig.autoTestInfo.currentLevelInfo.freeCoinGiftInfo.totalCollectInfo += arrayFreeCoinGift[collectedCoinGiftId].coinReward;
    };
    this.setParent = function(group){
        group.add(that.group);
    };
    /**
     * #Thanh
     * Set number of daily bonus spin text
     * @param number
     */
    var setBtnDailyBonusSpinNumber = function(number){
        btnDailyBonusSpin.textBtn.text = "CollectLuckySpinDaily\n" + number;
    };
    /**
     * #Thanh
     * Set number of daily bonus streak text
     * @param number
     */
    this.setBtnDailyBonusStreakNumber = function(number){
        btnDailyBonusStreak.textBtn.text = "CDailyBonusStreak\n" + number;
    };


    /**
     * #Thanh
     * Init all button of auto game slot here
     */
    this.init = function () {
        that.group = my.add.group();
        var parentGroup = that.group;
        if (!LobbyConfig.isTestStrategy) return;
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo) )  LobbyConfig.autoTestInfo.currentLevelInfo = {};
        that.lastTime = 0;
        that.currentTime = 0;
        arrayFreeCoinGift = initFreeCoinGift();
        currentTimeInGameClock = LobbyC.MainMenu.currentTimeInGameClock;
        that.autoChangeBetInfo = {
            isActive: false,
            type: "",
            bet: 0,
            currentBetIndex: 0
        };

        var reloadTextButton = function () {
            if (!that.autoChangeBetInfo.isActive) {
                for (var i = 0; i < buttonAuto.length; ++i) {
                    buttonAuto[i].deactive();
                }
                return;
            }
            for (var i = 0; i < buttonAuto.length; ++i) {
                if (buttonAuto[i].type == that.autoChangeBetInfo.type) {
                    buttonAuto[i].active();
                } else {
                    buttonAuto[i].deactive();
                }
            }
        };

        var createButton = function (x, y, type, name) {
            var autoChangeBet = LobbyC.MainMenu.createTestButton(x, y, name + " - Off", parentGroup, function () {
                if (type == "expected") {
                    that.autoChangeBetInfo.currentBetIndex++;
                    if (that.autoChangeBetInfo.currentBetIndex == my.arrayBet.length) {
                        that.autoChangeBetInfo.currentBetIndex = 0;
                        that.autoChangeBetInfo.bet = 0;
                        autoChangeBet.isActive = false;
                    } else {
                        that.autoChangeBetInfo.bet = my.arrayBet[that.autoChangeBetInfo.currentBetIndex];
                        autoChangeBet.isActive = true;
                    }
                } else {
                    autoChangeBet.isActive = !autoChangeBet.isActive;
                }
                that.autoChangeBetInfo.isActive = autoChangeBet.isActive;
                that.autoChangeBetInfo.type = type;
                reloadTextButton();
            }, LobbyConfig.isTestStrategy);
            autoChangeBet.type = type;
            autoChangeBet.isActive = false;

            autoChangeBet.active = function () {
                if (type == "expected") {
                    autoChangeBet.textBtn.text = name + " - On" + "\n" + (that.autoChangeBetInfo.bet * settings.NUM_PAYLINES);
                    autoChangeBet.isActive = true;
                } else {
                    autoChangeBet.textBtn.text = name + " - On";
                    autoChangeBet.isActive = true;
                }
            };

            autoChangeBet.deactive = function () {
                autoChangeBet.textBtn.text = name + " - Off";
                autoChangeBet.isActive = false;
                if (type == "expected") {
                    that.autoChangeBetInfo.currentBetIndex = 0;
                    that.autoChangeBetInfo.bet = 0;
                }
            };

            return autoChangeBet;
        };

        var createButtonAutoGoToFreeSpin = function (x, y, name, callbackActive, callbackDeactive) {
            var autoGoToFreeSpin = LobbyC.MainMenu.createTestButton(x, y, name + " - Off", parentGroup, function () {
                if (autoGoToFreeSpin.isActive) {
                    autoGoToFreeSpin.deactive();
                } else {
                    autoGoToFreeSpin.active();
                }
            }, LobbyConfig.isTestStrategy);
            autoGoToFreeSpin.name = name;
            autoGoToFreeSpin.isActive = false;

            autoGoToFreeSpin.active = function () {
                if (callbackActive) {
                    callbackActive();
                }
                autoGoToFreeSpin.isActive = true;
                autoGoToFreeSpin.textBtn.text = autoGoToFreeSpin.name + " - On";
            };

            autoGoToFreeSpin.deactive = function () {
                if (callbackDeactive) {
                    callbackDeactive();
                }
                autoGoToFreeSpin.isActive = false;
                autoGoToFreeSpin.textBtn.text = autoGoToFreeSpin.name + " - Off";
            };

            return autoGoToFreeSpin;
        };

        var buttonAuto = [];

        buttonAuto.push(createButton(100, 350, "med", "Auto Med"));
        buttonAuto.push(createButton(100, 450, "max", "Auto Max"));
        buttonAuto.push(createButton(100, 550, "expected", "Auto Expected"));

        createButtonAutoGoToFreeSpin(100, 250, "Auto Decrease Bet", function () {
            that.autoDecreaseBet = true;
        }, function () {
            that.autoDecreaseBet = false;
        });
        that.btnAutoGoBonus = createButtonAutoGoToFreeSpin(100, 650, "Auto Go Bonus", function () {
            that.autoGoToBonus = true;
        }, function () {
            that.autoGoToBonus = false;
        });
        that.autoGoToBonus = false;
        that.btnAutoPlayBonus = createButtonAutoGoToFreeSpin(100, 750, "Auto Play Bonus", function () {
            that.autoPlayBonus = true;
        }, function () {
            that.autoPlayBonus = false;
        });
        that.autoPlayBonus = false;
        that.autoPlayVideoInterval = null;

        var checkAndViewVideo = function () {
            if (!Lobby.Utils.isWeb()) {
                if (window.adcolony.loadedRewardedVideoAd() == true) {
                    LobbyC.MainMenu.showVideoAdcolony();
                }
            }
        };

        var setAutoPlayVideo = function (isEnable) {
            if (isEnable) {
                that.autoPlayVideoInterval = window.setInterval(function () {
                    checkAndViewVideo();
                }, 1000 * 15);
            } else {
                if (that.autoPlayVideoInterval != null) {
                    window.clearInterval(that.autoPlayVideoInterval);
                    that.autoPlayVideoInterval = null;
                }
            }
        };
        btnAutoPlayVideo = createButtonAutoGoToFreeSpin(100, 850, "Auto Play Video", function () {
            setAutoPlayVideo(true);
        }, function () {
            setAutoPlayVideo(false);
        });
        btnDailyBonusSpin =
            LobbyC.MainMenu.createTestButton(400, 850, "CollectLuckySpinDaily\n0", parentGroup, function () {
                that.manualCollectLuckySpinDaily(function () {
                   setBtnDailyBonusSpinNumber(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin);
                });

            }, LobbyConfig.isTestStrategy);
        btnDailyBonusStreak =
            LobbyC.MainMenu.createTestButton(700, 850, "CDailyBonusStreak\n1", parentGroup, function () {
                that.manualCollectDailyBonusStreak(function () {
                   that.setBtnDailyBonusStreakNumber(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS);
                });

            }, LobbyConfig.isTestStrategy);

        LobbyC.MainMenu.createTestButton(1000, 850, "ResetDailyStreak", parentGroup, function () {
            LobbyC.MainMenu.popupHtml.showSubmitTestNumberDailyBonusStreak(function (numberOfDay) {
                LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = numberOfDay;
                btnDailyBonusStreak.textBtn.text = "CDailyBonusStreak\n" + LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS;

            });
        }, LobbyConfig.isTestStrategy);
        that.btnAutoClosePopup = createButtonAutoGoToFreeSpin(1300, 850, "Auto Close PopUp", function () {
            that.isAutoClosingPopupWhenLevelUp = true;
        }, function () {
            that.isAutoClosingPopupWhenLevelUp = false;
        });


        var freeCoinGiftBtn = LobbyC.MainMenu.createTestButton(400, 850, "Free coin gift 1", parentGroup, function () {
            that.manualCollectFreeCoinGift(currentTimeInGameClock, 0, null);
        }, LobbyConfig.isTestStrategy);
        if(Lobby.Utils.objectNotNull(freeCoinGiftBtn)) {
            buttonCoinGift.push(freeCoinGiftBtn.worldPosition);
            freeCoinGiftBtn.visible = false;
        }

        freeCoinGiftBtn = LobbyC.MainMenu.createTestButton(700, 850, "Free coin gift 2", parentGroup, function () {
            that.manualCollectFreeCoinGift(currentTimeInGameClock, 1, null);
        }, LobbyConfig.isTestStrategy);
        if(Lobby.Utils.objectNotNull(freeCoinGiftBtn)) {
            buttonCoinGift.push(freeCoinGiftBtn.worldPosition);
            freeCoinGiftBtn.visible = false;
        }

        freeCoinGiftBtn = LobbyC.MainMenu.createTestButton(1000, 850, "Free coin gift 3", parentGroup, function () {
            that.manualCollectFreeCoinGift(currentTimeInGameClock, 2, null);
            //Manager4DebugTestAlgorithm.callAPIFreeCoinGift(2,
            //    LobbyC.MainMenu.referenceKey,
            //    resultFunc);
        }, LobbyConfig.isTestStrategy);
        if(Lobby.Utils.objectNotNull(freeCoinGiftBtn)) {
            buttonCoinGift.push(freeCoinGiftBtn.worldPosition);
            freeCoinGiftBtn.visible = false;
        }


        var resultFunc = function (numberOfGift) {
            if (numberOfGift > 0) {
                numberOfGift--;
                that.manualCollectFreeCoinGift(currentTimeInGameClock, 2, function (isSuccess) {
                    if(isSuccess){
                        resultFunc(numberOfGift);
                    }
                });
            }
        };
        freeCoinGiftBtn = LobbyC.MainMenu.createTestButton(1300, 850, "Free coin gift 3", parentGroup, function () {
            LobbyC.MainMenu.popupHtml.showSubmitTestFreeCoinGift(resultFunc);
        }, LobbyConfig.isTestStrategy);
        if(Lobby.Utils.objectNotNull(freeCoinGiftBtn)) {
            freeCoinGiftBtn.visible = false;
        }

        freeCoinGiftBtn = LobbyC.MainMenu.createTestButton(1600, 850, "Collect FCG", parentGroup, function () {
            that.manualCollectFreeCoinGift(currentTimeInGameClock, -1, function(){
                if(LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId < 2){
                    LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId+=1;
                }
            });
        }, LobbyConfig.isTestStrategy);
        if(Lobby.Utils.objectNotNull(freeCoinGiftBtn)) {
            freeCoinGiftBtn.visible = false;
        }


        that.buttonAutoFCG = createButtonAutoGoToFreeSpin(1600, 850, "Auto Collect FCG", function () {
            that.autoCollectFCG = true;
        }, function () {
            that.autoCollectFCG = false;
        });
        buttonAutoFCGPosition = {
            x: that.buttonAutoFCG.x,
            y: that.buttonAutoFCG.y
        };

        var btnTurnOnAllOption = LobbyC.MainMenu.createTestButton(400, 750, "TurnOnAllOption", parentGroup, function () {
            that.btnAutoGoBonus.active();
            that.btnAutoPlayBonus.active();
            btnAutoPlayVideo.active();
            autoCollect.achievement.button.active();
            autoCollect.dailyChallenge.button.active();
            autoCollect.dailyStreak.button.active();
            autoCollect.dailySpin.button.active();
            that.buttonAutoFCG.active();
            that.btnAutoClosePopup.active();

        }, LobbyConfig.isTestStrategy);
        btnTurnOnAllOption.alpha = 1;
        btnTurnOnAllOption.tint = 0xff00ff;
        var btnTurnOffAllOption = LobbyC.MainMenu.createTestButton(700, 750, "TurnOffAllOption", parentGroup, function () {
            that.btnAutoGoBonus.deactive();
            that.btnAutoPlayBonus.deactive();
            btnAutoPlayVideo.deactive();
            autoCollect.achievement.button.deactive();
            autoCollect.dailyChallenge.button.deactive();
            autoCollect.dailyStreak.button.deactive();
            autoCollect.dailySpin.button.deactive();
            that.buttonAutoFCG.deactive();
            that.btnAutoClosePopup.deactive();
        }, LobbyConfig.isTestStrategy);
        btnTurnOffAllOption.alpha = 1;
        btnTurnOffAllOption.tint = 0xff00ff;


        var buttonBuyMagicItemInGame = LobbyC.MainMenu.createTestButton(1600, 150, "Test Magic Item", parentGroup, function () {
            LobbyC.MainMenu.showBuyMagicItemPopUp(true);
        }, LobbyConfig.isTestStrategy);
        var increaseCallBack = function(){
            var value = that.speedChangeButton.getValue();
            value += 5*10;
            if(value > 1){
                that.speedChangeButton.setDecreaseButton(true);
            }
            that.speedChangeButton.setValue(value);
            currentTimeInGameClock.modifier = value/10;
        };
        var decreaseCallBack = function(){
            var value = that.speedChangeButton.getValue();
            if(value<=1){
                return;
            }
            value -= 50;
            if(value <= 10){
                that.speedChangeButton.setDecreaseButton(false);
            }
            that.speedChangeButton.setValue(value);

            currentTimeInGameClock.modifier = value/10;

        };
        var clickPanelCallBack = function(){
            LobbyC.MainMenu.popupHtml.showInputTextHTMLPopup(null,null,that.speedChangeButton.getValue()/10,function(value){
                value*=10;
                value = Math.round(value);
                if(value <= 1){
                    that.speedChangeButton.setDecreaseButton(false);
                }else{
                    that.speedChangeButton.setDecreaseButton(true);
                }
                that.speedChangeButton.setValue(value);

                currentTimeInGameClock.modifier = value/10;
            });
        };
        this.speedChangeButton = LobbyC.MainMenu.showIncreaseDecreaseButton(550,75,"Speed",parentGroup,10,10,increaseCallBack,decreaseCallBack,clickPanelCallBack);



        /**
         * Modify the update function of game time clock
         */
        currentTimeInGameClock.updateFunction = function (currentTimeInMs,isCheckCollectFreeCoinGift) {
            that.currentTime = currentTimeInMs;
            if(Lobby.Utils.objectIsNull(isCheckCollectFreeCoinGift)) isCheckCollectFreeCoinGift = true;
            if(isCheckCollectFreeCoinGift) checkAndCollectFreeCoinGift(currentTimeInMs);

            autoCollect.achievement.checkAndCollect(currentTimeInMs);
            autoCollect.dailyChallenge.checkAndCollect(currentTimeInMs);
            autoCollect.dailyStreak.checkAndCollect(currentTimeInMs);
            autoCollect.dailySpin.checkAndCollect(currentTimeInMs);
            LobbyC.MainMenu.lastAutoInfo.saveToCache(that.currentTime,
                that.lastTime,
                {
                    infoLog: LobbyConfig.autoTestInfo,
                    autoCollect: autoCollect.getObjectToStore()
                });
        };

        nextCollectTimeText = initNextCollectTimeText(parentGroup);
        if (LobbyConfig.autoTestLastCollectInfo != null) {
            setNextCollectTimeText(LobbyConfig.autoTestLastCollectInfo.nextCollectTime);
        } else {
            setNextCollectTimeText(0);
        }


        //Duy - Auto collect button
        autoCollect = {
            achievement: {
                name: "Achievement",
                x: 100,
                y: 1000
            },
            dailyChallenge: {
                name: "Daily Challenge",
                x: 400,
                y: 1000
            },
            dailyStreak: {
                name: "Daily Streak",
                x: 700,
                y: 1000
            },
            dailySpin: {
                name: "Daily Spin",
                x: 1000,
                y: 1000
            },
            getObjectToStore: function() {
                return {
                    achievement:{
                        nextCollectTime: autoCollect.achievement.nextCollectTime,
                        firstActive: autoCollect.achievement.firstActive
                    },
                    dailyChallenge:{
                        nextCollectTime: autoCollect.dailyChallenge.nextCollectTime,
                        firstActive: autoCollect.dailyChallenge.firstActive
                    },
                    dailyStreak:{
                        nextCollectTime: autoCollect.dailyStreak.nextCollectTime,
                        firstActive: autoCollect.dailyStreak.firstActive
                    },
                    dailySpin:{
                        nextCollectTime: autoCollect.dailySpin.nextCollectTime,
                        firstActive: autoCollect.dailySpin.firstActive
                    },
                    freeCoinGift: {
                        nextCollectTime: (LobbyConfig.autoTestLastCollectInfo &&
                        LobbyConfig.autoTestLastCollectInfo.nextCollectTime) ? LobbyConfig.autoTestLastCollectInfo.nextCollectTime : 0,
                        nextCoinGiftId: (LobbyConfig.autoTestLastCollectInfo &&
                        LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId) ? LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId : 1
                    }
                }
            }




        };
        var createAutoCollectInfo = function(info, waitingTime, api, collectCallback){
            info.collect = collectCallback;
            info.checkAndCollect = function(ms){
                info.currentTime = ms;
                if(!info.isActive) {
                    return;
                }
                if (info.currentTime >= info.nextCollectTime || info.firstActive) {
                    info.firstActive = false;
                    info.currentTime = ms;
                    info.nextCollectTime = ms + info.waitingTime;
                    info.collect();
                }
            };
            info.currentTime = 0;
            info.waitingTime = waitingTime;
            info.nextCollectTime = waitingTime;
            info.api = api;
            info.isActive = false;
            info.firstActive = true;
            info.button = createButtonAutoGoToFreeSpin(info.x, info.y, "Auto " + info.name, function () {
                info.isActive = true;
                info.checkAndCollect(that.currentTime);
            }, function () {
                info.isActive = false;
            });
            info.animationCoin = function(){
                LobbyC.MainMenu.createCoinAnimation({x: info.x * 0.55, y: info.y * 0.45}, null, null, null, function () {
                }, null);
            }
        };
        createAutoCollectInfo(autoCollect.dailyChallenge, 5 * 60 * 1000, null, function(){
            LobbyRequest.User.getDailyChallengeInfo(function (data) {
                if (data && data.can_collect) {
                    LobbyRequest.User.collectDailyChallenge(function (isSuccess, _data, response) {
                        if (!isSuccess) {
                            return;
                        }
                        autoCollect.dailyChallenge.animationCoin();
                        LobbyC.MainMenu.updateUserInfoFromSV();
                        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.dailyChallengeInfo))
                        {
                            LobbyConfig.autoTestInfo.currentLevelInfo.dailyChallengeInfo = {};
                            LobbyConfig.autoTestInfo.currentLevelInfo.dailyChallengeInfo.array = [];
                        }
                        LobbyConfig.autoTestInfo.currentLevelInfo.dailyChallengeInfo.array.push({
                            coinReward: data.coin_reward,
                            crownReward: data.crown_reward
                        });
                    });
                }
            }, my);
        });
        createAutoCollectInfo(autoCollect.achievement, 60 * 1000, null, function(){
            var callback = function () {
                LobbyRequest.User.getAchievementList(
                    function (data) {
                        if (data == null) return;
                        my._currentAchievementListOfUser = data.member;
                        var achievementList = data.member;
                        var totalCollected = 0;
                        var currentCollected = 0;
                        for (var i = 0; i < achievementList.length; i++) {
                            var achievement = achievementList[i];
                            if (achievement.is_complete && !achievement.is_collected) {
                                totalCollected++;
                                var bonus;
                                if (achievement.crown_reward == 0) {
                                    bonus = achievement.coin_reward + " coins";
                                }
                                else {
                                    bonus = achievement.crown_reward + " crowns";
                                }

                                if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.achievementInfo))
                                {
                                    LobbyConfig.autoTestInfo.currentLevelInfo.achievementInfo = {};
                                    LobbyConfig.autoTestInfo.currentLevelInfo.achievementInfo.array = [];
                                }
                                LobbyConfig.autoTestInfo.currentLevelInfo.achievementInfo.array.push({
                                    id: achievement.achievement_id,
                                    name: achievement.name,
                                    bonus: bonus,
                                    time: Lobby.Utils.getCurrentTimestampAndConvert2String()
                                });

                                var collect = function (i) {
                                    LobbyRequest.User.collectAchievement(
                                        achievement.achievement_id,
                                        function (achievementInfo) {
                                            if (achievementInfo != null) {
                                                autoCollect.achievement.animationCoin();
                                                LobbyC.MainMenu.updateUserInfoFromSV(
                                                    function () {
                                                    },
                                                    function () {
                                                    },
                                                    false // isGetStatisticData
                                                );
                                                currentCollected++;
                                                if (currentCollected >= totalCollected) {
                                                    callback(achievementInfo);
                                                }
                                            }
                                        },
                                        my,
                                        false
                                    );
                                };
                                collect(i);
                                return;
                            }
                        }
                    },
                    my, false);
            };
            callback();
        });
        createAutoCollectInfo(autoCollect.dailyStreak, 24 * 60 * 60 * 1000, LobbyConstant.SIMULATOR_API_TYPE_COLLECT_DAILY_BONUS_STREAK_REWARD, function(){
            if(Lobby.Utils.objectNotNull(LobbyC.MainMenu.lastBonusStreakData)){
                var data = LobbyC.MainMenu.lastBonusStreakData;
                if (Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo)) {
                    LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo = {};
                    LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo.array = [];
                }
                LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo.array.push({
                    coinReward: data.coin_reward,
                    crownReward: data.crown_reward
                });
                LobbyC.MainMenu.lastBonusStreakData = null;
            }else {
                that.manualCollectDailyBonusStreak(function (data) {
                    autoCollect.dailyStreak.animationCoin();
                    btnDailyBonusStreak.textBtn.text = "CDailyBonusStreak\n" + LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS;
                    if (Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo)) {
                        LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo = {};
                        LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo.array = [];
                    }
                    LobbyConfig.autoTestInfo.currentLevelInfo.dailyStreakInfo.array.push({
                        coinReward: data.coin_reward,
                        crownReward: data.crown_reward
                    });
                }, true);
            }
        });
        createAutoCollectInfo(autoCollect.dailySpin, 24 * 60 * 60 * 1000, LobbyConstant.SIMULATOR_API_TYPE_COLLECT_DAILY_BONUS_LUCKY_SPIN_REWARD,  function(){
            that.manualCollectLuckySpinDaily(function (data) {
                autoCollect.dailySpin.animationCoin();
                btnDailyBonusSpin.textBtn.text = "CollectLuckySpinDaily\n" + LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin;
                if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.dailySpinInfo))
                {
                    LobbyConfig.autoTestInfo.currentLevelInfo.dailySpinInfo = {};
                    LobbyConfig.autoTestInfo.currentLevelInfo.dailySpinInfo.array = [];
                }
                LobbyConfig.autoTestInfo.currentLevelInfo.dailySpinInfo.array.push({
                    coinReward: data.coin_reward,
                    crownReward: data.crown_reward
                });
            }, true);
        });

        autoCollect.dailyChallenge.reset = function(){
            var postData = {
                simulatorAPIType: LobbyConstant.SIMULATOR_API_TYPE_RESET_DAILY_CHALLENGE,
                productType: 0
            };
            Manager4DebugTestAlgorithm.callAutoAPIToServer4Test(postData, null, null,function(isSuccess,data,response){
                console.log("Resetting daily challenge at " +  Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true)  );
            });
        };
        //ScheduleManager.setInterval(function(){
        //    that.exportToLog();
        //},10*60*1000);

        LobbyC.MainMenu.createTestButton(1300, 1000, "Export Log", parentGroup, function () {
            that.exportToLog();
        }, LobbyConfig.isTestStrategy);

        createButtonAutoGoToFreeSpin(1600, 1000, "Auto Go Deepblue", function () {
            autoCollect.isAutoDeepBlue = true;
        },function () {
            autoCollect.isAutoDeepBlue = false;
        });
        /**
         * #Thanh
         * Disable auto update clock to avoid conflict with manual collect Free Coin Gift
         * @returns {boolean}
         */
        currentTimeInGameClock.checkCanUpdateClock = function(){
            if(that.autoCollectFCG && currentStreakOnOutOfMoney){
               return false;
            }
            return true;
        };
        //parentGroup.onDestroy.add(onParentGroupDestroy);
    };
    /**
     * #Thanh
     * Init variable from cache, default variable
     */
    this.initVariable = function(){
        if(!that.loadFromCache()){
            //If no cache to load, init variable as it default
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin = 0;
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = 1;
            autoCollect.dailyChallenge.nextCollectTime = 0;
            autoCollect.dailyStreak.nextCollectTime = 0;
            autoCollect.dailySpin.nextCollectTime = 0;
        }
        setBtnDailyBonusSpinNumber(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin);
        that.setBtnDailyBonusStreakNumber(LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS);
    };
    this.loadFromCache = function(){
        if(LobbyC.MainMenu.lastAutoInfo.info){
            LobbyConfig.autoTestInfo = LobbyC.MainMenu.lastAutoInfo.info.infoLog;
            autoCollect.achievement.currentTime = LobbyC.MainMenu.lastAutoInfo.currentTime;
            autoCollect.achievement.nextCollectTime = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.achievement.nextCollectTime;
            autoCollect.achievement.firstActive = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.achievement.firstActive;

            autoCollect.dailyChallenge.currentTime = LobbyC.MainMenu.lastAutoInfo.currentTime;
            autoCollect.dailyChallenge.nextCollectTime = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailyChallenge.nextCollectTime;
            autoCollect.dailyChallenge.firstActive = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailyChallenge.firstActive;

            autoCollect.dailyStreak.currentTime = LobbyC.MainMenu.lastAutoInfo.currentTime;
            autoCollect.dailyStreak.nextCollectTime = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailyStreak.nextCollectTime;
            autoCollect.dailyStreak.firstActive = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailyStreak.firstActive;

            autoCollect.dailySpin.currentTime = LobbyC.MainMenu.lastAutoInfo.currentTime;
            autoCollect.dailySpin.nextCollectTime = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailySpin.nextCollectTime;
            autoCollect.dailySpin.firstActive = LobbyC.MainMenu.lastAutoInfo.info.autoCollect.dailySpin.firstActive;

            LobbyConfig.autoTestLastCollectInfo = initLastCollectInfo(LobbyC.MainMenu.lastAutoInfo.info.autoCollect.freeCoinGift.nextCollectTime,
                LobbyC.MainMenu.lastAutoInfo.info.autoCollect.freeCoinGift.nextCoinGiftId);
            setNextCollectTimeText(LobbyConfig.autoTestLastCollectInfo.nextCollectTime);

            var infoLog = LobbyC.MainMenu.lastAutoInfo.info.infoLog;

            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = 0;
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin = 0;
            if(infoLog.currentLevelInfo){
                handleLogCollectInfo(infoLog.currentLevelInfo);
            }
            if(infoLog.levelInfoArray){
                for(var i = 0; i < infoLog.levelInfoArray.length; i++){
                    handleLogCollectInfo(infoLog.levelInfoArray[i]);
                }
            }

            /**
             * #Thanh
             * So ngay collect tiep theo bang so ngay hien tai +=1
             * @type {number}
             */
            LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS+=1;

            if (LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS > 7) {
                /**
                 * Thanh
                 * Reset daily bonus streak
                 * @type {number}
                 */
                LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS = (LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS - 1) % 7 + 1;
            }
            //LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS
            that.lastTime = LobbyC.MainMenu.lastAutoInfo.lastTime;
            return true; // Load from cache success
        }
        return false; //No cache to load
    };
    /**
     * #Thanh
     * Tang so luong collect hien thi daily bonus streak vaf daily spin len man hinh dung
     * @param tempLevelInfo
     */
    var handleLogCollectInfo = function(tempLevelInfo){
        if(tempLevelInfo.dailyStreakInfo){
            for(var i = 0; i < tempLevelInfo.dailyStreakInfo.array.length; i ++){
                LobbyConfig.SPIN_BY_TESTER_NumOfDayDailyBS++;
            }
        }
        if(tempLevelInfo.dailySpinInfo){
            for(var i = 0; i < tempLevelInfo.dailySpinInfo.array.length; i ++){
                LobbyConfig.SPIN_BY_TESTER_NumOfDayDailySpin++;
            }
        }

    };
    this.destroy = function(){
        this.group.destroy(true);
        onParentGroupDestroy();
        if(currentTimeInGameClock) currentTimeInGameClock.updateFunction = Lobby.Utils.nullFunction;
        currentTimeInGameClock = null;
        arrayFreeCoinGift = null;
        isCollectingFreeCoinGift = false;
        nextCollectTimeText = null;
        buttonCoinGift = [];
        autoCollect = null;
        LobbyC.MainMenu.currentTimeInGameClock.destroy(true);
        LobbyC.MainMenu.currentTimeInGameClock = null;
    };
    /**
     * #Thanh
     * Call when reach new day
     */
    this.onNewDay = function(currentDay){
        console.log("On new day");
        LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId = 0;
        var timeObject = Helper.Time.createTimeObjectDay(currentDay,0,0,0);
        currentTimeInGameClock.startTimeMs =(Helper.Time.timeObjectToMilliSecond(timeObject));
        LobbyConfig.autoTestLastCollectInfo.nextCollectTime = currentTimeInGameClock.getTimeInMs() ;
        autoCollect.dailyStreak.nextCollectTime = currentTimeInGameClock.getTimeInMs() ;
        autoCollect.dailySpin.nextCollectTime = currentTimeInGameClock.getTimeInMs() ;
        //autoCollect.dailyStreak.collect();
        //autoCollect.dailySpin.collect();
        autoCollect.dailyChallenge.reset();
    };
    this.exportToLog = function(){
        if(LobbyC.GameSlot.currentGameId) {
            if (LobbyConfig.autoTestInfo.levelInfoArray) {
                Manager4DebugTestAlgorithm.resetLog();
                for (var currentLevelInfo in LobbyConfig.autoTestInfo.levelInfoArray) {
                    Manager4DebugTestAlgorithm.addDebug2Log(this.getLevelInfoAsString(LobbyConfig.autoTestInfo.levelInfoArray[currentLevelInfo]));
                }
                Manager4DebugTestAlgorithm.printLog();
                Manager4DebugTestAlgorithm.export2LogFile("SimulateReal_" + LobbyC.GameSlot.currentGameId);
            }
        }
    };
    var getPrefixExcelHeaderOf = function(type){
        if(excelHeaderPrefix.hasOwnProperty(type)) return excelHeaderPrefix[type];
        return "";
    };
    this.getEmptyExcelObject = function(){
        var excelObject = {};

        for(var i = 0;i<arrayFreeCoinGift.length;i++){
            excelObject[getPrefixExcelHeaderOf("freeCoinGiftInfo") + excelHeaderPrefix+arrayFreeCoinGift[i].coinReward] = 0;
        }

    };
    this.getLevelInfoAsExcelObject = function(){




    };
    /**
     * #Thanh
     * Print level info
     * @param currentLevelInfo
     */
    this.getLevelInfoAsString = function(currentLevelInfo){
        var resultInfo = [];
        /**
         * Print Collect Free Coin Gift info
         */
        if(currentLevelInfo.freeCoinGiftInfo){
           for(var i = 0; i< currentLevelInfo.freeCoinGiftInfo.arrayCollect.length; i++){
               var str = "Number of collect " + arrayFreeCoinGift[i].coinReward + " is "+ currentLevelInfo.freeCoinGiftInfo.arrayCollect[i] +".\n";
               resultInfo.push(str);
           }
            var str = "Total collected free coin gift:"+ currentLevelInfo.freeCoinGiftInfo.totalCollectInfo  +".\n";
            resultInfo.push(str);
        }
        if(currentLevelInfo.luckySpinInfo){
            var str = "Lucky spin win  :"+ currentLevelInfo.luckySpinInfo.luckySpinArray.join(",") +".\n";
            resultInfo.push(str);
        }
        if(currentLevelInfo.achievementInfo){
            for(var i = 0; i< currentLevelInfo.achievementInfo.array.length; i++) {
                var str = "Collecting achievement (" + currentLevelInfo.achievementInfo.array[i].name + "): " + currentLevelInfo.achievementInfo.array[i].bonus + ".\n";
                resultInfo.push(str);
            }
        }
        if(currentLevelInfo.dailySpinInfo){
            for(var i = 0; i< currentLevelInfo.dailySpinInfo.array.length; i++) {
                var str = "Collecting Daily Spin ( coin: " + currentLevelInfo.dailySpinInfo.array[i].coinReward + ", crown : " + currentLevelInfo.dailySpinInfo.array[i].crownReward + ").\n";
                resultInfo.push(str);
            }
        }
        if(currentLevelInfo.dailyStreakInfo){
            for(var i = 0; i< currentLevelInfo.dailyStreakInfo.array.length; i++) {
                var str = "Collecting Daily Streak ( coin: " + currentLevelInfo.dailyStreakInfo.array[i].coinReward + ", crown : " + currentLevelInfo.dailyStreakInfo.array[i].crownReward + ").\n";
                resultInfo.push(str);
            }
        }
        if(currentLevelInfo.dailyChallengeInfo){
            for(var i = 0; i< currentLevelInfo.dailyChallengeInfo.array.length; i++) {
                var str = "Collecting Daily Challenge ( coin: " + currentLevelInfo.dailyChallengeInfo.array[i].coinReward + ", crown : " + currentLevelInfo.dailyChallengeInfo.array[i].crownReward + ").\n";
                resultInfo.push(str);
            }
        }
        if(currentLevelInfo.videoReward){
            resultInfo.push("Total video coin reward:" + currentLevelInfo.videoReward.totalCoinReward +"\n");
        }
        if(currentLevelInfo.bonusGame){
            resultInfo.push("Total time enter bonus game:" + currentLevelInfo.bonusGame.totalTimeEnterBonus +"\n");
        }
        if(currentLevelInfo.outOfMoney){
            resultInfo.push("Total time of out of money: " + currentLevelInfo.outOfMoney.number +"\n");
        }
        if(currentLevelInfo.numberOfSpin){
            var key =  Object.keys(currentLevelInfo.numberOfSpin);
            key.sort();
            resultInfo.push("Number of spin each type:\n");
            for(var i = 0;i < key.length; i++){
                resultInfo.push(key[i] + ":" + currentLevelInfo.numberOfSpin[key[i]] + "\n");
            }
        }
        return "Level up at: "+ currentLevelInfo.level +"; coin: " + currentLevelInfo.userCoin + "; duration: " +
            Helper.Time.millisecondTimeToStringNormalTime(currentLevelInfo.duration, true) + "; info :\n" + resultInfo.join('');
    };

    /**
     * #Thanh
     * Fire when reach a new game level
     * @param currentGameLevel (game level starting from 1)
     */

    this.onLevelUp = function(currentGameLevel){
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.levelInfoArray)) LobbyConfig.autoTestInfo.levelInfoArray = [];
        LobbyConfig.autoTestInfo.currentLevelInfo.level = currentGameLevel ;
        LobbyConfig.autoTestInfo.currentLevelInfo.userCoin = my._userData.profile.coin;

        LobbyConfig.autoTestInfo.currentLevelInfo.duration = that.currentTime - that.lastTime;
        that.lastTime = that.currentTime;

        LobbyConfig.autoTestInfo.levelInfoArray.push(LobbyConfig.autoTestInfo.currentLevelInfo);
        console.log(that.getLevelInfoAsString(LobbyConfig.autoTestInfo.currentLevelInfo));
        LobbyConfig.autoTestInfo.currentLevelInfo = {};

        if(autoCollect.isAutoDeepBlue && my._userData.profile.level+1 >= LobbyC.MainMenu.getSlotCellByName("deepblue").gameData.min_level &&
            LobbyC.GameSlot && LobbyC.GameSlot.currentGameId != "deepblue"){
            my.time.events.add(100, function(){
                LobbyC.MainMenu.returnToMainMenu(true, function(){
                    setTimeout(function() {
                        LobbyC.MainMenu.showGame("deepblue");
                    }, 100);
                })
            });
        }
    };

    /**
     * #Thanh
     * Event fire when receive lucky spin
     * @param luckySpinInfo
     */

    this.onLuckySpinReceived = function(luckySpinXml){
        var win =  parseFloat(luckySpinXml.getAttribute('win'));
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.luckySpinInfo)) {
            LobbyConfig.autoTestInfo.currentLevelInfo.luckySpinInfo = {};
            LobbyConfig.autoTestInfo.currentLevelInfo.luckySpinInfo.luckySpinArray = [];
        }
        LobbyConfig.autoTestInfo.currentLevelInfo.luckySpinInfo.luckySpinArray.push(Lobby.Utils.formatNumberWithCommas(win));

    };
    /**
     * #Thanh
     * Reset streak out of money when spin success
     */
    this.resetStreakOutOfMoney = function(){
        if(currentStreakOnOutOfMoney) currentStreakOnOutOfMoney = false;
    };
    /**
     * #Thanh
     * Call each time out of money
     */

    this.onOutOfMoney = function () {
        if (!that.autoCollectFCG) {
            return;
        }
        if(!currentStreakOnOutOfMoney){
            currentStreakOnOutOfMoney = true;
            console.log("Out of money streak at " +Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true));
            if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.outOfMoney)) {
                LobbyConfig.autoTestInfo.currentLevelInfo.outOfMoney = {};
                LobbyConfig.autoTestInfo.currentLevelInfo.outOfMoney.number = 0;
            }
            LobbyConfig.autoTestInfo.currentLevelInfo.outOfMoney.number++;
        }
        that.manualCollectFreeCoinGift(currentTimeInGameClock, -1, function (isSuccess) {
            if(isSuccess){
                if(LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId < 2){
                    LobbyConfig.autoTestLastCollectInfo.nextCoinGiftId+=1;
                }
                //console.log("Checking can spin for test!!!");
               if(LobbyC.GameSlot.checkCanSpinForTest()){
                   //console.log("Success, calling!!");
                   that.manualClickAutoSpinButton();
               }else{
                   //console.log("Failed, initing interval");
                   var interval = window.setInterval(function(){
                           //console.log("Checking can spin for test on interval!!!");
                       var canSpin = false;
                           canSpin = LobbyC.GameSlot.checkCanSpinForTest();
                       if(canSpin){
                           //console.log("Success checking, cleaning interval");
                           window.clearInterval(interval);
                           that.manualClickAutoSpinButton();
                       }
                       },
                       1000);
               }
            }
        });
    };
    /**
     * #Thanh
     * On auto view video completed
     */
    this.onRewardedVideoAdCompleted = function(){
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.videoReward)) {
            LobbyConfig.autoTestInfo.currentLevelInfo.videoReward = {};
            LobbyConfig.autoTestInfo.currentLevelInfo.videoReward.totalCoinReward = 0;
        }
        LobbyConfig.autoTestInfo.currentLevelInfo.videoReward.totalCoinReward += 50000;
        console.log("Collecting auto view video at " + Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true) + " success. Received 50,000");

        LobbyC.MainMenu.showInGameNotificationPopUp( LobbyC.MainMenu.selectlanguage.popup_gift_success.text,
            LobbyC.MainMenu.selectlanguage.free_coin.received + " 50,000" + LobbyC.MainMenu.selectlanguage.popup_voucher_description.text2,
            function () {
                LobbyC.MainMenu.createCoinAnimation(btnAutoPlayVideo.worldPosition, null, null, null, function () {
                }, null);
                LobbyC.MainMenu.updateUserInfoFromSV(
                    function () {

                    },
                    function () {
                    },
                    false // isGetStatisticData
                );
            },null,null,true
        );

    };
    /**
     * #Thanh
     * Call each time enter bonus step ( don't include multiple step after)
     */
    this.onEnterBonusStep1 = function(){
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.bonusGame)) {
            LobbyConfig.autoTestInfo.currentLevelInfo.bonusGame = {};
            LobbyConfig.autoTestInfo.currentLevelInfo.bonusGame.totalTimeEnterBonus = 0;
        }
        LobbyConfig.autoTestInfo.currentLevelInfo.bonusGame.totalTimeEnterBonus++;
        console.log("Entering bonus at " +Helper.Time.millisecondTimeToStringNormalTime(currentTimeInGameClock.getTimeInMs(), true));
    };
    /**
     * #Thanh
     * Call when received a spin ( not include free spin)
     * @param aWheels
     * @param aWinPosition
     * @param aTableWin
     * @param iBonus
     * @param aBonusPos
     * @param currentPayLine
     * @param currentBetPerLine
     * @param currentTotalBet
     */
    this.onSpinReceived = function (aWheels, aWinPosition, aTableWin, iBonus, aBonusPos, currentPayLine, currentBetPerLine, currentTotalBet) {
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.numberOfSpin)) {
            LobbyConfig.autoTestInfo.currentLevelInfo.numberOfSpin = {};
        }
        if(Lobby.Utils.objectIsNull(LobbyConfig.autoTestInfo.currentLevelInfo.numberOfSpin[currentTotalBet]))  {
            LobbyConfig.autoTestInfo.currentLevelInfo.numberOfSpin[currentTotalBet] = 0;
        }
        LobbyConfig.autoTestInfo.currentLevelInfo.numberOfSpin[currentTotalBet]++;
    };

}