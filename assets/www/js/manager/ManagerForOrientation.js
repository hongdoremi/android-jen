/**
 * Created by Phan on 7/8/2016.
 */
var ManagerForOrientation = new function () {
  var that = this;
  var shouldChangeOrientationNextTime = false;

  this.previousOrientation = 'landscape-secondary';
  /**
   * Use to fix orientation problem occur when select image in portrait mode
   */
  document.addEventListener("orientationchange", function(event){
    switch(window.orientation) {
      case -90:{

        that.previousOrientation = screen.orientation;
        break;
      }
      case 90:
      {
        shouldChangeOrientationNextTime = true;
        break;
      }
      default:
      {
        if(Lobby.Utils.isIOS()
        //&&
        //  shouldChangeOrientationNextTime === false
        ) {
          //document.documentElement.style.display = 'none';
        }
        shouldChangeOrientationNextTime = true;
        //that.forcePortraitMode();


      }
    }});




  this.forcePortraitMode = function(){

    var orientationBegin = 'portrait';
    screen.lockOrientation(orientationBegin);
    //shouldChangeOrientationNextTime = true;
  };

  this.forceLandscapeMode = function(){

    var orientationBegin = 'landscape-primary';
    if (screen.orientation == 'landscape-secondary') {
      orientationBegin = 'landscape-secondary';
    }
    orientationBegin = 'portrait';
    screen.lockOrientation(orientationBegin);
    shouldChangeOrientationNextTime = true;
  };

  /**
   * flip orientation if game switch to portrait mode unexpectedly
   * @param isUser4Ipad
   * @param isLongTimeDelay
   * @param my
   */
  this.resetOrientation = function (isUser4Ipad, isLongTimeDelay,my) {
    //handle orient station
//          screen.lockOrientation('landscape');
//          window.currentOrientation = screen.orientation;
//          alert(window.currentOrientation);

    /* Device is in portrait mode */
    if (!Lobby.Utils.isIOS()
          //|| (isUser4Ipad == false && Lobby.Utils.isIpad())
        || !shouldChangeOrientationNextTime
    ) {
      shouldChangeOrientationNextTime = false;
      document.documentElement.style.display = 'block';
      return;
    }
    document.documentElement.style.display = 'none';
    var orientationBegin = that.previousOrientation;//'landscape-secondary';
    //var orienttationNext = 'landscape-secondary';//'portrait';
    //if (orientationBegin === 'landscape-secondary') {
    //  orienttationNext = 'landscape-primary';
    //}

    var timeOrientationDelay1 = 1000;
    //var timeOrientationDelay2 = 1100;
    //if(isLongTimeDelay === true){
    //timeOrientationDelay1 = 100;
    //timeOrientationDelay2 = 2000;
    //}

    //if(Lobby.Utils.objectIsNull(my)){

//return;
    screen.lockOrientation("portrait");
    window.setTimeout(
        function() {;
          screen.lockOrientation(orientationBegin);
          //screen.lockOrientation("portrait");
          //screen.lockOrientation(orientationBegin);
          //window.setTimeout(
          //    function () {
          //      window.setTimeout(
          //          function () {
          //            screen.lockOrientation(orienttationNext);
          //            window.setTimeout(
          //  function () {
          //screen.lockOrientation(orientationBegin);
          //window.setTimeout(
          //  function () {
          shouldChangeOrientationNextTime = false;
          document.documentElement.style.display = 'block';
          //}, 500);
          //}, 100);
          //}, timeOrientationDelay1);
          //}, timeOrientationDelay1);
          //}, timeOrientationDelay1);
        },timeOrientationDelay1);

    //window.setTimeout(
    //      function(){
    //        screen.lockOrientation(orienttationNext);
    //        window.setTimeout(
    //            function () {
    //              screen.lockOrientation(orientationBegin);
    //              window.setTimeout(
    //                  function () {
    //                    shouldChangeOrientationNextTime = false;
    //                    document.getElementById('bodyTag').style.display = 'block';
    //                  }, 100);
    //            }, timeOrientationDelay2);
    //
    //      },timeOrientationDelay1);

    //}else{
    //
    //  my.time.events.add(
    //      timeOrientationDelay1,
    //      function(){
    //        screen.lockOrientation(orienttationNext);
    //        my.time.events.add(
    //            timeOrientationDelay2,
    //            function () {
    //              screen.lockOrientation(orientationBegin);
    //              my.time.events.add(
    //                  100,
    //                  function () {
    //                    shouldChangeOrientationNextTime = false;
    //                    document.getElementById('bodyTag').style.display = 'block';
    //                  }, this);
    //            }, this);
    //
    //      },this);
    //}




    //my.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //my.game.scale.setShowAll();
    //window.addEventListener('resize', function () {
    //  my.game.scale.refresh();});
    //my.game.scale.refresh();

//              }
//            }
//          });
  };

};
