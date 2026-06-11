.PHONY: help build build-prod up down logs shell init-db clean deploy

help:
	@echo "📦 Kahoot STDM - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make build          - Build development image"
	@echo "  make up             - Start services with docker-compose"
	@echo "  make down           - Stop services"
	@echo "  make logs           - View container logs"
	@echo "  make shell          - Open shell in container"
	@echo "  make clean          - Remove containers and volumes"
	@echo ""
	@echo "Production:"
	@echo "  make build-prod     - Build production image"
	@echo "  make init-db        - Initialize production database"
	@echo "  make deploy         - Full production deploy"
	@echo ""

build:
	docker build -t kahoot-stdm:dev .

build-prod:
	docker build -t kahoot-stdm:prod .

up:
	docker-compose up -d
	@echo "✅ Services started"
	@echo "🌐 Access at http://localhost:3000"

down:
	docker-compose down
	@echo "✅ Services stopped"

logs:
	docker-compose logs -f app

shell:
	docker-compose exec app /bin/sh

init-db:
	chmod +x scripts/init-prod.sh
	./scripts/init-prod.sh

clean:
	docker-compose down -v
	@echo "✅ Containers and volumes removed"

deploy: build-prod init-db
	docker-compose down
	docker-compose up -d
	@echo "✅ Application deployed"
	@echo "🌐 Access at http://localhost:3000"

# Additional utilities
ps:
	docker-compose ps

restart:
	docker-compose restart app

rebuild:
	docker-compose down
	docker build --no-cache -t kahoot-stdm:prod .
	docker-compose up -d

backup-db:
	@mkdir -p ./backups
	@docker run --rm -v kahoot-data:/data -v $(PWD)/backups:/backup \
		busybox cp /data/prod.db /backup/prod.db.backup.$(shell date +%Y%m%d_%H%M%S)
	@echo "✅ Database backed up"

stats:
	docker stats kahoot-stdm

version:
	docker --version
	docker-compose --version
