# Menggunakan image Node.js versi 18 sebagai basis
FROM node:18

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install semua dependencies yang diperlukan
RUN npm install

# Copy semua file sumber lainnya ke dalam container
COPY . .

# Buka port 3000 untuk akses aplikasi
EXPOSE 3000

# Jalankan aplikasi dalam mode production
CMD ["npm", "run", "production"]