export interface ParkingSlot {
  id: number;
  is_occupied: boolean;
  car_id: string | null;
  occupied_at: string | null;
  updated_at: string;
}

export interface ParkingEvent {
  id: string;
  event_type: 'entry' | 'exit';
  slot_id: number | null;
  car_id: string | null;
  timestamp: string;
  current_count: number;
}
