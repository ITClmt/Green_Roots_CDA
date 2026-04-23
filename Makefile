.PHONY: start stop build down

start:
	docker compose up

stop:
	docker compose stop

build:
	docker compose up --build

down:
	docker compose down
