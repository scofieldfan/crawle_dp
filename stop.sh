ps -ef | grep node | grep "crawle_dp" | awk '{print $2}' | xargs kill -9
