# Cafe24 Deployment Guide for Tamburin Music

## 📋 Server Information
- **IP Address**: 114.207.245.104
- **Platform**: Cafe24 Hosting
- **Target**: Production Deployment

---

## 🔧 Prerequisites

### On Your Local Machine:
- [x] Git installed
- [x] Node.js v16+ installed
- [x] MySQL/MariaDB installed locally
- [x] SSH client (PuTTY for Windows or built-in terminal)

### Cafe24 Account Access:
- [ ] SSH access credentials (username/password)
- [ ] FTP access credentials (alternative)
- [ ] Database access credentials
- [ ] Domain name (if configured)

---

## 📦 Step 1: Prepare Project for Production

### 1.1 Build Frontend
```bash
cd Frontend
npm install
npm run build
# This creates Frontend/dist folder with production files
```

### 1.2 Build Backend
```bash
cd Backend
npm install
npm run build
# This creates Backend/dist folder with compiled TypeScript
```

### 1.3 Update Environment Files

**Backend Production (.env):**
```env
NAME=TamburinMusic API
PORT=5001
MARIADB_HOST=localhost
MARIADB_USERNAME=your_cafe24_db_user
MARIADB_PASSWORD=your_cafe24_db_password
MARIADB_PORT=3306
MARIADB_DATABASE=tamburinmusic
JWT_SECRET_KEY=GENERATE_STRONG_RANDOM_KEY_HERE
NODE_ENV=production
```

**Frontend Production URLs:**
Update `Frontend/.env.production` with:
```env
VITE_SERVER_URL=http://114.207.245.104:5001
VITE_FRONT_URL=http://114.207.245.104
```

---

## 🚀 Step 2: Connect to Cafe24 Server

### Option A: SSH Connection
```bash
# Using SSH (Linux/Mac/WSL)
ssh your_username@114.207.245.104

# Using PuTTY (Windows)
# Host: 114.207.245.104
# Port: 22 (default) or custom SSH port
# Connection type: SSH
```

### Option B: FTP Connection
- Use FileZilla or any FTP client
- Host: 114.207.245.104
- Protocol: SFTP or FTP
- Username: [your Cafe24 username]
- Password: [your Cafe24 password]

---

## 📤 Step 3: Upload Files to Server

### Using SSH/SCP:
```bash
# Upload Backend
scp -r Backend/ your_username@114.207.245.104:~/tamburin_backend/

# Upload Frontend dist
scp -r Frontend/dist/ your_username@114.207.245.104:~/tamburin_frontend/

# Upload database
scp tamburin_music.sql your_username@114.207.245.104:~/
```

### Using FTP:
1. Connect with FTP client
2. Upload `Backend/` folder to server
3. Upload `Frontend/dist/` folder to web root (usually `/www` or `/public_html`)
4. Upload `tamburin_music.sql` to server home directory

---

## 🗄️ Step 4: Setup Database on Cafe24

### 4.1 Connect to Server via SSH
```bash
ssh your_username@114.207.245.104
```

### 4.2 Import Database
```bash
# Check if MySQL is accessible
mysql --version

# Import database (update with your credentials)
mysql -u your_db_user -p < ~/tamburin_music.sql

# Or create database first, then import
mysql -u your_db_user -p
CREATE DATABASE tamburinmusic CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
exit

mysql -u your_db_user -p tamburinmusic < ~/tamburin_music.sql
```

### 4.3 Verify Database
```bash
mysql -u your_db_user -p
USE tamburinmusic;
SHOW TABLES;
SELECT COUNT(*) FROM member;
exit
```

---

## ⚙️ Step 5: Setup Backend on Server

### 5.1 Navigate to Backend Directory
```bash
cd ~/tamburin_backend
```

### 5.2 Install Dependencies
```bash
# If Node.js is installed on server
npm install --production

# Or use pnpm
pnpm install --production
```

### 5.3 Configure Environment
```bash
# Edit .env file with server-specific settings
nano .env  # or vi .env

# Update these values:
# - MARIADB_PASSWORD (your actual DB password)
# - JWT_SECRET_KEY (generate strong random key)
# - NODE_ENV=production
```

### 5.4 Start Backend Server

**Option A: Using PM2 (Recommended for production)**
```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
cd ~/tamburin_backend
pm2 start dist/index.js --name "tamburin-api"

# Make PM2 start on server reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs tamburin-api
```

**Option B: Using Node directly**
```bash
cd ~/tamburin_backend
NODE_ENV=production node dist/index.js &
```

**Option C: Using screen (keeps running after disconnect)**
```bash
screen -S tamburin-backend
cd ~/tamburin_backend
npm run serve
# Press Ctrl+A then D to detach
# screen -r tamburin-backend to reattach
```

---

## 🌐 Step 6: Setup Frontend on Server

### 6.1 Configure Web Server

**For Apache (most Cafe24 servers):**

Create `.htaccess` in frontend directory:
```bash
cd /www  # or /public_html
nano .htaccess
```

