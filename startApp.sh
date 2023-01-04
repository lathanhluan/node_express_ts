sudo killall -9 node
cd /home/ec2-user
npm install
nohup npm run start > /dev/null 2>&1 &