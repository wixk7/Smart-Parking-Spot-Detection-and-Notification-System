import { ParkingSlot } from './components/ParkingSlot';
import { StatsPanel } from './components/StatsPanel';
import { useParkingData } from './hooks/useParkingData';
import { ParkingCircle } from 'lucide-react';

function App() {
  const { slots, loading, error, occupiedCount, availableCount, totalCount, lastEvent } =
    useParkingData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading parking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="bg-gray-900 border border-red-500/30 rounded-lg p-6 max-w-md shadow-lg">
          <p className="text-red-400 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ParkingCircle className="w-10 h-10 text-gray-300" />
            <h1 className="text-4xl font-bold text-gray-100">Parking Lot Monitor</h1>
          </div>
          <p className="text-gray-400 text-sm">Real-time parking space tracking system</p>
        </div>

        {/* Stats Panel */}
        <div className="mb-6">
          <StatsPanel
            totalSlots={totalCount}
            occupiedSlots={occupiedCount}
            availableSlots={availableCount}
            lastEvent={lastEvent}
          />
        </div>

        {/* Parking Spaces */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Parking Spaces</h2>
          <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {slots.map((slot) => (
              <ParkingSlot key={slot.id} slot={slot} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-900 border-2 border-red-500 rounded"></div>
              <span className="text-gray-300">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 border-2 border-gray-500 rounded"></div>
              <span className="text-gray-300">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
