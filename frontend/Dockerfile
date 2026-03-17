# --------- Stage 1: Build the React Application ---------
FROM node:22-slim AS builder

WORKDIR /usr/src/app

# Only copy package files to maximize Docker caching
COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of the frontend source
COPY . .

# Build the Vite application for production
RUN npm run build


# --------- Stage 2: Serve using Nginx ---------
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from Stage 1 into Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Replace default Nginx configuration with our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 inside the container
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
