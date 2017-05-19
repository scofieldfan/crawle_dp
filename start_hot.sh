Date=`date +%Y-%m-%d`
echo $Date
nohup /root/.nvm/versions/node/v6.6.0/bin/node ~/Fan/crawle_dp/src/hot.js  >>  ~/Fan/crawle_dp/logs/hot.$Date.log  2>&1 &
nohup /root/.nvm/versions/node/v6.6.0/bin/node ~/Fan/crawle_dp/src/allmenus_plan_two.js  >>  ~/Fan/crawle_dp/logs/all.$Date.log  2>&1 &
