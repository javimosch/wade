FROM alpine:3.4

# File Author / Maintainer
LABEL authors="Zouhir Chahoud <zouhir@zouhir.org>"

# Update & install required packages
RUN apk add --update nodejs bash git

# Install app dependencies
RUN mkdir /vendor
COPY package.json /vendor/package.json
RUN cd /vendor; npm install

# Copy app source
VOLUME ['/www']

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

ENTRYPOINT ["npm","install"]
