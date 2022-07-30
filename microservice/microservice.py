import json
import time
import paho.mqtt.client as mqtt
import requests
import env


def get_var(var_name, default="throw_error"):
    value_from_env = getattr(env, var_name, default)
    if value_from_env == "throw_error":
        raise Exception("Missing value of {var_name} in environment")
    return value_from_env


class Config:
    DEBUG_MODE = get_var("DEBUG_MODE", False)
    MQTT_PASSWORD = get_var("MQTT_PASSWORD")
    MQTT_USERNAME = get_var("MQTT_USERNAME")
    MQTT_TOPIC = get_var("MQTT_TOPIC", "/readings/#")
    MQTT_PORT = get_var("MQTT_PORT", "1883")
    MQTT_HOST = get_var("MQTT_HOST", "127.0.0.1")
    BACKEND_HOST = get_var("BACKEND_HOST", None)


class MqttClient:
    def __init__(self, timeout=None, temperature_threshold=None) -> None:
        super(MqttClient, self).__init__()
        self.client = mqtt.Client("blockchain")
        self.host = Config.MQTT_HOST
        self.port = int(Config.MQTT_PORT)
        self.timeout = timeout
        self.topic = Config.MQTT_TOPIC
        self.username = Config.MQTT_USERNAME
        self.password = Config.MQTT_PASSWORD

    def run(self):
        self.connect_to_broker()

    def connect_to_broker(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.username_pw_set(
            username=self.username,
            password=self.password)
        self.client.loop_start()
        self.client.connect(host=self.host,
                            port=self.port,
                            keepalive=self.timeout,
                            bind_address='')
        while not self.client.is_connected():
            print("waiting for connection......")
            time.sleep(1)
        while self.client.is_connected():
            pass

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        device_id: str = msg.topic.rsplit('/')[2]
        payload = msg.payload.decode('utf-8')
        payload = json.loads(payload)

        x_axis = payload.get('x-axis', None)
        y_axis = payload.get('y-axis', None)
        z_axis = payload.get('z-axis', None)

        if (not z_axis) or (not y_axis) or (not z_axis):
            print("Improper data format... ")
            return
        current_time = payload.get('current_time', None)
        print(
            f"Received readings from device {device_id} on {current_time}")

        # TODO-> Filter out faulty readings and send 1 reading every minute
        # getting device information and thresholds for temperature and humidity
        # temperature_threshold = 15
        # ideal_temperature_val = -40
        # ideal_humidity_val = 20
        # humidity_threshold = 20
        # if abs(temperature-ideal_temperature_val) > temperature_threshold or abs(humidity-ideal_humidity_val) > humidity_threshold:
        print(
            f"Sending faulty readings to the backend which makes a transaction on the blockhain network for device {device_id}")
        payload = {
            "device_id": device_id,
            "x-axis": x_axis,
            "y-axis": y_axis,
            "z-axis": z_axis,
            "time": current_time,
        }
        headers = {"Content-Type": "application/json"}
        try:
            response = requests.request(
                "POST", f'{Config.BACKEND_HOST}/physical_entries/', json=payload, headers=headers)
            print(response.text)
        except Exception as e:
            print(e)

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connection successfull!")
        else:
            print("Bad connection returned code=", rc)
        #  Subscribe to a list of topics using a lock to guarantee that a topic is only subscribed once
        client.subscribe(self.topic)


if __name__ == "__main__":
    mqtt_client = MqttClient(timeout=60)
    mqtt_client.run()
