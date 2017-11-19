# crawle_dp
该项目是基于[node_crawler](https://github.com/bda-research/node-crawler)库开发的.采用服务端的jQuery来解析Dom.nodejs来请求HTTP.

## 环境依赖
环境依赖于Linux或者Mac.需要安装node,npm.

## 项目安装
git clone 代码之后,通过npm install 安装成功

## 项目执行
执行start.sh 即可.
注意start_hot.sh 中的路径需要根据实际情况替换.


## 定期执行
在linux 下 可将脚本添加到crontab 里进行定期执行
 #0 8 * * *  sh /root/Fan/crawle_dp/start.sh >> /root/Fan/crawle_dp/crontab.log 2>&1

## 代码说明
* bin 目录下为可能用到的一些脚本.
* start.sh 为启动抓取
* stop.sh 是杀掉进程,退出程序
* trans.sh 将data下的数据从utf-8转码成gbk编码,并且压缩成一个压缩包.excel要求中文文件必须GBK编码.
* data/ids.txt 为提前生成的所有点评商店的Id.
* src/allmenus_plan_two.js 抓取大于80元的饭店的详细数据
* src/city.js 抓取点评大数据需要用到的城市数据
* src/file.js 写文件需要的
* src/id.js 生成所有大于80元饭店的id
* src/hot.js 抓取点评大数据
* src/merlin.js 抓取merlin需要用的
* src/testagent.js 抓取merlin需要用的
* logs 日志目录
* data 为数据输出目录
