run:
	docker-compose up --remove-orphans -d
stop:
	docker-compose down
	@echo "Bye!"
install:
	docker exec -t cave_base_1 npm install
test:
	docker exec -t cave_base_1 npm test
sh:
	docker exec -it cave_base_1 sh
