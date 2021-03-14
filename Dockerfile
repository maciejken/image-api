FROM ubuntu

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH=/app/node_modules/.bin:$PATH

# install node-gyp dependencies
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q nodejs npm python make gcc g++
# install libvips dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -q build-essential pkg-config glib2.0-dev libexpat1-dev libjpeg-dev
# add app
COPY . ./
# RUN tar xf vips-8.10.5.tar.gz
# RUN cd vips-8.10.5 && ./configure && make && make install
RUN npm install --quiet

RUN mkdir uploads
RUN mkdir uploads/thumbnails

# start app
CMD ["npm", "start"]
