  // // Parking Lot Counter using two Ultrasonic Sensors
  // // Entry Sensor: TRIG 9, ECHO 8
  // // Exit Sensor:  TRIG 7, ECHO 6

  // #define ENTRY_TRIG 9
  // #define ENTRY_ECHO 8
  // #define EXIT_TRIG 7
  // #define EXIT_ECHO 6

  // const int totalSlots = 40;     // Total parking spaces
  // int currentCount = 0;          // Number of vehicles currently parked

  // // Threshold distance (in cm) to detect a car
  // const int detectThreshold = 5;

  // // To prevent double counting
  // bool entryDetected = false;
  // bool exitDetected = false;

  // long getDistance(int trigPin, int echoPin) {
  //   digitalWrite(trigPin, LOW);
  //   delayMicroseconds(2);
  //   digitalWrite(trigPin, HIGH);
  //   delayMicroseconds(10);
  //   digitalWrite(trigPin, LOW);
    
  //   long duration = pulseIn(echoPin, HIGH, 30000); // timeout 30ms
  //   long distance = duration * 0.034 / 2;
  //   return distance;
  // }

  // void setup() {
  //   Serial.begin(9600);
    
  //   pinMode(ENTRY_TRIG, OUTPUT);
  //   pinMode(ENTRY_ECHO, INPUT);
  //   pinMode(EXIT_TRIG, OUTPUT);
  //   pinMode(EXIT_ECHO, INPUT);

  //   Serial.println("Parking Counter Initialized");
  //   Serial.print("Available Slots: ");
  //   Serial.println(totalSlots - currentCount);
  // }

  // void loop() {
  //   long entryDistance = getDistance(ENTRY_TRIG, ENTRY_ECHO);
  //   long exitDistance = getDistance(EXIT_TRIG, EXIT_ECHO);

  //   // Entry Detection
  //   if (entryDistance > 0 && entryDistance < detectThreshold && !entryDetected) {
  //     if (currentCount < totalSlots) {
  //       currentCount++;
  //       Serial.print("Car Entered | Count: ");
  //       Serial.println(currentCount);
  //       Serial.print("Available Slots: ");
  //       Serial.println(totalSlots - currentCount);
  //     } else {
  //       Serial.println("Parking Full! Cannot Enter.");
  //     }
  //     entryDetected = true;
  //   }

  //   // Reset entry detection when object moves away
  //   if (entryDistance > detectThreshold + 5) {
  //     entryDetected = false;
  //   }

  //   // Exit Detection
  //   if (exitDistance > 0 && exitDistance < detectThreshold && !exitDetected) {
  //     if (currentCount > 0) {
  //       currentCount--;
  //       Serial.print("Car Exited  | Count: ");
  //       Serial.println(currentCount);
  //       Serial.print("Available Slots: ");
  //       Serial.println(totalSlots - currentCount);
  //     } else {
  //       Serial.println("Lot Empty! No car to exit.");
  //     }
  //     exitDetected = true;
  //   }

  //   // Reset exit detection when object moves away
  //   if (exitDistance > detectThreshold + 5) {
  //     exitDetected = false;
  //   }

  //   delay(200); // small delay for stability
  // }






// Simplified Parking Counter - Sends ENTRY/EXIT via Serial
#define ENTRY_TRIG 9
#define ENTRY_ECHO 8
#define EXIT_TRIG 7
#define EXIT_ECHO 6

const int totalSlots = 40;
int currentCount = 0;
const int detectThreshold = 5;

bool entryDetected = false;
bool exitDetected = false;

long getDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH, 30000);
  long distance = duration * 0.034 / 2;
  return distance;
}

void setup() {
  Serial.begin(9600);
  
  pinMode(ENTRY_TRIG, OUTPUT);
  pinMode(ENTRY_ECHO, INPUT);
  pinMode(EXIT_TRIG, OUTPUT);
  pinMode(EXIT_ECHO, INPUT);

  Serial.println("READY");
}

void loop() {
  long entryDistance = getDistance(ENTRY_TRIG, ENTRY_ECHO);
  long exitDistance = getDistance(EXIT_TRIG, EXIT_ECHO);

  // Entry Detection
  if (entryDistance > 0 && entryDistance < detectThreshold && !entryDetected) {
    if (currentCount < totalSlots) {
      currentCount++;
      Serial.println("ENTRY");
    }
    entryDetected = true;
  }

  if (entryDistance > detectThreshold + 5) {
    entryDetected = false;
  }

  // Exit Detection
  if (exitDistance > 0 && exitDistance < detectThreshold && !exitDetected) {
    if (currentCount > 0) {
      currentCount--;
      Serial.println("EXIT");
    }
    exitDetected = true;
  }

  if (exitDistance > detectThreshold + 5) {
    exitDetected = false;
  }

  delay(200);
}
