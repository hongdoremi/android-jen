/**
 * Created by Phan on 12/16/2016.
 */

module.exports = {
    specialMapDict:{
        /**
         * Special char
         */
        ".":56,
        "@":77,
        "+":157,
        ",":159,
        "/":154,
        "-":69,
        /**
         * Numberic
         */
        0:7,
        1:8,
        2:9,
        3:10,
        4:11,
        5:12,
        6:13,
        7:14,
        8:15,
        9:16
    },
    needShiftMapDict:{
      "_":69
    },
    specialButton:{
        "shiftLeft":59
    },
    mapJsCodeToAndroidCode: function(char){
        if(this.specialMapDict.hasOwnProperty(char)) return this.specialMapDict[char];
        return char.charCodeAt(0)-68;
    }
};