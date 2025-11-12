import { Car } from 'lucide-react';
import type { ParkingSlot as ParkingSlotType } from '../types/parking';

interface ParkingSlotProps {
  slot: ParkingSlotType;
}

export function ParkingSlot({ slot }: ParkingSlotProps) {
  return (
    <div
      className={`relative aspect-square border-2 rounded-lg transition-all duration-500 flex flex-col items-center justify-center ${
        slot.is_occupied
          ? 'bg-red-900/30 border-red-500 shadow-lg shadow-red-500/20'
          : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
      }`}
    >
      <div className="text-xs text-gray-400 font-mono absolute top-1 left-2">
        {slot.id}
      </div>

      {slot.is_occupied ? (
        <div className="flex flex-col items-center gap-1 animate-fade-in">
          <Car className="w-8 h-8 text-red-400" />
          <div className="text-xs text-red-300 font-mono text-center px-1">
            {slot.car_id?.split('-')[1]?.slice(-6)}
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-2xl font-bold">
          {slot.id}
        </div>
      )}
    </div>
  );
}
