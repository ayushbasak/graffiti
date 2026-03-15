# Use an official Node.js runtime as the base image
FROM node:22-slim

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Nest.js application
RUN yarn build

# Expose the port the app runs on (from your env.env)
EXPOSE 5000

# Set the environment to 'env' so it looks for env.env or uses env vars
ENV NODE_ENV=env

# Start the application
CMD ["node", "dist/main"]