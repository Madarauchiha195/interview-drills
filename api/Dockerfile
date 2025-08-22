# Use Node.js LTS Alpine for small image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lock file first
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev && npm cache clean --force

# Copy the rest of the code
COPY . .

# Expose API port
EXPOSE 4000

# Run the server
CMD ["npm", "start"]
