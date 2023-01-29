run:
	docker-compose up --remove-orphans -d
stop:
	docker-compose down
	@echo "Bye!"

