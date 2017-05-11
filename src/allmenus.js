/**
 * Created by fanzhang on 17/1/8.
 */


var File = require('./file');
var Crawler = require("crawler");

const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'sanqi888',
    database: 'dianping'
});

function getDate() {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

var detailCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    callback: function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            if ($) {
                var url = res.request.uri.path;
                var window = {};
                var script = eval($("script").eq(5).html());
                console.log(window.shop_config);
                if (!window.shop_config) {
                    return;
                }
                var money = $("#avgPriceTitle").text().replace("￥", "").replace('人均：', '').replace('元', '');
                var bread1 = $(".breadcrumb").find("a").eq(0).text().replace(/\n/g, '').trim();
                ;
                var bread2 = $(".breadcrumb").find("a").eq(1).text().replace(/\n/g, '').trim();
                ;
                var bread3 = $(".breadcrumb").find("a").eq(2).text().replace(/\n/g, '').trim();
                ;
                var bread4 = $(".breadcrumb").find("a").eq(3).text();
                var bread5 = $(".breadcrumb").find("a").eq(4).text();
                var stars = $("#basic-info").find(".brief-info").find("span").eq(0).attr("title");
                var address = $(".expand-info").eq(0).find(".item").text()
                var tel = $(".expand-info").eq(1).find(".item").eq(0).text()
                var tel2 = $(".expand-info").eq(1).find(".item").eq(1).text()

                var kouweiScore = $("#comment_score").find(".item").eq(0).text().replace("口味：", "").trim();
                var huanjingScore = $("#comment_score").find(".item").eq(1).text().replace("环境：", "").trim();
                var fuwuScore = $("#comment_score").find(".item").eq(2).text().replace("服务：", "").trim();

                var object = {
                    shopId: window.shop_config['shopId'],
                    url: url,
                    dateStr: getDate(),
                    shopName: window.shop_config['shopName'],
                    money: money,
                    location: bread1.replace(/\n/g, '').trim(),
                    shangquan: bread2.replace(/\n/g, '').trim(),
                    type: bread3.replace(/\n/g, '').trim(),
                    tel: tel + " " + tel2,
                    stars: stars,
                    kouweiScore: kouweiScore,
                    huanjingScore: huanjingScore,
                    fuwuScore: fuwuScore,
                    cityId: window.shop_config['cityId'],
                    cityCnName: window.shop_config['cityCnName'],
                    cityName: window.shop_config['cityName'],
                    cityEnName: window.shop_config['cityEnName'],
                    isOverseasCity: window.shop_config['isOverseasCity'],
                    fullName: window.shop_config['fullName'],
                    shopType: window.shop_config['shopType'],
                    mainRegionId: window.shop_config['mainRegionId'],
                    mainCategoryName: window.shop_config['mainCategoryName'],
                    categoryURLName: window.shop_config['categoryURLName'],
                    shopGroupId: window.shop_config['shopGroupId'],
                    categoryName: window.shop_config['categoryName']
                };
                //object = Object.assign(object, window.shop_config);

                /*
                 var output = [];
                 output.push(object["shopId"]);
                 output.push(object["url"]);
                 output.push(object["shopName"]);
                 output.push(object["money"]);
                 output.push(object["location"]);
                 output.push(object["shangquan"]);
                 output.push(object["type"]);
                 output.push(object["address"]);
                 output.push(object["tel"]);
                 output.push(object["stars"]);
                 output.push(object["kouweiScore"]);
                 output.push(object["huanjingScore"]);
                 output.push(object["fuwuScore"]);
                 */
                console.log("beigin crawle 详情 url:", object["dir"], url);
                console.log("...........");

                /*
                 var query = pool.query('REPLACE INTO  dp_hotels SET ?', object, function (error, results, fields) {
                 if (error) throw error;
                 // Neat!
                 console.log('ok..........');
                 });
                 console.log(query);
                 */

                pool.getConnection(function (err, connection) {
                        if (err) throw err;
                    // pool the connections
                    console.log('get connection.');
                    connection.query('REPLACE INTO  dp_hotels SET ?', object, function (error, results, fields) {
                        // And done with the connection.
                        connection.release();
                        console.log('ok realease..........');
                        // Handle error after the release.
                        done();//request 完成。。。。。
                        if (error) throw error;

                        // Don't use the connection here, it has been returned to the pool.
                    });
                });
                //File.appendFile(ouputFile, output.join(",") + "\r\n");
            }
        }
    }
});
setInterval(function(){
	console.log('list queue size:',listCrawler.queueSize);
	console.log('detail queue size:',detailCrawler.queueSize);
	if(listCrawler.queueSize == 0 && detailCrawler.queueSize ==  0){
		detailCrawler.on('drain', function () {
		    // For example, release a connection to database.
		    console.log('ondrain......');
		    pool.end(function (err) {
			// all connections in the pool have ended
		    });
		});
        	} 
	},10000);
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
                money = parseInt(money);
                if (money > 80) {
                    var id = detailUrl.replace('/shop/', '').trim();
                    //怎么感觉重复抓取的问题?
                    detailCrawler.queue("http://www.dianping.com" + detailUrl);
                }

            });

        }
        done();
    }
});
var preUrl = 'http://www.dianping.com/search/category';
function init() {
    for (var city = 100; city < 600; city++)
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
//detailCrawler.queue('http://www.dianping.com/shop/6429674');
