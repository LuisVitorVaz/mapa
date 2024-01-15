#define TINY_GSM_MODEM_SIM800

#include <TinyGsmClient.h>
#include <ArduinoHttpClient.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

static const int RXPin = 4, TXPin = 3;
TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

#define rxPin 8
#define txPin 9
SoftwareSerial sim800(txPin, rxPin);

const char FIREBASE_HOST[] = "bancodedados-a7591-default-rtdb.firebaseio.com";
const String FIREBASE_AUTH = "09fFbaRrhJkNPoDVwRE3TszPG2m7TeUZKWuoAJUF";
const String FIREBASE_PATH = "dados";
const int SSL_PORT = 443;

char apn[] = "zap.vivo.com.br";
char user[] = "";
char pass[] = "";

TinyGsm modem(sim800);
TinyGsmClientSecure gsm_client_secure_modem(modem, 0);
HttpClient http_client = HttpClient(gsm_client_secure_modem, FIREBASE_HOST, SSL_PORT);

unsigned long previousMillis = 0;
const long interval = 60000;  // Intervalo de 60 segundos (em milissegundos)

void setup()
{
  Serial.begin(9600);
  ss.begin(9600);
  Serial.println(F("Inicializando..."));

  sim800.begin(9600);
  Serial.println(F("Inicializando módulo SIM800L..."));

  Serial.println(F("Inicializando modem..."));
  modem.restart();
  String modemInfo = modem.getModemInfo();
  Serial.print(F("Modem: "));
  Serial.println(modemInfo);

  http_client.setHttpResponseTimeout(10 * 1000); // 10 segundos de timeout para resposta HTTP
}

void loop()
{
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval)
  {
    Serial.print(F("Conectando a "));
    Serial.print(apn);
    if (!modem.gprsConnect(apn, user, pass))
    {
      Serial.println(F(" falha"));
      delay(1000); // Adiciona atraso antes de tentar novamente
      return;
    }
    Serial.println(F(" OK"));

    http_client.connect(FIREBASE_HOST, SSL_PORT);

    while (true)
    {
      if (!http_client.connected())
      {
        Serial.println();
        http_client.stop();
        Serial.println(F("HTTP não conectado"));
        break;
      }
      else
      {
        gps_loop();
      }
    }

    previousMillis = currentMillis;
  }
}

void PostToFirebase(const char *method, const String &path, const String &data, HttpClient *http)
{
  String response;
  int statusCode = 0;
  http->connectionKeepAlive();
  String url;
  if (path[0] != '/')
  {
    url = "/";
  }
  url += path + ".json";
  url += "?auth=" + FIREBASE_AUTH;
  Serial.print("POST:");
  Serial.println(url);
  Serial.print("Data:");
  Serial.println(data);

  String contentType = "application/json";
  http->post(url, contentType, data); // Usando POST para adicionar um novo registro

  statusCode = http->responseStatusCode();
  Serial.print(F("Código de status: "));
  Serial.println(statusCode);
  response = http->responseBody();
  Serial.print(F("Resposta: "));
  Serial.println(response);

  if (!http->connected())
  {
    Serial.println();
    http->stop();
    Serial.println(F("HTTP POST desconectado"));
  }
}

void gps_loop()
{
  String  latitude = String(gps.location.lat());
  String  longitude = String(gps.location.lng());
  Serial.println(latitude);
  Serial.println(longitude);
  String Data = "{";
  Data += "\"Latitude\":" + latitude + ",";
  Data += "\"Longitude\":" + longitude + "";
  Data += "}";

  PostToFirebase("PATCH", FIREBASE_PATH, Data, &http_client);
  delay(60000);
}
