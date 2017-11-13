# STEPS

sudo docker build . -t javimosch/electron-releases
sudo docker stop ers
sudo docker rm ers
sudo docker run --name ers -d -e IP=http://149.202.161.204:8009 -p 8009:8080 -v "$(pwd):/www" javimosch/electron-releases npm start