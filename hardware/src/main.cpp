#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <Wire.h>
// S0 -> D1
// S1 -> D2
// S2 -> D3

// A1 -> z-axis
// A0 -> y-axis
// A3 -> x-axis
#define MUX_S0 D1
#define MUX_S1 D2
#define MUX_S2 D3

// WIFI&MQTT VARS
const char *WIFI_SSID = "ESP_TEST";
const char *WIFI_PASSWORD = "hello1234";
const char *MQTT_SERVER = "mosquitto.wantguns.dev";
const char *MQTT_USERNAME = "amazon";
const char *MQTT_PASSWORD = "admin";
char *MQTT_TOPIC = "/readings/1234abcd";
const int MQTT_PORT = 1883;

// SELECT PINS
const int xaxis[3] = {1, 1, 0};
const int yaxis[3] = {0, 0, 0};
const int zaxis[3] = {1, 0, 0};
const int ANALOG_INPUT = A0;

WiFiClient espClient;
PubSubClient client(espClient);
struct Readings {
  float x_axis, y_axis, z_axis;
};

void setup_wifi() {
  Serial.print("Connecting");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.print("\nConnected, IP address: ");
  Serial.println(WiFi.localIP());

  client.setServer(MQTT_SERVER, MQTT_PORT);
}
void mqtt_reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String client_id = "MqttEspClient-";
    client_id += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(client_id.c_str(), MQTT_USERNAME, MQTT_PASSWORD)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}
void mqtt_publish(Readings &readings) {
  StaticJsonDocument<256> doc;
  doc["x-axis"] = readings.x_axis;
  doc["y-axis"] = readings.y_axis;
  doc["z-axis"] = readings.z_axis;
  char payload[128];
  serializeJson(doc, payload);
  client.publish(MQTT_TOPIC, payload);
}
void changeMux(int c, int b, int a) {
  digitalWrite(MUX_S0, a);
  digitalWrite(MUX_S1, b);
  digitalWrite(MUX_S2, c);
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
  } // wait for serial port to connect. Needed for native USB
  Wire.begin();

  pinMode(MUX_S0, OUTPUT);
  pinMode(MUX_S1, OUTPUT);     
  pinMode(MUX_S2, OUTPUT);     
  setup_wifi();
  if (client.connect("NodeMcuClient", MQTT_USERNAME, MQTT_PASSWORD)) {
    Serial.println("Connected to mqtt");
  }
}

void loop() {

  if (!client.connected()) {
    mqtt_reconnect();
  }
  client.loop();

  Readings readings;

  changeMux(xaxis[0], xaxis[1], xaxis[2]);
  readings.x_axis = analogRead(ANALOG_INPUT);

  changeMux(yaxis[0], yaxis[1], yaxis[2]);
  readings.y_axis = analogRead(ANALOG_INPUT);

  changeMux(zaxis[0], zaxis[1], zaxis[2]);
  readings.z_axis = analogRead(ANALOG_INPUT);


  String s = "x-axis ";
  s += String(readings.x_axis);
  s += " y-axis ";
  s += String(readings.y_axis);
  s += " z-axis ";
  s += String(readings.z_axis);
  
  mqtt_publish(readings);


  Serial.println(s);
  delay(2000);
}