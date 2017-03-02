/**
 * Created by nguyendat on 7/28/15.
 */
/**
 * Deprecated
 * @type {Manager4MouseWheelCallback}
 */
var Manager4MouseWheelCallback = new function(){

    var that = this;

    this.MOUSE_WHEEL_CALLBACK_INVITE_POPUP_LEFT = 1;
    this.MOUSE_WHEEL_CALLBACK_INVITE_POPUP_RIGHT = 2;

    this.queueScrollView4WheelCallback = [];

    var currentActiveScrollView = null;

    this.removeScrollViewFromQueue =
        function(mouseWheelId){

            Lobby.Utils.removeAllObjectInArrayWithKey(
                mouseWheelId,
                'mouseWheelId',
                that.queueScrollView4WheelCallback
            );


    };

    this.addScrollView2Queue =
        function(
            scrollView,
            mouseWheelId){

        that.removeScrollViewFromQueue(mouseWheelId);
        scrollView.mouseWheelId = mouseWheelId;
        that.queueScrollView4WheelCallback.push(scrollView);

    };

    this.updateCurrentActiveScrollView =
        function(my){

        var tmpActiveScrollView = null;
        var pos = my.input.activePointer.position;

        for(var i = 0; i < that.queueScrollView4WheelCallback.length; i++){
            var scrollView = that.queueScrollView4WheelCallback[i];

            if(!Lobby.Utils.objectIsNull(scrollView.rectangle)){

                if(pos.x > scrollView.rectangle.left &&
                pos.x < scrollView.rectangle.right &&
                pos.y > scrollView.rectangle.top &&
                pos.y < scrollView.rectangle.bottom){
                    tmpActiveScrollView = scrollView;
                }

            }
        }

        if(tmpActiveScrollView != currentActiveScrollView &&
            tmpActiveScrollView != null){
            currentActiveScrollView = tmpActiveScrollView;

            if(!Lobby.Utils.objectIsNull(currentActiveScrollView.mouseWheelCallback)){

                my.input.mouse.mouseWheelCallback =
                    currentActiveScrollView.mouseWheelCallback;
            }
        }

        //if(currentActiveScrollView != null) {
        //    Lobby.Utils.printConsoleLog("mouse is in view " + currentActiveScrollView.mouseWheelId);
        //}

    };



};