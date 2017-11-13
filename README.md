#BUILD

sudo docker build . -t javimosch/electron-releases

#RUN

sudo docker run -p 8009:8080 javimosch/electron-releases