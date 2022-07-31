# Standalone Repo for amazon hackathon
## Stac
Our idea aims to solve the following in a cost efficient, and scalable way:
1. Identifying and tagging counterfeit products before it reaches the customer
2. Tracking the possible damage to goods enroute. This happens in the both cases:
   ◦ When a customer recieves the order
   ◦ When a customer returns the order
3. Ensuring the goods are not swapped in between the supply chain, be it by the customer or by an
   employee

### We have deployed all the stuff on a server
[Backend](https://amazon-api.wantguns.dev)  
[Swagger documentation for backend](https://amazon-api.wantguns.dev/api)  
[Frontend](https://amazon-frontend.wantguns.dev)  
[Mosquitto-Broker](https://mosquitto.wantguns.dev)  
Microservice is deployed internally on server

## Deploy - Method 1
###### Before doing this step create ENV files for respective modules

### Setup for mongo and hardware
```bash
make mongo
make hardware
```
### Setup for microservice and backend
#### Open a new terminal to run microservice
```bash
make microservice
```
#### Open a new terminal to run backend
```bash
make backend
```
### Setup for Smart Contracts and WebApp
#### Open a new terminal 
```bash
make smartcontract
```
```bash
make webapp
```

## Env setup for different modules
### Frontend and Smart contract env variables
frontend/client/.env
```bash
REACT_APP_BASE_URL=https://amazon-api.wantguns.dev/
```

### Backend env variables
backend/.env
```bash
DATABASE_URI=MONGODB_URI
SECRET=secretkey
```

### Microservice env variables
microservice/env.py
```python
DEBUG_MODE = False
MQTT_PASSWORD = "admin"
MQTT_USERNAME = "amazon"
MQTT_TOPIC = "/readings/#"
MQTT_PORT = "1883"
MQTT_HOST = "mosquitto.wantguns.dev"
BACKEND_HOST = "https://amazon-api.wantguns.dev"
```

### Hardware env variables
hardware/src/main.cpp:18-24
```cpp
const char *WIFI_SSID = "ESP_TEST";
const char *WIFI_PASSWORD = "hello1234";
const char *MQTT_SERVER = "mosquitto.wantguns.dev";
const char *MQTT_USERNAME = "username of mqtt broker";
const char *MQTT_PASSWORD = "password for mqtt broker";
char *MQTT_TOPIC = "/readings/1234abcd";
const int MQTT_PORT = 1883;
```
## Hardware Components
1. NodeMCU
2. ADXL335
3. CD4051 (multiplexer)
4. Jumper Cables
##### Upload the build for hardware code using vscode extension PlatformIO to NodeMCU

## Frontend and Smart Contract run
#### Smart Contract deploy
```bash
cd ./frontend
npm i
npx hardhat node 
npx hardhat run scripts/deploy.js
```
#### Web App start
```bash
cd ./client/
npm start
```

## Backend run
```bash
cd ./backend
docker build -t amazon-backend .
docker run -d -p 0.0.0.0:8000:8000 --name backend-api amazon-backend:latest
```
## Microservice run
```bash
cd ./microservice 
python -m venv .venv/
source ./.venv/bin/activate
pip install -r requirements.txt
python microservice.py
```



