const int PIN_SENSOR = A0;   // S del sensor de agua
const int PIN_POWER  = 7;    // + del sensor de agua
const int PIN_BUZZER = 8;    // buzzer

unsigned long tLectura = 0;  // ultima vez que se leyo el sensor
unsigned long tBuzzer  = 0;  // ultimo cambio del buzzer
bool buzzerOn = false;
int v = 0;

void setup() {
  pinMode(PIN_POWER, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  digitalWrite(PIN_POWER, HIGH);   // sensor siempre alimentado: respuesta inmediata
  digitalWrite(PIN_BUZZER, LOW);
  Serial.begin(9600);
}

void loop() {
  unsigned long ahora = millis();

  // ---- lectura cada 60 ms (unas 16 por segundo) ----
  if (ahora - tLectura >= 60) {
    tLectura = ahora;
    long s = 0;
    for (int i = 0; i < 5; i++) s += analogRead(PIN_SENSOR);
    v = s / 5;
    Serial.println(v);
  }

  // ---- buzzer en paralelo, sin frenar la lectura ----
  if (v < 300) {                       // copa vacia: silencio
    if (buzzerOn) { digitalWrite(PIN_BUZZER, LOW); buzzerOn = false; }
  } else {
    int pausa = map(constrain(v, 300, 650), 300, 650, 700, 70);
    if (buzzerOn && ahora - tBuzzer >= 40) {
      digitalWrite(PIN_BUZZER, LOW);  buzzerOn = false; tBuzzer = ahora;
    } else if (!buzzerOn && ahora - tBuzzer >= (unsigned long)pausa) {
      digitalWrite(PIN_BUZZER, HIGH); buzzerOn = true;  tBuzzer = ahora;
    }
  }
}