Add this content:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS for API
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

### 6.2 Upload Frontend Files
```bash
# Copy built files to web root
cp -r ~/tamburin_frontend/* /www/
# or
cp -r ~/tamburin_frontend/* /public_html/
```

---

## 🔒 Step 7: Security Configuration

### 7.1 Update JWT Secret
```bash
# Generate strong random key
openssl rand -base64 32

# Update in Backend/.env
JWT_SECRET_KEY=<generated_key>
```

### 7.2 Configure Firewall (if you have access)
```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Allow Backend API port
sudo ufw allow 5001/tcp

# Allow SSH
sudo ufw allow 22/tcp
```

### 7.3 Set Proper Permissions
```bash
# Backend
chmod -R 755 ~/tamburin_backend
chmod 600 ~/tamburin_backend/.env

# Frontend
chmod -R 755 /www  # or /public_html
```

---

## 🧪 Step 8: Test Deployment

### 8.1 Test Backend API
```bash
# From server
curl http://localhost:5001/status

# From your local machine
curl http://114.207.245.104:5001/status
```

### 8.2 Test Frontend
Open browser:
- http://114.207.245.104
- Check if homepage loads
- Check browser console for errors

### 8.3 Test Database Connection
- Try logging in
- Check if data loads on homepage
- Verify API calls work

---

## 🔄 Step 9: Setup Auto-Restart

### Using PM2 (Recommended)
```bash
# Backend is already managed by PM2 from Step 5.4

# View logs
pm2 logs tamburin-api

# Restart if needed
pm2 restart tamburin-api

# Stop
pm2 stop tamburin-api
```

### Using systemd (Alternative)
Create service file:
```bash
sudo nano /etc/systemd/system/tamburin-backend.service
```

Add:
```ini
[Unit]
Description=Tamburin Music Backend
After=network.target

[Service]
Type=simple
User=your_username
WorkingDirectory=/home/your_username/tamburin_backend
ExecStart=/usr/bin/node dist/index.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable tamburin-backend
sudo systemctl start tamburin-backend
sudo systemctl status tamburin-backend
```

---

## 📊 Monitoring & Maintenance

### Check Backend Logs
```bash
# PM2
pm2 logs tamburin-api

# Check log files
tail -f ~/tamburin_backend/log/error.log
tail -f ~/tamburin_backend/log/combined.log
```

### Monitor Server Resources
```bash
# CPU and Memory usage
top
htop  # if available

# Disk space
df -h

# Check running processes
ps aux | grep node
```

### Database Backup
```bash
# Backup database daily
mysqldump -u your_db_user -p tamburinmusic > backup_$(date +%Y%m%d).sql

# Create backup script
nano ~/backup_db.sh
```

Add to backup script:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u your_db_user -pyour_password tamburinmusic > ~/backups/tamburin_$DATE.sql
find ~/backups -name "tamburin_*.sql" -mtime +7 -delete
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs tamburin-api

# Check if port is in use
netstat -tulpn | grep 5001

# Kill process if needed
kill -9 $(lsof -t -i:5001)
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u your_db_user -p -h localhost

# Check MySQL status
sudo systemctl status mysql
# or
sudo service mysql status
```

### Frontend Not Loading
```bash
# Check Apache/Nginx status
sudo systemctl status apache2
# or
sudo systemctl status nginx

# Check web server logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### Permission Issues
```bash
# Fix ownership
chown -R your_username:your_username ~/tamburin_backend
chown -R www-data:www-data /www  # for Apache
```

---

## 📝 Quick Reference Commands

### Start Services
```bash
pm2 start tamburin-api
sudo systemctl start apache2
sudo systemctl start mysql
```

### Stop Services
```bash
pm2 stop tamburin-api
sudo systemctl stop apache2
```

### Restart Services
```bash
pm2 restart tamburin-api
sudo systemctl restart apache2
```

### Update Code
```bash
# Pull latest from git
cd ~/tamburin_backend
git pull origin main
npm install
npm run build
pm2 restart tamburin-api
```

---

## 🌟 Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Setup SSL certificate (Let's Encrypt)
3. ✅ Configure domain name
4. ✅ Setup monitoring (UptimeRobot, etc.)
5. ✅ Configure automated backups
6. ✅ Setup error tracking (Sentry, etc.)
7. ✅ Performance optimization
8. ✅ CDN setup for static assets

---

## 📞 Support Contacts

- **Cafe24 Support**: [Cafe24 customer service]
- **Server IP**: 114.207.245.104
- **Project Repository**: https://github.com/Avazbek-Khudoynazarov/tamburinMusic

---

## ⚠️ Important Notes

1. **Never commit `.env` files** to Git
2. **Change JWT_SECRET_KEY** for production
3. **Setup SSL/HTTPS** as soon as possible
4. **Regular database backups** are crucial
5. **Monitor server logs** regularly
6. **Keep Node.js and dependencies updated**

---

**Good luck with your deployment! 🚀**
