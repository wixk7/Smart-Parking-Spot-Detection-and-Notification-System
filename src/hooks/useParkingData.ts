import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ParkingSlot } from '../types/parking';

export function useParkingData() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();

    const slotsChannel = supabase
      .channel('parking-slots-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_slots',
        },
        (payload) => {
          console.log('Realtime event received:', payload);
          if (payload.eventType === 'UPDATE') {
            setSlots((currentSlots) =>
              currentSlots.map((slot) =>
                slot.id === payload.new.id ? (payload.new as ParkingSlot) : slot
              )
            );

            const slot = payload.new as ParkingSlot;
            if (slot.is_occupied) {
              setLastEvent(`Car entered and parked in slot ${slot.id}`);
            } else {
              setLastEvent(`Car exited from slot ${slot.id}`);
            }
          }
        }
      )
      .subscribe((status, err) => {
        console.log('Subscription status:', status);
        if (err) {
          console.error('Subscription error:', err);
        }
      });

    const interval = setInterval(() => {
      fetchSlots();
    }, 2000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(slotsChannel);
    };
  }, []);

  async function fetchSlots() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('parking_slots')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError) throw fetchError;

      setSlots(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parking data');
    } finally {
      setLoading(false);
    }
  }

  const occupiedCount = slots.filter((slot) => slot.is_occupied).length;
  const availableCount = slots.length - occupiedCount;

  return {
    slots,
    loading,
    error,
    occupiedCount,
    availableCount,
    totalCount: slots.length,
    lastEvent,
  };
}
