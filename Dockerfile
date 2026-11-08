FROM node:22-slim

# Install dependensi sistem, termasuk ca-certificates biar curl nggak error
RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    ffmpeg \
    curl \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies Node.js
RUN npm install

# Copy semua file project
COPY . .

# Expose port (SnapDeploy udah otomatis deteksi port 3000)
EXPOSE 3000

# Jalanin server
CMD ["node", "server.js"]
