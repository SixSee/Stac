
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
