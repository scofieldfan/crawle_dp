var idFile =  __dirname +'/../data/ids.txt';
var errorids =  __dirname +'/../data/errorids.txt';
var File = require('./file');
var DATETOOL = require('./date');
var Crawler = require("crawler");
const superagent = require('superagent');
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
    headers: {
        Accept:'text/html,application/xhtml+xml',
        'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
        'Cookie':'_hc.v=f9fb4d55-2e97-af81-4c34-681f72ba2b2e.1480658762; __utma=205923334.1586690983.1494812234.1494812234.1494812234.1; _lxsdk_cuid=15e28434e36c8-08501f21c38d0e-31627c01-fa000-15e28434e37c8; _lxsdk=15e28434e36c8-08501f21c38d0e-31627c01-fa000-15e28434e37c8; aburl=1; cityid=2; PHOENIX_ID=0a48af8e-15fcf85af58-971a64; cye=beijing; _tr.u=ynuWxZKneZ8ZveDJ; cy=2; s_ViewType=10; _lxsdk_s=15fcf8589b7-fb5-d5c-8ab%7C%7C95',
    },
    callback: function (error, res, done) {

        console.log("detail crawler...............");
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            if ($) {
                var url = res.request.uri.path;
                var window = {};
                var navigator = {
                    userAgent:''
                }
                try{
                    console.log('find show_config ......');
                    for(var numberI = 0 ;numberI<20; numberI++){
                        var scriptHtml = $("script").eq(numberI).html();
                        console.log(scriptHtml);
                        if(scriptHtml && scriptHtml.indexOf("shop_config")>0){
                          var index = scriptHtml.indexOf("shop_config");
                          scriptHtml = "window.shop_config="+ scriptHtml.substring(index);
                          var script = eval(scriptHtml);
                          console.log('shop_config ok......');
                          console.log(script);
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
                    //getReviewUrl(allreviewUrl).then((res) => {
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

			/*
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
			*/

                        console.log("beigin crawle 详情 url:", object["dir"], url);
                        console.log("...........");
                        console.log(output.join(","));
                        File.appendFile(outputFile, output.join(",") + "\r\n");
                    //})


                }else{
                    File.appendFile(errorids, url+ "\r\n");
                }
            }
        }
        done();
    }
});
//var proxy = process.env.http_proxy || 'http://168.63.43.102:3128';
var proxy = 'http://111.62.251.27:80';
var header = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
    'Host': 'www.dianping.com',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive'
};

const getReviewUrl = (reviewUrl) => {
    console.log('reviewUrl:',reviewUrl);
    return new Promise((resolve, reject) => {
        superagent
        .get(reviewUrl)
        .set(header)
	.proxy(proxy)
        .end(function (err, res) {
            if (err) {
		console.log(err);
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











