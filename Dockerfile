FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python-is-python3 ffmpeg curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install packages
COPY package*.json ./
RUN npm ci

# Download the Standalone Linux Binary globally
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp && chmod +x /usr/local/bin/yt-dlp

# Copy our code and build
COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000

# Start server
CMD ["npm", "start"]
