import { Car, ParkingCircle, Activity } from 'lucide-react';

interface StatsPanelProps {
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  lastEvent: string | null;
}

export function StatsPanel({ totalSlots, occupiedSlots, availableSlots, lastEvent }: StatsPanelProps) {
  const occupancyRate = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <ParkingCircle className="w-6 h-6 text-blue-400" />
          <h3 className="text-gray-400 text-sm font-medium">Total Slots</h3>
        </div>
        <p className="text-3xl font-bold text-white">{totalSlots}</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <Car className="w-6 h-6 text-red-400" />
          <h3 className="text-gray-400 text-sm font-medium">Occupied</h3>
        </div>
        <p className="text-3xl font-bold text-red-400">{occupiedSlots}</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <ParkingCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-gray-400 text-sm font-medium">Available</h3>
        </div>
        <p className="text-3xl font-bold text-green-400">{availableSlots}</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-yellow-400" />
          <h3 className="text-gray-400 text-sm font-medium">Occupancy Rate</h3>
        </div>
        <p className="text-3xl font-bold text-white">{occupancyRate.toFixed(0)}%</p>
      </div>

      {lastEvent && (
        <div className="col-span-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-blue-400">Last Event:</span> {lastEvent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
