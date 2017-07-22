var idFile =  __dirname +'/../data/ids.txt';
var errorids =  __dirname +'/../data/errorids.txt';
var File = require('./file');
var DATETOOL = require('./date');
var Crawler = require("crawler");
const superagent = require('superagent');
require('superagent-proxy')(superagent);
function getInput() {
    return File.readFile(idFile).split('\n');
}

function getDate() {
    return DATETOOL.formateDate();
}

const outputFile =  __dirname +'/../data/all/all-'+getDate()+".csv";
var detailCrawler = new Crawler({
    maxConnections: 5,
    rateLimit: 2000,
    callback: function (error, res, done) {

        console.log("detail crawler...............");
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            if ($) {
                var url = res.request.uri.path;
                var window = {};
                try{
                    //console.log($("script").eq(8).html());
                    for(var numberI = 5 ;numberI<15; numberI++){
			console.log($("script").eq(numberI).html());
                        var scriptHtml = $("script").eq(numberI).html();
			if(scriptHtml && scriptHtml.indexOf("shop_config")>=0){
			  var script = eval(scriptHtml);
			  break;
			}
                    }
                    
                }catch(error){
                    console.log('shop_config:' + window.shop_config);
                }
                console.log('url:' + url);
                console.log(window.shop_config);
                //console.log('shop_config:' +$("script").eq(7).html());
                if (window.shop_config) {
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
                        categoryName: window.shop_config['categoryName'],
                        mainCategoryId: window.shop_config['mainCategoryId'],
                        power: window.shop_config['power']
                    };
                    let allreviewUrl = `http://www.dianping.com/ajax/json/shopDynamic/allReview?shopId=${object.shopId}
                    &cityId=${object.cityId}&categoryURLName=${object.categoryURLName}&power=${object.power}&cityEnName=${object.cityEnName}&shopType=${object.shopType}`;
                    //let reviewUrl =
                    // `http://www.dianping.com/ajax/json/shopDynamic/reviewAndStar?shopId=${object.shopId}&cityId=${object.cityId}&mainCategoryId=${object.mainCategoryId}`;
                    // object = Object.assign(object, window.shop_config);
                    getReviewUrl(allreviewUrl).then((res) => {
                        /*
                        console.log(res.body['dishTagStrList']);
                        console.log(res.body['reviewCountStar1']);
                        console.log(res.body['reviewCountStar2']);
                        console.log(res.body['reviewCountStar3']);
                        console.log(res.body['reviewCountStar4']);
                        console.log(res.body['reviewCountStar5']);
                        */
                        console.log('output.................');
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
                        if(res.body['dishTagStrList']){
                            output.push(res.body['dishTagStrList'].join(" "));
                        }
                        output.push(res.body["reviewCountStar1"]);
                        output.push(res.body["reviewCountStar2"]);
                        output.push(res.body["reviewCountStar3"]);
                        output.push(res.body["reviewCountStar4"]);
                        output.push(res.body["reviewCountStar5"]);
                        if(res.body['summarys']){

                            let summary = res.body['summarys'].map((item)=>{
                                return item.summaryString+"("+item.summaryCount+")";
                            }).join(" ")
                            output.push(summary);
                        }

                        console.log("beigin crawle 详情 url:", object["dir"], url);
                        console.log("...........");
                        console.log(output.join(","));
                        File.appendFile(outputFile, output.join(",") + "\r\n");
                    })


                }else{
                    File.appendFile(errorids, url+ "\r\n");
                }
            }
        }
        done();
    }
});
//var proxy = process.env.http_proxy || 'http://168.63.43.102:3128';
var proxy = 'http://121.248.112.20:3128';
const getReviewUrl = (reviewUrl) => {
    console.log('reviewUrl:',reviewUrl);
    return new Promise((resolve, reject) => {
        superagent
        .get(reviewUrl)
	.proxy(proxy)
        .set({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'User-Agent' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/602.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
		})
        .end(function (err, res) {
            if (err) {
                throw err;
                reject();
            } else {
                resolve(res);
            }
        });

    });
}
let prefix = 'http://www.dianping.com/shop/';
let ids = getInput();
ids.forEach((id) => {
    if (id) {
        let url = prefix + id;
        console.log('begin crawler: ' + url);
        detailCrawler.queue(url);
    }
})
//detailCrawler.queue(prefix +'2998924');











