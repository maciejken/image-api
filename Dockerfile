FROM node:14.15.5

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_ENV=development
ENV PORT=80
# ENV SEQUELIZE_USERNAME=''
# ENV SEQUELIZE_PASSWORD=''
# ENV SEQUELIZE_HOST=localhost
# ENV SEQUELIZE_PORT=5432
ENV PATH_TO_UPLOADS=/app/uploads
ENV PATH_TO_THUMBNAILS=$PATH_TO_UPLOADS/thumbnails
ENV SEQUELIZE_DIALECT=sqlite
ENV SEQUELIZE_STORAGE=$PATH_TO_UPLOADS/images.sqlite
ENV SEQUELIZE_DATABASE=images_qa
ENV SEQUELIZE_LOGGING=
ENV ID_TOKEN_VALIDITY_SECONDS=900
ENV ACCESS_CONTROL_ALLOW_ORIGIN=http://localhost:8000
ENV IMAGE_UPLOAD_FIELD_NAME=imageUpload
ENV ADMIN_GROUP_ID=1
ENV API_PREFIX=/api
ENV RATE_LIMIT_WINDOW_MS=900
ENV RATE_LIMIT_MAX=3

# install node-gyp dependencies
RUN apt install python make gcc g++
# install libvips dependencies
RUN apt install build-essential pkg-config glib2.0-dev libexpat1-dev
# add app
COPY . ./
RUN npm install --silent

RUN mkdir uploads
RUN mkdir uploads/thumbnails

# start app
CMD ["npm", "start"]
