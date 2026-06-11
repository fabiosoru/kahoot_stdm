# 🚀 Deployment Guide - Kahoot STDM

## Table of Contents
1. [Local Development with Docker](#local-development-with-docker)
2. [Production Deployment](#production-deployment)
3. [Server Setup](#server-setup)
4. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Step 1: Clone & Setup

```bash
git clone <your-repo> kahoot_stdm
cd kahoot_stdm

# Install dependencies locally (optional, for IDE)
npm install
```

### Step 2: Build & Run

```bash
# Using docker-compose (recommended)
docker-compose up --build -d

# Or using Makefile (if available)
make up
```

### Step 3: Access Application

- **Home**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **Default Admin**: `Fourni à l'administrateur`

### Step 4: View Logs

```bash
# Follow logs in real-time
docker-compose logs -f app

# Or with Makefile
make logs
```

### Step 5: Stop Services

```bash
docker-compose down
```

---

## Production Deployment

### Prerequisites on Server
- Docker & Docker Compose installed
- Git access (for auto-deploy or manual pulls)
- Domain name (optional, but recommended)
- SSL certificate (for HTTPS)

### Step 1: Server Setup

```bash
# SSH into your server
ssh user@your-server.com

# Create deployment directory
mkdir -p /opt/kahoot-stdm
cd /opt/kahoot-stdm

# Clone repository
git clone <your-repo> .
```

### Step 2: Configure Environment

```bash
# Create production environment file
cp .env.production.example .env.production

# Generate secure secrets
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh

# Edit with your values
nano .env.production

# Update these critical values:
# - JWT_SECRET (use generated value)
# - DATABASE_URL (default: file:/app/data/prod.db)
# - NODE_ENV=production
```

### Step 3: Initialize Database

```bash
# Create SQLite database with tables
chmod +x scripts/init-prod.sh
./scripts/init-prod.sh

# Database will be at ./data/prod.db
ls -lh ./data/
```

### Step 4: Build & Deploy

```bash
# Option A: Using docker-compose
docker-compose up -d

# Option B: Using Makefile
make build-prod
make deploy

# Option C: Manual Docker commands
docker build -t kahoot-stdm:prod .
docker run -d \
  --name kahoot-stdm \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v kahoot-data:/app/data \
  kahoot-stdm:prod
```

### Step 5: Verify Deployment

```bash
# Check if container is running
docker-compose ps
docker ps | grep kahoot

# Test health check
curl http://localhost:3000

# View logs
docker-compose logs app
```

### Step 6: Setup Reverse Proxy (Nginx)

```bash
# Install nginx
sudo apt update && sudo apt install nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/kahoot-stdm
```

Paste this configuration:

```nginx
upstream kahoot_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://kahoot_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/json application/xml+rss;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/kahoot-stdm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL/HTTPS (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --nginx -d your-domain.com

# Uncomment the HTTPS redirect in nginx config
sudo nano /etc/nginx/sites-available/kahoot-stdm

# Restart nginx
sudo systemctl restart nginx

# Auto-renewal (automatic with certbot)
sudo systemctl enable certbot.timer
```

---

## Server Setup

### Option A: Standalone Docker (Simple)

```bash
# One-time setup
cd /opt/kahoot-stdm
docker-compose up -d

# Application available at http://your-server:3000
```

### Option B: Systemd Service (Auto-restart)

Create `/etc/systemd/system/kahoot-stdm.service`:

```bash
sudo tee /etc/systemd/system/kahoot-stdm.service > /dev/null << 'EOF'
[Unit]
Description=Kahoot STDM Quiz Application
After=docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/opt/kahoot-stdm
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
Restart=unless-stopped
RestartSec=10
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable kahoot-stdm
sudo systemctl start kahoot-stdm

# Check status
sudo systemctl status kahoot-stdm
```

### Option C: Docker Swarm (Advanced)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml kahoot

# Check services
docker service ls
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Container status
docker-compose ps
docker stats

# Check logs for errors
docker-compose logs --tail=50 | grep -i error

# Health check
curl http://localhost:3000/api/health || echo "Service down"
```

### Backup Database

```bash
# Manual backup
docker run --rm -v kahoot-data:/data -v /backups:/backup \
  busybox cp /data/prod.db /backup/prod.db.backup.$(date +%Y%m%d_%H%M%S)

# Or with Makefile
make backup-db

# Verify backup
ls -lh /backups/
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or with Makefile
make rebuild
```

### Cleanup & Maintenance

```bash
# Remove unused Docker resources
docker system prune -a

# Clean old logs
docker-compose logs --tail=0 > /dev/null

# Check disk usage
docker system df
```

### Database Operations

```bash
# Connect to database
docker-compose exec app sqlite3 /app/data/prod.db

# Export data
docker run --rm -v kahoot-data:/data busybox \
  sqlite3 /data/prod.db ".dump" > backup.sql

# View database stats
docker-compose exec app sqlite3 /app/data/prod.db "
  SELECT 
    'quizzes' as table_name, COUNT(*) as count FROM quizzes
  UNION ALL
  SELECT 'participants', COUNT(*) FROM participants
  UNION ALL
  SELECT 'answers', COUNT(*) FROM answers;
"
```

---

## Security Checklist

- [ ] Changed JWT_SECRET in .env.production
- [ ] Changed admin password after first login
- [ ] SSL/HTTPS enabled with valid certificate
- [ ] Firewall configured (only 80, 443 exposed)
- [ ] Regular database backups scheduled
- [ ] Nginx logs monitored
- [ ] Docker images updated regularly
- [ ] Strong password policies

### Recommended: Automated Backups

Create `/opt/kahoot-stdm/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/kahoot"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker run --rm -v kahoot-data:/data -v $BACKUP_DIR:/backup \
  busybox cp /data/prod.db /backup/prod.db.$DATE.db

# Keep last 7 days only
find $BACKUP_DIR -name "*.db" -mtime +7 -delete

echo "Backup completed at $DATE"
```

Add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * /opt/kahoot-stdm/backup.sh >> /var/log/kahoot-backup.log 2>&1
```

---

## Troubleshooting

### Port 3000 already in use

```bash
# Find what's using the port
lsof -i :3000

# Kill the process or use different port in docker-compose
```

### Database errors

```bash
# Check database integrity
docker-compose exec app sqlite3 /app/data/prod.db "PRAGMA integrity_check;"

# Rebuild database if corrupted
rm data/prod.db
./scripts/init-prod.sh
```

### Out of disk space

```bash
# Clean Docker
docker system prune -a --volumes

# Check disk usage
df -h
du -sh /var/lib/docker/
```

### Container keeps restarting

```bash
# Check logs for errors
docker-compose logs app | tail -100

# Rebuild without cache
docker-compose down
docker build --no-cache -t kahoot-stdm:prod .
docker-compose up -d
```

---

## Performance Tuning

### Increase Container Resources

Edit `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### Enable Caching

Update Nginx config to cache static assets:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## Support & Logs

### View Application Logs

```bash
# Real-time logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app

# Filter by date
docker-compose logs --since 2024-01-01 app
```

### System Health

```bash
# Memory usage
docker stats --no-stream kahoot-stdm

# Disk usage
df -h
du -sh /opt/kahoot-stdm

# Network stats
docker exec kahoot-stdm netstat -tuln
```

---

## Questions?

Check the logs first:
```bash
docker-compose logs app | tail -200
```

Common issues and solutions in DOCKER.md
