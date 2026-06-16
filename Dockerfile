FROM node:20-slim

# Install system dependencies (FFmpeg for 4K video merging)
RUN apt-get update && apt-get install -y ffmpeg curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install packages
COPY package*.json ./
RUN npm ci

# Download the Standalone Linux Binary directly (No Python needed!)
RUN mkdir -p node_modules/yt-dlp-exec/bin && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o node_modules/yt-dlp-exec/bin/yt-dlp && chmod +x node_modules/yt-dlp-exec/bin/yt-dlp

# Copy our code and build
COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000

# Start server
CMD ["npm", "start"]
