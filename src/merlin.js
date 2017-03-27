/**
 * Created by fanzhang on 17/1/8.
 */


var File = require('./file');
var Crawler = require("crawler");
/*
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


            }
        }
        done();
    }
});
*/
var listCrawler = new Crawler({
    maxConnections: 1,
    rateLimit: 2000,
    headers:{
        Cookie:'COOKIE_SUPPORT=true; ROUTEID=SOMEVALUE.node4; BIGipServerme2.ihgmerlin.com=517476524.36895.0000; AMCV_8EAD67C25245B1870A490D4C%40AdobeOrg=1256414278%7CMCMID%7C63270593125901489953880832909203384044%7CMCAAMLH-1490532886%7C11%7CMCAAMB-1489928090%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7C2C5F0EAF85488A2E-40000102E0000279; s_fid=4D2C79F6B9EE060F-35461B0EB8C55C4E; s_sq=%5B%5BB%5D%5D; JSESSIONID=7293B8C33B892F59F070E2C167369628.node4; GUEST_LANGUAGE_ID=en_US; SMSESSION=EZqawVcCw+HacV3UIB+P9Sj+FB9vWx13ttpbIkN4PRrEZVKV3I6CofZMg4S7NKjFvMOGSwEitLrezvfE5I6nRz4xVoklxhpWtEyBXggyZTVTKDn97y4Z31z8OZiJfCbTPK8wIzPSjS7VEgWH/9LlHUxmr+nvxe2O/QBolfZ4ZEK1NP4QMZ6IDYGzYm3FYAOAaGTbVUhYVYqFXmwi7takyWGeKXF8AklCYPMbe2kT/xHcCjxTSxiI8BEOhBM7bKBfnYnyMXUbsc6ic6NodjYPVHdEIRwlJZZN/sVjDiJeVWp+spt+zzIvkXVeA5biSuXDRgTvdOxaTq8OAiFhho/rcr4OK3PA68otKshAkrYFyjLKTZ71iOr9magBZgX9Hq1ueXdmu985cy4U1qfKqwibVdRSgo1abpOPYy+6ZZgTmj48MVtFOsThUrl+f/hySDMEUH71VHQlja/Z5hnK9U4sQOJ+XJf1iJxh1pmr2jBriu6anLINnSa3XcdBvCH340+m/lvtcjaEUbiSqlXrsXqSOd2oYyB3cqlLN9eCgMLyXYuv8VXwn7wU2wtk6m8w7y7mox7i7ryuatn6LuNdq91lu43wfrIeP603Vlm7y0mO/1v8H+lv4vl9e5fko+TTLoqBS091G85Lnm1v+vkwQV3yIX8nvoC90cFzqJ9KamTsYGUqYbhrXRu9a3MY6KzGiO1Fh7tk1Jlg2fjL9LBT/FRAoGrYBXzSL3+GiIG71r0aOMWsJWE+PmtWVwylsDq+wMlGC3s+HqVt9biUUNTwsVWT9raUL0kCY43Y6wIpEqObEsSZNptxTseTVVoGRr5c71kagHT0YZNLQV7TGOjW1gFStEBYJvgcjvpzeEMjxNXirEeqxOx9TEOQo7Zt1IFqQh+tmr9hKDZs6WP0hvOVJ+immiEBEQdW1fhvV6cDzlAD+Pczh+cu8VVL5n3qmxK1HupuHDnh7wEEZCMyzXHWOmN44BV+HD90YcG2kfSaqgEm4JoA01IfTHkwszoFjXqW9aEdZ4aBkX4vjLW1wdRfk/CL3Jcl8RBpfIPSgayBcjU0ImNMkKnPTQosLg0QY46sN2hlFdOOBA0zTix/qx/FQqZvg3vrw1Htb9LGPJCBjs81EoH+UxVP0v00IojBbuePDiECwmLDzbavJ97lDdrnXznXqFDh4LPxgKCzBIni2IbEOfyBcCzjcZDrAEGBWOTrc0+LX1M/QiX1V0QwH9u5aApRIBtP3WzBMlG2o6D1G4lI/6z2WjOVmeqX/V771g8Nd0u1A0kd4aBc7ymrlUQ1CSFJnXp6jqxCWjs+YUWV3ZL8awNEfnkVzsmUkjkSobsL7W4v; _ga=GA1.3.778916306.1489928092; _gat_UA-70371837-2=1; __utmt=1; LogOutCookie=/web/hotel-solutions/home; s_cc=true; ak_bmsc=70B46041FB9BB235D0B2CFA6A28CA06B7DFCE020C71C0000927FCE5840CA0B06~plIBQXGg+YbDoQlADYNNZopK53KNl3mqSEMNqmxW1yoPGQQOnZHOM3KWtj4HXHzbtBsAQ3PfpJia1Q1vhJkrSBlbr/WFYIJWOwjWGX+n1/Yr57hdSmQqboMq2SX2qE2FTULaPO7N6CaHwvrkOTCbh/DYjVl/W+a/g8oO+63P7q/gqhaMkomu1JUKWnTRpIAsNhyl+UaL00cN7eF47FZhBVdg==; __utma=194394545.778916306.1489928092.1489928092.1489928092.1; __utmb=194394545.11.10.1489928092; __utmc=194394545; __utmz=194394545.1489928092.1.1.utmcsr=login.ihg.com|utmccn=(referral)|utmcmd=referral|utmcct=/forms/iam/login.fcc; SMCHALLENGE=NTC_CHALLENGE_DONE; LFR_SESSION_STATE_7300073=1489932042794',
    },
    userAgent: 'Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13',
    callback: function (error, res, done) {
        console.log("callback....");
        if (error) {
            console.error(error);
        } else {
            var $ = res.$;
            console.log(res.body);
        }
        done();
    }
});

var url = 'https://me2.ihgmerlin.com/web/hotel-solutions/search-results?N=8535%2B8586';
console.log("...........");
listCrawler.queue(url);
//listCrawler.queue('https://www.baidu.com');
