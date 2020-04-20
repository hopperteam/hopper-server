FROM node:12 AS builder

EXPOSE 80
COPY src /app/src
COPY dependencies /app/dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
WORKDIR /app
RUN npm install . 
RUN npm run-script build

FROM node:12 AS tester
COPY --from=builder /app /app
COPY test /app/test
WORKDIR /app
RUN node . test/testConfig.json & npm test && kill $!

FROM node:12-alpine AS runner
EXPOSE 80
COPY --from=builder /app/.build /app/.build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install . --production
ENTRYPOINT ["node", ".", "/var/hopper/config.json"]
