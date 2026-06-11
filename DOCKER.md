# 🐳 Docker Deployment Guide

## Quick Start

### Build and Run Locally

```bash
# Build the Docker image
docker build -t kahoot-stdm:latest .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

Access the application at **http://localhost:3000**

---

## Production Deployment

### 1. Prerequisites

- Docker and Docker Compose installed
- SQLite database will be persisted in Docker volume
- .env.production with secure credentials

### 2. Environment Variables

Create `.env.production` with secure values:

```env
DATABASE_URL="file:/app/data/prod.db"
JWT_SECRET="your-super-secure-secret-key-here-min-32-chars"
NODE_ENV="production"
```

⚠️ **CHANGE THESE VALUES IN PRODUCTION!**

### 3. Initialize Production Database

```bash
# Make script executable
chmod +x scripts/init-prod.sh

# Initialize database
./scripts/init-prod.sh
```

This creates the SQLite database with all tables if it doesn't exist.

### 4. Build Production Image

```bash
# Build the image
docker build -t kahoot-stdm:prod .

# Tag for registry (optional)
docker tag kahoot-stdm:prod your-registry/kahoot-stdm:prod
```

### 5. Deploy with docker-compose

```bash
# Start services in background
docker-compose up -d

# Verify health
docker-compose ps

# Check logs
docker-compose logs app
```

### 6. Manual Docker Run

```bash
docker run -d \
  --name kahoot-stdm \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="file:/app/data/prod.db" \
  -e JWT_SECRET="your-secret-key" \
  -v kahoot-data:/app/data \
  kahoot-stdm:prod
```

---

## Deployment on VPS/Server

### Option A: Using docker-compose (Recommended)

```bash
# On your server
git clone <your-repo>
cd kahoot_stdm

# Setup environment
cp .env.production.example .env.production
# Edit .env.production with real values
nano .env.production

# Initialize database
chmod +x scripts/init-prod.sh
./scripts/init-prod.sh

# Start services
docker-compose up -d

# Setup auto-restart
docker-compose ps  # verify running
```

### Option B: Using systemd service

Create `/etc/systemd/system/kahoot-stdm.service`:

```ini
[Unit]
Description=Kahoot STDM Quiz Application
After=docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/path/to/kahoot_stdm
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
Restart=unless-stopped
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable kahoot-stdm
sudo systemctl start kahoot-stdm
```

---

## Volumes & Persistence

### Database Volume

SQLite database is persisted in Docker volume `kahoot-data`:

```bash
# Backup database
docker run --rm -v kahoot-data:/data -v $(pwd):/backup \
  busybox cp /data/prod.db /backup/prod.db.backup

# Restore database
docker run --rm -v kahoot-data:/data -v $(pwd):/backup \
  busybox cp /backup/prod.db.backup /data/prod.db
```

### List volumes

```bash
docker volume ls
docker volume inspect kahoot-data
```

---

## SSL/HTTPS with Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use Let's Encrypt:

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

Update nginx config to listen on 443 with SSL.

---

## Monitoring & Logs

### View logs

```bash
# Follow logs in real-time
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app
```

### Health check

```bash
# The Docker image includes health checks
docker-compose ps  # Shows health status

# Manual health check
curl http://localhost:3000/api/health 2>/dev/null || echo "Service down"
```

### Monitor resources

```bash
docker stats kahoot-stdm
```

---

## Troubleshooting

### Port already in use

```bash
# Change port in docker-compose.yml
# ports:
#   - "8080:3000"  # Use 8080 instead

docker-compose up -d
```

### Database not initializing

```bash
# Check database volume
docker-compose exec app ls -la /app/data/

# Manually initialize
docker-compose exec app bash scripts/init-prod.sh
```

### Container keeps restarting

```bash
# Check logs for errors
docker-compose logs app

# Rebuild image
docker-compose down
docker build --no-cache -t kahoot-stdm:prod .
docker-compose up -d
```

### Out of disk space

```bash
# Clean up unused Docker resources
docker system prune -a

# Or just unused volumes
docker volume prune
```

---

## Security Checklist

- [ ] Change `JWT_SECRET` in `.env.production`
- [ ] Change admin password after first login
- [ ] Enable HTTPS/SSL with nginx or caddy
- [ ] Set firewall rules (only expose port 80/443)
- [ ] Regular database backups
- [ ] Monitor logs for errors
- [ ] Use strong admin credentials
- [ ] Keep Docker images updated

---

## Production Tips

1. **Auto-restart**: Docker Compose has `restart: unless-stopped`
2. **Persistent storage**: Database in volume, survives container restarts
3. **Health checks**: Built-in to Dockerfile and docker-compose
4. **Resource limits**: Add to docker-compose.yml if needed:
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

5. **Logging**: Default stdout/stderr, or mount log directory
6. **Backups**: Backup `kahoot-data` volume regularly

---

## Git Auto-Deploy Integration

If your server has git auto-deploy:

```bash
# On server, in post-receive hook:
#!/bin/bash
cd /path/to/kahoot_stdm
git pull origin main
docker-compose down
docker build -t kahoot-stdm:prod .
docker-compose up -d
```

---

## Support

For issues or questions, check:
- Docker logs: `docker-compose logs app`
- Application status: `curl http://localhost:3000`
- Volumes: `docker volume ls`
