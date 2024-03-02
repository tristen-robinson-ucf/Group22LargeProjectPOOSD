sudo npm install
sudo npm install express --save
sudo npm install body-parser
sudo npm install mongodb
sudo npm install cors
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
npm install react-router-dom
sudo npm install dotenv
echo "MONGODB_URI=mongodb+srv://asher12353:COP4331-19thGroup@cluster0.vwkhdxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" > .env