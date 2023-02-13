run:
	docker-compose up --remove-orphans -d
stop:
	docker-compose down
	@echo "Bye!"
install:
	docker exec -t cave_game npm install
test:
	docker exec -t cave_game npm test
sh:
	docker exec -it cave_game sh
