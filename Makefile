api_run_debug:
	cd projects/api-dev-server && \
	THE_GAME_ENV="local" \
	pipenv run python \
		-m debugpy --listen 5678 --wait-for-client \
			-m flask --app projects/api-dev-server/main.py run --debug --no-reload
web_shell:
	docker run --rm -it --entrypoint sh the-game-client
web_build:
	docker build projects/client -f projects/client/Dockerfile -t the-game-client
web_run:
	docker run 