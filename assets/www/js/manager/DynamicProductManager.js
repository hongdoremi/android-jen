/**
 * Created by Phuoc Tran on 7/16/2015.
 */
//"use strict";
var DynamicProductManager = new function () {
    //var ProductF2P;
    var ProductF2P = function () {
        var productAmount = 0;
        var amountBonus = 0;
        var keyBonus = 0;
        var diamondBonus = 0;
        var crownBonus = 0;
    };
    var ProductP2P = function () {
        var productAmount = 0;
        var amountBonus = 0;
        var keyBonus = 0;
        var diamondBonus=0;
        var crownBonus = 0;
    };
    var productionListF2P = [];
    var productionListP2P = [];

    this.init = function (listProductDynamic) {

        if(LobbyConfig.isTestAlgorithmMode){
            return;
        }
        //for (var i = listProductDynamic.length-1; i >=0; i--) {
        for (var i=0;i < listProductDynamic.length; i++) {
            var beanProductDynamic = listProductDynamic[i];
            if (beanProductDynamic.type == 0) {
                var product =new ProductF2P();
                product.productAmount=beanProductDynamic.product_amount;
                product.amountBonus=beanProductDynamic.amount_bonus;
                product.keyBonus=beanProductDynamic.key_bonus;
                product.diamondBonus=beanProductDynamic.diamond_bonus;
                product.crownBonus=beanProductDynamic.crown_bonus;
                productionListF2P.push(product);
                Lobby.Utils.printConsoleLog(product);
                //
                //LobbyUserData.productAmountF2P.push(beanProductDynamic.product_amount);
                //LobbyUserData.amountBonusF2P.push(beanProductDynamic.amount_bonus);
                //LobbyUserData.keyBonusF2P.push(beanProductDynamic.key_bonus);
                //LobbyUserData.diamondBonusF2P.push(beanProductDynamic.diamond_bonus);
            }
            else
            {
                var product =new ProductP2P();
                product.productAmount=beanProductDynamic.product_amount;
                product.amountBonus=beanProductDynamic.amount_bonus;
                product.keyBonus=beanProductDynamic.key_bonus;
                product.diamondBonus=beanProductDynamic.diamond_bonus;
                product.crownBonus=beanProductDynamic.crown_bonus;
                productionListP2P.push(product);
                Lobby.Utils.printConsoleLog(product);

                //LobbyUserData.productAmountP2P.push(beanProductDynamic.product_amount);
                //LobbyUserData.amountBonusP2P.push(beanProductDynamic.amount_bonus);
                //LobbyUserData.keyBonusP2P.push(beanProductDynamic.key_bonus);
                //LobbyUserData.diamondBonusP2P.push(beanProductDynamic.diamond_bonus);
            }

        }
        Lobby.Utils.printConsoleLog(productionListF2P);
        Lobby.Utils.printConsoleLog(productionListP2P);




    };

    this.getProductAmountF2P = function (argument) {
        if(productionListF2P.length <= argument){
            return 0;
        }
        return productionListF2P[argument].productAmount;
    };
    this.getAmountBonusF2P = function (argument) {
        if(productionListF2P.length <= argument){
            return 0;
        }
        return productionListF2P[argument].amountBonus;
    };
    this.getKeyBonusF2P = function (argument) {
        if(productionListF2P.length <= argument){
            return 0;
        }
        return productionListF2P[argument].keyBonus;
    };
    this.getDiamondBonusF2P = function (argument) {
        if(productionListF2P.length <= argument){
            return 0;
        }
        return productionListF2P[argument].diamondBonus;
    };
    this.getCrownBonusF2P = function (argument) {
        if(productionListF2P.length <= argument){
            return 0;
        }
        return productionListF2P[argument].crownBonus;
    };

    this.getProductAmountP2P = function (argument) {
        return productionListP2P[argument].productAmount;
    };
    this.getAmountBonusP2P = function (argument) {
        return productionListP2P[argument].amountBonus;
    };
    this.getKeyBonusP2P = function (argument) {
        return productionListP2P[argument].keyBonus;
    };
    this.getDiamondBonusP2P = function (argument) {
        return productionListP2P[argument].diamondBonus;
    };
    this.getCrownBonusP2P = function (argument) {
        return productionListP2P[argument].crownBonus;
    };

};