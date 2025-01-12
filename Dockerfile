FROM node:18-alpine

WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

#start the app
EXPOSE 3000
CMD ["npm", "run", "start:prod"]