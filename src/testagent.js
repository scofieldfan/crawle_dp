/*
 * @Author: fanzhang
 * @Date:   2017-03-19 20:50:42
 * @Last Modified by:   fanzhang
 * @Last Modified time: 2017-03-19 22:26:54
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const loginUrl = 'https://login.ihg.com/forms/iam/login.fcc?TYPE=33554433&REALMOID=06-00004b1c-656d-1514-88a3-2d250aa220dd&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-R1CL9IptyuV3eLny3QDhvxIxVg5zf87SpxkhND3G86XC7he1%2b4a9eGQozQpziWDA&TARGET=-SM-HTTPS%3a%2f%2fdsso%2eihg%2ecom%2fssoredirect%2fredirector%2easp%3fisPxc%3dyes%26ORIG_TARGET%3dHTTPS-%3A-%2F-%2Fme2%2eihgmerlin%2ecom-%2Fweb-%2Fhotel--solutions-%2Fsearch--results-%3FN-%3D8543';
const DELAY = 1000;
const url = 'https://me2.ihgmerlin.com/web/hotel-solutions/search-results?N=8535%2B8586';
const cookie = 'COOKIE_SUPPORT=true; AMCV_8EAD67C25245B1870A490D4C%40AdobeOrg=1256414278%7CMCMID%7C63270593125901489953880832909203384044%7CMCAAMLH-1490532886%7C11%7CMCAAMB-1489928090%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7C2C5F0EAF85488A2E-40000102E0000279; s_fid=4D2C79F6B9EE060F-35461B0EB8C55C4E; IHGBrandMarch2017031920170322=Y; BIGipServerme2.ihgmerlin.com=517476524.36895.0000; ROUTEID=SOMEVALUE.node3; JSESSIONID=23E5AED3BB3B58832EB5CA6DBB312471.node3; GUEST_LANGUAGE_ID=en_US; GuideFilmLaunch20172017032220170327=Y; __utmt=1; s_sq=%5B%5BB%5D%5D; s_cc=true; _gat_UA-70371837-2=1; __utma=194394545.778916306.1489928092.1490251944.1490408216.9; __utmb=194394545.45.9.1490411924922; __utmc=194394545; __utmz=194394545.1490186825.7.5.utmcsr=login.ihg.com|utmccn=(referral)|utmcmd=referral|utmcct=/forms/iam/login.fcc; LFR_SESSION_STATE_7300073=1490412100722; __utmli=idBreadCrumb; SMSESSION=v3OlhbPeGZHJYOQ/RtybfayBnRjFsSYOijNV6Cwnja6dRHHDHcd+1VUHBvpMcv6N8J8SLcNnsdB8L4ANRa8Zr8sy7dqXZ1Wj1gTJKOeJvSUQ449BIB8N8EUZ5Vd8UJmrys+mppGi8BafljkyyRDsWoCVKHd5+4w+FVz7wQAyEFcNgZekmJunJT3Efl6F0M6dOcJVVO7KeJC1YNVtgPlFqCLwNMkwIHCxd//6ff4bHfp4E0umgQsXUULl/RfKUyXVSvlaFuZg3TPVNssQ9IXWgZ12aAWMTxR/1t71Lte8BoGCbImfBXYChk1DWbdq37Cfg/hlHoIxba+YEd7BtA9hThZm0qsNgElGlFhX/M7RdTupaCRk9TBWJQZLC3I46QFYuGvg9735Vi453teILU0zEPuEie79WmLYRblSiRjzrbOWKJOvVhJs6meJv5dxQvtSlmraNY9WbW4PNtWSMzVqAQdNs5kvsnkoArou0nh4bYtEXMOBASKvaeP8+n5WOt29pjV3v2zMiVvnd5E1sDh4rrOcs9fTdXrpEEN+Pj/2KhxON2Eby4ESkf3xEjKzfBTconFltAP/IFO5tXK10OHKKDZkZlwk2YrI7IYdoABFZlRq10/i70nNsHnV2YopKCVTaF7XzRYgO589cLDygDnlMI9iloC5F5uOSSYYYiPFgaSZEMjdHcdSP/3zhRaZx1j31TyUm/cBzDyXlHydFWRFLflxH5LFVWkaRQ7DAuzY8FMCg+98u/ibbsIaMVJj95zQVhB2W5LKPWMzjUpdxsELuPhqxglcRtX4bJ2I1VWb6wghOeYINJCWCYTSBJ+IDeMNweYVI1qUM7bKAezj5O41mU/VltsYK/1Z3iKIOmW5KwegDk+P+set6hu9wKNZ1w7Rn5h8/vlsVpCvCtFfCPE/S5FUpWiNfF4ncUR9g7GCQjbjla6mEVsYw3IALYBFV2TOFvjM7Hs9J+W0X3/R33PZLrQbP3toucz1R4sBRGM0X+XvHM7e1lYOjXQ1qswbzdWB3R7FIROma9e60q26NPkZjHtKStlQfkYaIqf3pv0rBjuDC123k3S9aXaUh0rj+zfqZJBDwjEFuwmcV595i2wDIykp2ZdxorxRtgDmXW5FN4vtj2Di8CGR058GP8JDiAl7wl9V8OYONhfvF3rCZcbyO1167GaoC5DreW87Jq55LFagdzDdLR61DVHDqkpaNh/WbeKpfC1kkErVFX/BPW+acbdNT1bNi+H0pUZF4psOVap+UxHEQxsm/GfXx0JJoDMYdy4ltMqeeQiB1i6kx4OOfCNRxFwkWUatzmMcxRl87cpqMT4vO/QQ5jCFlcLMumzU; ak_bmsc=DA4EB4D8553EB9C330B2F03F3A1E8BD27DFCE01435100000F6D2D558E931C75E~pl8jrMZb/uV16Wx400gkG2tR8TixXuAW69Xs8AgUUib0OmsaCErY8Y/KHwr2cJgRjHFYbO49GIsh+FYKMsuAKPT9kjOunrc9AYHGwNYnRwdPj1wjrVFJNTS1Cc7bCLM1siU1yWAuPnnCN2Zo/bcqGm54K4TOnjRXpBWqkotseAZ8RzC0onTNs+i3bykwPJ/tTEe/pnXUDq3EhWEdrQ4V5a+w==; LogOutCookie=/web/merlin/home; _ga=GA1.3.778916306.1489928092'
const auth = {
    USER: 'zengki',
    PASSWORD: 'zyz@120813',
    DOMAIN: 'APAC',
    target: 'https: //dsso.ihg.com/ssoredirect/pwdexpirychk.asp?ORIG_TARGET=https%3A%2F%2Fme2.ihgmerlin.com%2Fweb%2Fmerlin%2Fhome',
    smquerydata: '',
    smauthreason: 0,
    smagentname: 'dssoagent',
    postpreservationdata: '',
    DOMAINPATH: 'corp.local'
};
const mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'crawler'
});
function login() {
    superagent
    .post(loginUrl)
    .type('form')
    .send(auth)
    .redirects(15)
    .end(function (err, sres) {
        var rawCookies = sres.headers['set-cookie'];
        console.log(sres.text);
    });
}
function delay(interval) {
    return new Promise(function (resolve) {
        setTimeout(resolve, interval);
    });
}
function downloadFile(id, url) {
    console.log('downloading file begin ',url);
    const preFix = 'https://me2.ihgmerlin.com';
    const matchs = url.match(/([^\/]+)/g)
    if (matchs && matchs.length === 5) {
        const fileName = matchs[3].replace(/\+/g, ' ');
        const path = './data/pdf/' + fileName;
        if (!fs.existsSync(path)) {
            const stream = fs.createWriteStream(path);
            const req = superagent.post(preFix + url).set('Cookie', cookie).timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
                deadline: 60000, // but allow 1 minute for the file to finish loading.
            });
            req.pipe(stream);
        }
    }
    console.log('downloading file end');
}
const RESPONSE_TIME = 60000;
function listCrawler(crawlerUrl, currentPageNo) {
    let cUrl = crawlerUrl;
    if (currentPageNo >= 2) {
        cUrl = cUrl + "&No=" + (currentPageNo - 1) * 10
    }
    console.log("url:", cUrl);
    superagent.post(cUrl)
    .set('Cookie', cookie)
    .timeout({
        response: RESPONSE_TIME,  // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .end(function (err, sres) {
        console.log('end..');
        if (!sres || !sres.text) {
            console.log('list failed....:',cUrl);
            return;
        }
        console.log('list ok....:',cUrl);
        const $ = cheerio.load(sres.text);
        let resultNum = $("#total_results_count").attr('value');
        let pageSum = Math.ceil(resultNum / 10);
        let type = $("#idBreadCrumb").children("span").text();
        $(".browse_result").each(function (index, a) {
            let content = $(this).find('.result_title').find('a').attr('href');
            let matchs = content.match(/'(.+)+'/);
            if (matchs && matchs[0]) {
                let id = matchs[0].replace(/\'/g, '');
                console.log(id);
                delay(DELAY).then(() => detailCrawler(type, id));
            }
        });
        /*
        if (currentPageNo < pageSum) {
            delay(DELAY).then(() => listCrawler(crawlerUrl, currentPageNo + 1));//抓取下一页
        }
        */
    })
}

