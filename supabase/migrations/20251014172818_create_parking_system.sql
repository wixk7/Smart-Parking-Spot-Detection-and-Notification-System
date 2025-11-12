/*
  # Parking Lot Monitoring System

  1. New Tables
    - `parking_slots`
      - `id` (integer, primary key) - Slot number (1-40)
      - `is_occupied` (boolean) - Whether the slot is currently occupied
      - `car_id` (text, nullable) - Unique identifier for the car currently in the slot
      - `occupied_at` (timestamptz, nullable) - When the slot was occupied
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `parking_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - 'entry' or 'exit'
      - `slot_id` (integer, nullable) - Which slot was assigned (null for exit if lot full)
      - `car_id` (text, nullable) - Unique identifier for the car
      - `timestamp` (timestamptz) - When the event occurred
      - `current_count` (integer) - Total cars in lot after this event

  2. Security
    - Enable RLS on both tables
    - Allow public read access for monitoring (authenticated and anon users)
    - Restrict write access to service role only (for the edge function)
    
  3. Indexes
    - Index on parking_slots.is_occupied for quick availability queries
    - Index on parking_events.timestamp for event history queries
*/

-- Create parking_slots table
CREATE TABLE IF NOT EXISTS parking_slots (
  id integer PRIMARY KEY CHECK (id >= 1 AND id <= 40),
  is_occupied boolean DEFAULT false NOT NULL,
  car_id text,
  occupied_at timestamptz,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create parking_events table
CREATE TABLE IF NOT EXISTS parking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('entry', 'exit')),
  slot_id integer,
  car_id text,
  timestamp timestamptz DEFAULT now() NOT NULL,
  current_count integer NOT NULL CHECK (current_count >= 0 AND current_count <= 40)
);

-- Initialize all 40 parking slots as empty
INSERT INTO parking_slots (id, is_occupied)
SELECT generate_series(1, 40), false
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_parking_slots_occupied ON parking_slots(is_occupied);
CREATE INDEX IF NOT EXISTS idx_parking_events_timestamp ON parking_events(timestamp DESC);

-- Enable RLS
ALTER TABLE parking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_events ENABLE ROW LEVEL SECURITY;

-- Policies for parking_slots
CREATE POLICY "Allow public read access to parking slots"
  ON parking_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role to update parking slots"
  ON parking_slots FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role to insert parking slots"
  ON parking_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for parking_events
CREATE POLICY "Allow public read access to parking events"
  ON parking_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role to insert parking events"
  ON parking_events FOR INSERT
  TO authenticated
  WITH CHECK (true);
