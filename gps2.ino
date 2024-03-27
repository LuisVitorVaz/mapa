#define TINY_GSM_MODEM_SIM800
#include <TinyGsmClient.h>
#include <ArduinoHttpClient.h>
#include <TinyGPS.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

void enviarsms();
SoftwareSerial serial1(4, 3); // RX, TX
TinyGPS gps;

#define rxPin 8
#define txPin 9
SoftwareSerial sim800(txPin, rxPin);

String dado1,dado2;
bool interruptFlag = false; 
bool dadosLidos = false; // Inicialmente, nenhum dado foi lido
const int interruptPin = 2; // Define o pino para a interrupção externa
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


void setup() {
  serial1.begin(9600);
  Serial.begin(9600);
  sim800.begin(9600);
  
  pinMode(interruptPin, INPUT); // Define o pino como entrada
  attachInterrupt(digitalPinToInterrupt(interruptPin), enviarsms, FALLING); // Configura a interrupção para ocorrer na borda de descida (FALLING)
  
  Serial.println(F("Inicializando..."));
 
  Serial.println(F("Inicializando módulo SIM800L..."));

  Serial.println(F("Inicializando modem..."));
  modem.restart();
  String modemInfo = modem.getModemInfo();
  Serial.print(F("Modem: "));
  Serial.println(modemInfo);

  http_client.setHttpResponseTimeout(10 * 1000); // 10 segundos de timeout para resposta HTTP
}
long startTime = 0;
long interval = 60000;  // 1 minuto em milissegundos

void loop() {
    unsigned long currentTime = millis();

    if (interruptFlag) {
        interruptFlag = false; // Reseta a flag da interrupção
        // Trata a interrupção (chama a função enviarsms())
        enviarsms();
    } 
    else {
        if (currentTime - startTime < interval) {
            // Se o tempo ainda não passou, continue lendo o GPS
            lergps();
        } else {
            // Se já se passou um minuto, passe para a próxima função
            lergsm();
            // Reinicia o tempo de contagem para a próxima iteração
            startTime = currentTime;
        }
    }
}
  void lergps()
  {
     // Configura para ouvir a porta do módulo GPS
  serial1.listen();
  bool gpsDataReceived = false;
 
  while (serial1.available()) {
    char cIn = serial1.read(); // guarda em cIn o dado recebido no pino RX
    gpsDataReceived = gps.encode(cIn);
  }
  Serial.println("----------------------------------------");

long latitude;
long longitude;
unsigned long idadeInfo;

gps.get_position(&latitude, &longitude, &idadeInfo);

if (latitude != TinyGPS::GPS_INVALID_F_ANGLE) {
  Serial.print("Latitude: ");
  Serial.println(float(latitude) / 100000, 6);
}

if (longitude != TinyGPS::GPS_INVALID_F_ANGLE) {
  Serial.print("Longitude: ");
  Serial.println(float(longitude) / 100000, 6);
}

dado1 = String(latitude);
dado2 = String(longitude);


Serial.println(dado1);
Serial.println(dado2);

  delay(250);
}
void lergsm()
{
  // Configura para ouvir a porta do módulo Gsm
  sim800.listen();

    Serial.print(F("Conectando a "));
    Serial.print(apn);
    
    if (!modem.gprsConnect(apn, user, pass)) {
      Serial.println(F(" falha"));
      delay(1000); // Adiciona atraso antes de tentar novamente
      return;
    }
    Serial.println(F(" OK"));

    http_client.connect(FIREBASE_HOST, SSL_PORT);

    while (true) {
      if (!http_client.connected()) {
        Serial.println();
        http_client.stop();
        Serial.println(F("HTTP não conectado"));
        break;
      }
      else
      {
          gps_loop();
          break;
      }
   
    }
  }
void PostToFirebase(const char *method, const String &path, const String &data, HttpClient *http) {
  String response;
  int statusCode = 0;
  http->connectionKeepAlive();
  String url;
  if (path[0] != '/') {
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

  if (!http->connected()) {
    Serial.println();
    http->stop();
    Serial.println(F("HTTP POST desconectado"));
  }
}
void gps_loop()
{
  String Data = "{";
  Data += "\"dado1\":" + dado1 + ",";
  Data += "\"dado2\":" + dado2 + "";
  Data += "}";

  PostToFirebase("PATCH", FIREBASE_PATH,Data, &http_client);
  delay(60000); // Aguarda 1 minuto antes de obter novos dados do GPS
}
void enviarsms() {
    sim800.listen(); 
    String telefone =  "+980454531";
    String mensagem = "Teste de mensagem";
     sim800.print("AT+CMGF=1\n");
    delay(100);
     sim800.print("AT+CNMI=2,2,0,0,0\n");
    delay(100);
     sim800.print("ATX4\n");
    delay(100);
     sim800.print("AT+COLP=1\n");
    delay(100);
     sim800.print("AT+CMGS=\"" + telefone + "\"\n");
    delay(100);
     sim800.print(mensagem + "\n");
    delay(100);
     sim800.print((char)26); // CTRL+Z para finalizar a mensagem
    delay(100);
}
