/**
 * Created by fanzhang on 17/3/2.
 */

var File = require('./file');
var Crawler = require("crawler");
var dateFormat = require('dateformat');
var cityObj = require('./city');
var citys = cityObj.citys;
var listCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 1000,
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var paths = res.request.uri.pathname.split("/");
            var type  = paths[paths.length-1];
            var fileName = __dirname + `/../data/${type}.csv`;
            var data = JSON.parse(res.body).data;
            console.log("begin crawle...", res.request.uri.path);
            if (data && data.rank && data.rank.list) {
                var list = JSON.parse(data.rank.list);
                var cityArray = cityObj.findCity(data.rank.req.provinceid, data.rank.req.cityid);
                var outputArray = [
                    cityArray[0],
                    cityArray[1],
                    data.rank.req.date
                ]
                if (list) {
                    outputArray = outputArray.concat(list.map((item) => item.dimname));
                }
                File.appendFile(fileName, outputArray.join(",") + "\r\n");
            }
        }
        done();
    }
});
var types = ['dish', 'consumer', 'popular', 'happiness','hot'];
types.forEach((type)=> {
    citys.forEach((item) => {
        for (var d = 0; d < 2; d++) {
            var date = new Date();
            date.setDate(date.getDate() - d);
            var day = dateFormat(date, "yyyy-mm-dd");
            var crawlerUrl = `http://m.dianping.com/datamap/newyearmapapi/food/${type}?date=${day}&provinceid=${item.pId}`;
            listCrawler.queue(crawlerUrl);
            item.cList.forEach((city) => {
                var cId = city.cId;
                var url = `http://m.dianping.com/datamap/newyearmapapi/food/${type}?date=${day}&provinceid=${item.pId}&cityid=${cId}`;
                listCrawler.queue(url);
            })
        }
    });

})


