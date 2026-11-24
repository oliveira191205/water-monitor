
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Configuracao do WiFi
const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// Configuracoes da API
const char* API_URL = "https://hctuxkfpmvyasmewelsv.supabase.co/functions/v1/monitoramento-reservatorio";
const char* DEVICE_API_KEY = "Reservatorio_ESP32_2026_K9mP4xR7vB2nL8qW";

// Pinos do sensor
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;

// Configuracoes do reservatorio
const float DISTANCIA_VAZIO = 45.0;
const float DISTANCIA_CHEIO = 5.0;
const float LIMITE_ALERTA = 20.0;

// Coleta a cada 5 segundos
const unsigned long INTERVALO = 5000;

unsigned long ultimaLeitura = 0;

// Leitura do sensor
float medirDistancia() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duracao = pulseIn(ECHO_PIN, HIGH, 30000);

  if (duracao == 0) {
    return -1;
  }

  float distancia = duracao * 0.0343 / 2;

  return distancia;
}

// Calcula o nivel de agua
float calcularNivel(float distancia) {
  float nivel =
    (DISTANCIA_VAZIO - distancia) /
    (DISTANCIA_VAZIO - DISTANCIA_CHEIO) * 100;

  return constrain(nivel, 0, 100);
}

// Conectar ao WiFi
void conectarWiFi() {
  Serial.print("Conectando ao WiFi");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.println(WiFi.localIP());
}

// Enviar dados para a API
void enviarParaAPI(float distancia, float nivel) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado. Leitura nao enviada.");
    return;
  }

  WiFiClientSecure cliente;
  cliente.setInsecure();

  HTTPClient http;

  if (http.begin(cliente, API_URL)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", DEVICE_API_KEY);

    String json = "{";
    json += "\"device_id\":\"ESP32_RESERVATORIO_01\",";
    json += "\"distance_cm\":" + String(distancia, 2) + ",";
    json += "\"level_percent\":" + String(nivel, 2);
    json += "}";

    Serial.println("Enviando dados para o Supabase:");
    Serial.println(json);

    int resposta = http.POST(json);

    Serial.print("Resposta da API: ");
    Serial.println(resposta);

    String retorno = http.getString();
    Serial.println(retorno);

    http.end();
  } else {
    Serial.println("Falha ao iniciar requisicao HTTPS.");
  }
}

// Configuracao inicial
void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  conectarWiFi();

  Serial.println("\nSistema de monitoramento iniciado!");
}

// Loop principal
void loop() {
  if (millis() - ultimaLeitura >= INTERVALO) {
    ultimaLeitura = millis();

    float distancia = medirDistancia();

    if (distancia < 0 || distancia > 100) {
      Serial.println("ERRO: leitura invalida do sensor.");
      return;
    }

    float nivel = calcularNivel(distancia);

    Serial.println("\n===== RESERVATORIO =====");

    Serial.print("Distancia: ");
    Serial.print(distancia);
    Serial.println(" cm");

    Serial.print("Nivel de agua: ");
    Serial.print(nivel);
    Serial.println("%");

    if (nivel < LIMITE_ALERTA) {
      Serial.println("ALERTA: NIVEL BAIXO!");
    } else {
      Serial.println("Situacao: NORMAL");
    }

    enviarParaAPI(distancia, nivel);

    Serial.println("========================");
  }
}
