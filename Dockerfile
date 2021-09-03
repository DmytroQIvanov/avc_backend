FROM node:latest
WORKDIR /avc-backend
COPY package.json package-lock.json /
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]