api_run_debug:
	THE_GAME_ENV="local" \
	pipenv run python \
		-m debugpy --listen 5678 --wait-for-client \
			-m flask --app projects/api-dev-server/main.py run --debug --no-reload