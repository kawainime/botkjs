# BotKJS Dashboard

BotKJS Dashboard adalah aplikasi berbasis **Node.js + Express + Nginx** yang digunakan untuk menjalankan dashboard modern untuk kontrol bot, generate data KPJ, monitoring hasil, pengelolaan credential, serta pengaturan koneksi VPS.

Project ini dirancang agar mudah dijalankan di **VPS Ubuntu** dengan struktur sederhana:
- **Frontend**: `index.html`
- **Backend**: `server.js`
- **Service manager**: `systemd`
- **Reverse proxy**: `Nginx`

---

# Fitur Utama

- Dashboard modern dengan tampilan responsive
- Generate data KPJ secara cepat
- Monitoring progress bot
- Start / Stop bot dari dashboard
- Test koneksi API backend
- Penyimpanan pengaturan lokal browser
- Export hasil ke file CSV
- Integrasi mudah dengan VPS
- Dapat dijalankan sebagai service otomatis saat server reboot

---

# Struktur Project

```bash
botkjs/
├── index.html        # Frontend dashboard
├── server.js         # Backend Express
├── package.json      # Dependency Node.js
└── README.md         # Dokumentasi project
Persyaratan Sistem

Sebelum instalasi, pastikan VPS atau server memenuhi syarat berikut:

Ubuntu 22.04 / 24.04
Akses root atau user dengan sudo
RAM minimal 1 GB
Node.js 18 atau lebih baru
Nginx
Koneksi internet aktif
Instalasi dari Nol di VPS
1. Update sistem
apt update && apt upgrade -y
2. Install dependency dasar
apt install -y curl git nginx
3. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
4. Cek versi Node dan NPM
node -v
npm -v
Clone Repository
git clone https://github.com/kawainime/botkjs.git /var/www/botkjs
cd /var/www/botkjs
Instalasi Dependency Project
npm install

Jika diperlukan, install manual dependency utama:

npm install express cors axios sqlite3
Konfigurasi Backend

Pastikan file server.js tersedia di folder project.

Contoh backend minimal:

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BotKJS running' });
});

app.post('/api/start', (req, res) => {
  res.json({ status: 'started' });
});

app.post('/api/stop', (req, res) => {
  res.json({ status: 'stopped' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'idle' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
Menjalankan Project Secara Manual

Masuk ke folder project:

cd /var/www/botkjs

Lalu jalankan:

node server.js

Jika berhasil, akan muncul:

Server running on port 3000

Cek di browser:

http://IP_VPS:3000/api/health
Menjalankan Project dengan Systemd

Agar aplikasi berjalan otomatis saat VPS reboot, buat service systemd.

1. Buat file service
nano /etc/systemd/system/botkjs.service

Isi file:

[Unit]
Description=BotKJS App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/botkjs
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
2. Reload systemd dan aktifkan service
systemctl daemon-reload
systemctl enable botkjs
systemctl start botkjs
3. Cek status service
systemctl status botkjs
Konfigurasi Nginx

Nginx digunakan untuk:

menampilkan index.html
meneruskan request /api ke backend Node.js
1. Buat file konfigurasi Nginx
nano /etc/nginx/sites-available/botkjs

Isi file:

server {
    listen 80;
    server_name _;

    root /var/www/botkjs;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
2. Aktifkan site
ln -s /etc/nginx/sites-available/botkjs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
3. Test konfigurasi dan restart Nginx
nginx -t
systemctl restart nginx
Konfigurasi Firewall

Jika UFW aktif, buka port yang dibutuhkan:

ufw allow 22
ufw allow 80
ufw enable
Akses Dashboard

Setelah semua selesai, buka di browser:

http://IP_VPS

Untuk test backend:

http://IP_VPS/api/health
Cara Update Project

Jika ada perubahan pada source code:

cd /var/www/botkjs
git pull origin main
npm install
systemctl restart botkjs
systemctl restart nginx
Cara Hapus dan Install Ulang

Jika ingin menghapus instalasi lama:

Stop service
systemctl stop botkjs
systemctl disable botkjs
rm -f /etc/systemd/system/botkjs.service
systemctl daemon-reload
Hapus project
rm -rf /var/www/botkjs
Hapus konfigurasi Nginx
rm -f /etc/nginx/sites-available/botkjs
rm -f /etc/nginx/sites-enabled/botkjs
systemctl restart nginx

Setelah itu bisa install ulang dari awal.

Endpoint API

Berikut endpoint backend yang digunakan:

GET /api/health

Mengecek apakah server backend berjalan.

Response:
{
  "status": "ok",
  "message": "BotKJS running"
}
POST /api/start

Menjalankan bot.

Response:
{
  "status": "started"
}
POST /api/stop

Menghentikan bot.

Response:
{
  "status": "stopped"
}
GET /api/status

Melihat status bot saat ini.

Response:
{
  "status": "idle"
}
Fitur Dashboard

Frontend index.html menyediakan beberapa modul utama:

Generator KPJ
Input kode awal
Input jumlah hasil
Generate data otomatis
Automation Control
Start bot
Stop bot
Test single
Test lasik
Check Results
Tabel hasil proses
Export CSV
Clear results
Bot Status Log
Menampilkan log aktivitas
Copy log
Clear log
Credential & Token
OSS Token
2Captcha API Key
VPS Configuration
Server URL
API secret key
Delay
Retry count
Success threshold
Notification mode
Troubleshooting
1. Service gagal jalan

Cek status:

systemctl status botkjs

Cek log detail:

journalctl -u botkjs -f
2. Nginx error

Cek konfigurasi:

nginx -t
3. Halaman tampil tapi API tidak jalan

Pastikan backend aktif:

systemctl status botkjs

Test langsung:

curl http://localhost:3000/api/health
4. Dashboard tidak bisa diakses dari browser

Pastikan:

Nginx aktif
Port 80 terbuka
Firewall sudah diatur
IP VPS benar

Cek:

systemctl status nginx
ufw status
SSL / HTTPS (Opsional)

Jika sudah memiliki domain, pasang HTTPS menggunakan Certbot.

Install Certbot
apt install -y certbot python3-certbot-nginx
Jalankan Certbot
certbot --nginx -d domainanda.com
Catatan Penting
Frontend dashboard dapat berjalan dalam satu file index.html
CSS dan JavaScript sudah disatukan secara internal agar lebih stabil
Backend saat ini bisa digunakan sebagai dasar dan dapat dikembangkan lebih lanjut
Untuk integrasi bot asli, tambahkan logic pada server.js
Pengembangan Lanjutan

Project ini dapat dikembangkan menjadi:

integrasi database
autentikasi login admin
bot automation real
integrasi WhatsApp / Telegram
queue processing
scheduler otomatis
monitoring server lebih detail
export Excel / PDF
Lisensi

Gunakan dan modifikasi sesuai kebutuhan project Anda.

Author

Dikembangkan ulang untuk deployment VPS yang lebih stabil, modern, dan mudah dipelihara.
