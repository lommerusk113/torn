FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000

RUN echo "193.71.246.122 grussniffer.asuscomm.com" >> /etc/hosts
CMD ["node", "dist/server.js"]