/**
 * Created by fanzhang on 17/3/2.
 */

var File = require('./file');
var Crawler = require("crawler");
var dateFormat = require('dateformat');
var _ = require('lodash');
var cityObj = require('./city');

var today = dateFormat(new Date(), "yyyymmdd");

var citys = cityObj.citys;
var listCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    proxy:'http://111.62.251.70:8088',
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var paths = res.request.uri.pathname.split("/");
            var type = paths[paths.length - 1];
            var fileName = __dirname + `/../data/hot/${type}_${today}.csv`;
            var data = JSON.parse(res.body).data;
            console.log("begin crawle...", res.request.uri.path);
            var cityArray = cityObj.findCity(data.rank.req.provinceid, data.rank.req.cityid);
            var outputArray = [
                cityArray[0],
                cityArray[1],
                data.rank.req.date
            ]
            if (data) {
                var result = [];
                if (type === 'consumer') {
                    result = consumerHandler(outputArray, data);
                } else if (type === 'happiness') {
                    result = happinessHandler(outputArray, data);
                } else {
                    result = commonHandler(outputArray, data);
                }
                File.appendFile(fileName, result.join(",") + "\r\n");
            }
        }
        done();
    }
});
function happinessHandler(outputArray, data) {
    let result = _.clone(outputArray);
    let list = data.map && data.map.list && JSON.parse(data.map.list);
    if (list) {
        result = result.concat(list.map((item) => {
            return item.cityname+","+item.atomvaluet;
        }));
    }
    return result;
}
function consumerHandler(outputArray, data) {
    let result = _.clone(outputArray);
    let list = data.map.list && JSON.parse(data.map.list);
    if (list) {
        result = result.concat(list.map((item) => {
            let str = [];
            if (item.provincename) {
                str.push(item.provincename);
            }
            if (item.cityname) {
                str.push(item.cityname);
            }
            if (item.atomvalue) {
                str.push(item.atomvalue);
            }
            return str.join(",");
        }));
    }
    return result;
}
function commonHandler(outputArray, data) {
    let result = _.clone(outputArray);
    let list = data.rank.list && JSON.parse(data.rank.list);
    if (list) {
        result = result.concat(list.map((item) => {
            return item.dimname;
        }));
    }
    return result;
}
var types = ['dish', 'consumer', 'popular', 'hot','happiness'];
types.forEach((type)=> {
    citys.forEach((item) => {
            var date = new Date();
            var day = dateFormat(date, "yyyy-mm-dd");
            var crawlerUrl = `http://m.dianping.com/datamap/newyearmapapi/food/${type}?date=${day}&provinceid=${item.pId}`;
	    console.log(crawlerUrl);
            listCrawler.queue(crawlerUrl);
            item.cList.forEach((city) => {
                var cId = city.cId;
                var url = `http://m.dianping.com/datamap/newyearmapapi/food/${type}?date=${day}&provinceid=${item.pId}&cityid=${cId}`;
                listCrawler.queue(url);
            })
    });

})
/*
for (var d = 0; d < 2; d++) {
    var date = new Date();
    date.setDate(date.getDate() - d);
    var day = dateFormat(date, "yyyy-mm-dd");
    var crawlerUrl = `http://m.dianping.com/datamap/newyearmapapi/food/happiness?date=${day}`;
    listCrawler.queue(crawlerUrl);
}
*/
