# Use the official Node.js image as the base
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install - g npm

# Copy the entire project to the working directory
COPY . .

# Build the application
#RUN npm run build --prod

# Expose the desired port
EXPOSE 3000

# Set the command to start the application
CMD [ "npm", "start" ]
