FROM node:22-slim

# Install python3, pip, ffmpeg, ca-certificates, dan unzip (buat Deno)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Deno (JavaScript Runtime buat yt-dlp)
RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# Install yt-dlp lewat pip
RUN pip3 install --break-system-packages --pre yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
