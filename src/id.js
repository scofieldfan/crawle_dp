/**
 * Created by fanzhang on 17/1/8.
 */


var File = require('./file');
var Crawler = require("crawler");
var data = [];
var map = {};
var idFile = './data/ids.txt';

var listCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            var listUrl = res.request.uri.path.replace('/search/category', '');
            console.log("begin crawle 列表:", listUrl);
            $("#shop-all-list").find('li').each(function (index, a) {
                var detailUrl = $(this).find(".tit").find("a").eq(0).attr("href");
                var name = $(this).find(".tit").find("a").eq(0).attr("title");
                var money = $(this).find(".comment").find("a").eq(1).find("b").text().replace("￥", "");
                console.log('name',name+","+money);
                money = parseInt(money);
                if (money > 80) {
                    var id = detailUrl.replace('http://www.dianping.com/shop/', '').trim();
                    console.log("id ",id);
                    File.appendFile(idFile, id+ "\r\n");

                }

            });

        }
        done();
    }
});
var preUrl = 'http://www.dianping.com/search/category';
function init() {
    for (var city = 1; city < 600; city++)
        for (var page = 0; page < 10; page++) {
            var path = '';
            if (page > 0) {
                path = "/" + city + '/10/p' + (page + 1);
            } else {
                path = "/" + city + '/10/';
            }
            console.log("queue:", path);
            listCrawler.queue(preUrl + path);
        }
}
init();

