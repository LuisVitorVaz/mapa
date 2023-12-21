import serial
import pyrebase
import time
from datetime import datetime

# Configuração do Firebase
config = {
    "apiKey": "AIzaSyCG6pcJI9JV8G6gW8F8HAhfEGJvw8vhXDY",
    "authDomain": "bancodedados-a7591.firebaseapp.com",
    "databaseURL": "https://bancodedados-a7591-default-rtdb.firebaseio.com",
    "projectId": "bancodedados-a7591",
    "storageBucket": "bancodedados-a7591.appspot.com",
    "messagingSenderId": "741882138538",
    "appId": "1:741882138538:web:ac252fba2cb841cc39e5d3",
    "measurementId": "G-6BRRPEZT5Y"
}

# Inicialize o Firebase
firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Abra a porta serial. Certifique-se de especificar a porta correta e a taxa de transmissão.
arduino_port = 'COM3'  # Substitua pela porta do seu Arduino
baud_rate = 9600

ser = serial.Serial(arduino_port, baud_rate, timeout=1)

# Variáveis para calcular a id
last_latitude = None
last_longitude = None
last_time = None

while True:
    # Tente ler uma linha da porta serial
    line = ser.readline().decode('utf-8').strip()

    # Se a linha começa com "Latitude:", assume-se que é uma leitura de latitude
    if line.startswith("Latitude:"):
        latitude = float(line.split(":")[1])

    # Se a linha começa com "Longitude:", assume-se que é uma leitura de longitude
    elif line.startswith("Longitude:"):
        longitude = float(line.split(":")[1])

        # Leitura de data e hora atual
        data_hora_atual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Calcula a id se houver coordenadas GPS anteriores
        id = 1

            # Exibe a id
        print(f"id: {id} ")
        print(f"data hora: {data_hora_atual}")
        print(f"longitude: {longitude}")
        print(f"latitude: {latitude} km/h")

            # Envia os dados para o Firebase
        data = {
          "id": id,
          "data_hora": data_hora_atual,
          "longitude": longitude,
          "latitude": latitude
            }
        db.child("dados").push(data)

        # Atualiza as variáveis para a próxima iteração
        last_latitude = latitude
        last_longitude = longitude
        last_time = datetime.now()

    # Outros dados recebidos do Arduino podem ser processados aqui

    time.sleep(1)  # Aguarde 1 segundo entre as leituras
