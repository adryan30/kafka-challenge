FROM alpine AS base

RUN apk add --no-cache nodejs yarn tini
WORKDIR /root/app
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json .

FROM base AS dependencies
RUN yarn install --prod --silent
RUN cp -R node_modules prod_node_modules
RUN yarn install --silent

FROM dependencies AS test
COPY . .
RUN  yarn build && yarn test

FROM base AS release
COPY --from=dependencies /root/app/node_modules ./node_modules
COPY . .
EXPOSE 3333
CMD yarn build && yarn test