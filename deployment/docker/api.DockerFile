FROM node:18-alpine as build

WORKDIR /opt/app

COPY ./apps/api/package.json ./

RUN yarn install --production

COPY ./apps/api/ ./

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /opt/app

COPY --from=build /opt/app/package*.json /opt/app/
COPY --from=build /opt/app/node_modules/ /opt/app/node_modules/
COPY --from=build /opt/app/dist/ /opt/app/

CMD ["node", "main.js"]