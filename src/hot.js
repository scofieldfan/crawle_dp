/**
 * Created by fanzhang on 17/3/2.
 */

var File = require('./file');
var Crawler = require("crawler");
var dateFormat = require('dateformat');
var outputFile = __dirname + '/../data/hot.csv';
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
            var data = JSON.parse(res.body).data;
            console.log("begin crawle...",res.request.uri.path);
            if (data && data.rank && data.rank.list) {
                var list = JSON.parse(data.rank.list);
                var cityArray =  cityObj.findCity(data.rank.req.provinceid,data.rank.req.cityid);
                var outputArray =[
                    cityArray[0],
                    cityArray[1],
                    data.rank.req.date
                ]
                if(list){
                    outputArray = outputArray.concat(list.map((item) => item.dimname));
                }
                File.appendFile(outputFile, outputArray.join(",")+"\r\n");
            }
        }
        done();
    }
});
citys.forEach(function (item) {

    for(var d = 0;d<2;d++){
        var date = new Date();
        date.setDate(date.getDate() - d);
        var day = dateFormat(date, "yyyy-mm-dd");
        var hot = `http://m.dianping.com/datamap/newyearmapapi/food/hot?date=${day}&provinceid=${item.pId}`;
        listCrawler.queue(hot);
        item.cList.forEach(function(city){
            var cId = city.cId;
            var url = `http://m.dianping.com/datamap/newyearmapapi/food/hot?date=${day}&provinceid=${item.pId}&cityid=${cId}`;
            listCrawler.queue(url);
        })
    }
});