function detailCrawler(type, id) {

    let crawlerUrl = 'https://me2.ihgmerlin.com/web/hotel-solutions/solution-detail?solution-uuid=' + id;
    superagent.post(crawlerUrl)
    .set('Cookie', cookie)
    .timeout({
        response: RESPONSE_TIME,  // Wait 5 seconds for the server to start sending,
        deadline: 60000, // but allow 1 minute for the file to finish loading.
    })
    .end(function (err, sres) {
        if (!sres || !sres.text) {
            console.log('detail failed....:',id);
            return;
        }
        console.log('detail ok....:',id);
        const $ = cheerio.load(sres.text);
        const rawTitle = $('.detail_page_title').html();
        let title = '';
        if (rawTitle) {
            title = rawTitle.replace(/<(.+)>/g, "").trim();
        }
        const summary = $('#summary').text();
        const howToUse = $('#how_to_use').text();
        const resource = $('#resources').text();
        const caseStudy = $('#case_study').text();
        const attachFileUrl = $('.access_button').attr('href') || "";
        if (attachFileUrl && attachFileUrl.indexOf('documents') >= 0) {
            console.log('attachFile:', attachFileUrl);
            downloadFile(id, attachFileUrl);
        }
        let data = {
            innerId: id,
            type: type,
            title: title,
            summary: summary,
            howToUse: howToUse,
            resources: resource,
            caseStudy: caseStudy,
            attachFile: attachFileUrl
        }
        //console.log(data);
        var query = pool.query('REPLACE INTO merlin SET ?', data, function (error, results, fields) {
            if (error) throw error;
            // Neat!
        });
    })
}
const crawler_Map = {
    8533:80,
    8534:80,
    8535:26,
    8536:36,
    8537:15,
    8538:28,
    8741:4,
    8539:5,
    8541:21,
    8542:10,
    8543:15,
    8544:19,
    8545:9
};
for( let key in crawler_Map){
    console.log(key);
    let pages = crawler_Map[key];
    for(var i = 1 ;i<= pages; i++){
        listCrawler('https://me2.ihgmerlin.com/web/hotel-solutions/search-results?N='+key, i);
    }
}

