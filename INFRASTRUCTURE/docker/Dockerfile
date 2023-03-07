FROM node:16.14.0-alpine

WORKDIR '/app'

COPY ./package.json ./
RUN npm install

# There is volume mapping in the docker-compose  file
# Leaving the COPY for compatibility reasons at scale
# node_modules is excluded using .dockerignore
COPY . .

CMD ["npm", "run", "start"]