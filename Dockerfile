FROM nginx:alpine

# Copy site files into nginx html folder
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
