run:
ifeq ($(type -t docker-compose),)
	docker compose up --remove-orphans -d
else
	docker-compose up --remove-orphans -d
endif

stop:
ifeq ($(type -t docker-compose),)
	docker compose down
else
	docker-compose down
endif
	@echo "Bye!"
	
install:	
	docker exec -t cave_game npm install

test:
	docker exec -t cave_game npm test
	
sh:
	docker exec -it cave_game sh
