# Development Dockerfile
FROM node:22-alpine

# Install additional tools for development
RUN apk update && apk add --no-cache \
    vim \
    curl \
    wget \
    git

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

COPY . .

# Set the environment variables
ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

# Expose the application port
EXPOSE 4000

# Set the default command to run the application
CMD ["pnpm", "start:dev"]

# Set the environment variables
ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}

# Expose the application port
EXPOSE 3000

# Set the default command to run the application with nodemon
CMD ["npm", "run", "start:dev"]
