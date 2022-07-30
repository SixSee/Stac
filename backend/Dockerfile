FROM node:18-alpine
COPY --chown=node:node package.json ./
RUN yarn install
COPY --chown=node:node . .
RUN yarn build
USER node
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
