/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-07-21 10:47:56
 * @version $Id$
 * 项目公用的方法
 */

var goBack = function () {
    // 返回上一页
    window.history.back();
};

var getQueryString = function () {
    var name, value;
    var str = window.location.href;                     // 取得整个地址栏
    var num = str.indexOf('?');
    str = str.substr(num + 1);                          // 取得所有参数

    var arr = str.split('&');                           // 各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=');
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
};

module.exports = {
    goBack: goBack,
    getQueryString: getQueryString
};

