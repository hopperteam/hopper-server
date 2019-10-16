FROM node

COPY out/ /app
RUN cd /app && npm install . --production

CMD cd /app && node .
