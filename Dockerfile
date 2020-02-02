
#Build the page
FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
RUN npm install -g serve
COPY . .
# Build our page
RUN npm run build

# Serve the page
# CMD ["npm", "-s", "build"]
# CMD ["npm", "run", "start"]
FROM nginx
# Copy the build files to nginx's serve folder
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf
# Shouldn't do anything but w/e
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]