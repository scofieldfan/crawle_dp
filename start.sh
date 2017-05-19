Date=`date +%Y-%m-%d`
echo $Date

nohup node src/allmenus.js & >> logs/all.$Date.log
nohup node src/hot.js & >> logs/hot.$Date.log
