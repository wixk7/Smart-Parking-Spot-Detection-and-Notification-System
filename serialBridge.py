import serial
import requests
import time

# Configuration
ARDUINO_PORT = 'COM3'  # Change to your Arduino port (COM3, COM4, etc. on Windows or /dev/ttyUSB0 on Linux)
BAUD_RATE = 9600
BOLT_DATABASE_URL = "https://lprorrsfydotpzfjdsfh.supabase.co"
EDGE_FUNCTION_URL = f"{BOLT_DATABASE_URL}/functions/v1/parking-event"

# Connect to Arduino
print(f"Connecting to Arduino on {ARDUINO_PORT}...")
ser = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=1)
time.sleep(2)  # Wait for Arduino to initialize

current_count = 0
print("Listening for Arduino events...")

while True:
    try:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            print(f"Received: {line}")
            
            if line == "ENTRY":
                current_count += 1
                response = requests.post(EDGE_FUNCTION_URL, json={
                    "eventType": "entry",
                    "currentCount": current_count
                })
                print(f"✓ Entry sent - Count: {current_count} - Response: {response.json()}")
                
            elif line == "EXIT":
                current_count -= 1
                response = requests.post(EDGE_FUNCTION_URL, json={
                    "eventType": "exit",
                    "currentCount": current_count
                })
                print(f"✓ Exit sent - Count: {current_count} - Response: {response.json()}")
                
            elif line == "READY":
                print("Arduino is ready!")
                
    except KeyboardInterrupt:
        print("\nStopping...")
        ser.close()
        break
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(1)
