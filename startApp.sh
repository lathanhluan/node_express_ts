killall -9 node
cd /home/ec2-user
npm install
npm run build
nohup npm run start &