FROM bitnami/node AS base
ARG build_context

WORKDIR /root

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb
RUN dpkg -i dumb-init_*.deb
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

COPY package.json .
COPY yarn.lock .
COPY ./apps/$build_context/package.json apps/$build_context/
RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install

COPY . .
ENV APP=$build_context
CMD yarn build:$APP && yarn start:$APP