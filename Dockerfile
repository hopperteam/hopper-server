FROM node

EXPOSE 80
COPY out/ /app
WORKDIR /app
RUN npm install . --production

ENTRYPOINT ["node", "."]
