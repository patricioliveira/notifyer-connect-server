FROM node:21.5.0-alpine3.19 as base

WORKDIR /usr/src/wpp-server
ENV NODE_ENV=production PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk add wget && \
    apk add --no-cache git

RUN git clone https://github.com/wppconnect-team/wppconnect-server.git /usr/src/wpp-server
WORKDIR /usr/src/wpp-server
RUN yarn install --production --pure-lockfile --ignore-engines && \
    yarn cache clean

FROM base as build
WORKDIR /usr/src/wpp-server
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN yarn install --production=false --pure-lockfile --ignore-engines&& \
    yarn cache clean

RUN yarn build

FROM base
WORKDIR /usr/src/wpp-server/
RUN apk add --no-cache chromium
RUN yarn cache clean
COPY --from=build /usr/src/wpp-server/ /usr/src/wpp-server/
EXPOSE 21465
ENTRYPOINT ["node", "dist/server.js"]