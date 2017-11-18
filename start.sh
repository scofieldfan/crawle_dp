Date=`date +%Y-%m-%d`
echo $Date

nohup node src/allmenus_plan_two.js & >> logs/all.$Date.log
nohup node src/hot.js & >> logs/hot.$Date.log
