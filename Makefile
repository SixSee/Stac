NPROCS = $(nproc --all)
MAKEFLAGS += -j$(NPROCS)

.PHONY: backend microservice hardware mongo all smartcontract webapp

all: mongo backend microservice hardware smartcontract webapp

startblockchain:
	cd ./frontend && \
		npm i && \
		npx hardhat node 

deploycontracts:
	cd ./frontend && \
		npx hardhat run scripts/deploy.js --network localhost

webapp:
	cd ./frontend/client && \
		npm start 

mongo:
	sudo docker compose up -d

backend:
	@cd ./backend/ && \
		yarn && yarn build && \
		echo && \
		echo "fill env file for microservice -> backend/.env" && \
		echo && \
		node dist/main.js
	@cd ..

microservice:
	@cd ./microservice/ && \
		python -m venv .venv/ && \
		source ./.venv/bin/activate && \
		pip install -r requirements.txt && \
		echo && \
		echo "fill env file for microservice -> microservice/env.py" && \
		echo && \
		python microservice.py
	@cd ..

hardware:
	@cd ./hardware  && \
		echo && \
		echo "use vscode extension platformIO to upload build code to nodeMCU" && \
		echo "WIFI password and MQTT related important variables are at ./hardware/src/main.cpp:18-24" && \
		echo "HARDWARE COMPONENTS USED -> NODEMCU, ADXL335, cd4051bcn (multiplexer), Jumper Cables" && \
		echo
	@cd ..
