
CREATE DATABASE dianping;

CREATE TABLE `dp_hotels` (
  `shopId` varchar(200) NOT NULL DEFAULT '0',
  `dateStr` varchar(50) NOT NULL DEFAULT '',
  `url` varchar(200) NOT NULL DEFAULT '' ,
  `shopName` varchar(200) NOT NULL DEFAULT '' ,
  `money` varchar(200) NOT NULL DEFAULT '',
  `location`  varchar(200) ,
  `shangquan`  varchar(200),
  `type`  varchar(200),
  `address`  varchar(200),
  `tel`  varchar(200) ,
  `stars`  varchar(200) ,
  `kouweiScore`  varchar(200) ,
  `huanjingScore`  varchar(200) ,
  `fuwuScore`  varchar(200) ,
  `dishTagStr`  varchar(200) ,
  `reviewCountStarS`  varchar(200) ,
  `reviewPercentStarS`  varchar(200) ,
  `cityId`  varchar(200) ,
  `cityCnName`  varchar(200) ,
  `cityName`  varchar(200) ,
  `cityEnName`  varchar(200) ,
  `isOverseasCity`  varchar(200) ,
  `fullName`  varchar(200) ,
  `shopType`  varchar(200) ,
  `mainRegionId`  varchar(200) ,
  `mainCategoryName`  varchar(200) ,
  `categoryURLName`  varchar(200) ,
  `shopGroupId`  varchar(200) ,
  `categoryName`  varchar(200) ,
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`shopId`,`dateStr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

