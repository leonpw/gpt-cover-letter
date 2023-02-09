# Specify a base image
FROM node:alpine

# Install some dependencies 
COPY ./ ./
RUN npm install

RUN npm run build

# Default command
CMD ["npm", "start"]