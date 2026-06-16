FROM node:20-slim

# Install python and ffmpeg so yt-dlp works perfectly
RUN apt-get update && apt-get install -y python3 python-is-python3 ffmpeg curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
