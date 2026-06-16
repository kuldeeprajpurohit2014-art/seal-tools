FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y python3 python-is-python3 ffmpeg curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install packages
COPY package*.json ./
RUN npm ci

# Zabardasti yt-dlp binary ko download karke sahi jagah rakhna
RUN mkdir -p node_modules/yt-dlp-exec/bin && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o node_modules/yt-dlp-exec/bin/yt-dlp && chmod +x node_modules/yt-dlp-exec/bin/yt-dlp

# Copy our code and build
COPY . .
RUN npm run build

EXPOSE 3000

# Start server
CMD ["npm", "start"]
