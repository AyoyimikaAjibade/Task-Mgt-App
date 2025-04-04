# Use official Node.js image as the base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci||  upn install

# Copy the rest of the backend source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the application port (adjust if different)
EXPOSE 3001

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
