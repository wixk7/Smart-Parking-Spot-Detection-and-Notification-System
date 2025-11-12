import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { eventType, currentCount } = await req.json();

    if (!eventType || currentCount === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing eventType or currentCount' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (eventType === 'entry') {
      // Find a random available slot
      const { data: availableSlots, error: fetchError } = await supabase
        .from('parking_slots')
        .select('id')
        .eq('is_occupied', false);

      if (fetchError) throw fetchError;

      if (!availableSlots || availableSlots.length === 0) {
        // Log entry attempt even if lot is full
        await supabase.from('parking_events').insert({
          event_type: 'entry',
          slot_id: null,
          car_id: null,
          current_count: currentCount,
        });

        return new Response(
          JSON.stringify({ message: 'Parking lot full', currentCount }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Randomly select an available slot
      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const carId = `CAR-${Date.now()}`;

      // Update the slot as occupied
      const { error: updateError } = await supabase
        .from('parking_slots')
        .update({
          is_occupied: true,
          car_id: carId,
          occupied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', randomSlot.id);

      if (updateError) throw updateError;

      // Log the entry event
      const { error: eventError } = await supabase.from('parking_events').insert({
        event_type: 'entry',
        slot_id: randomSlot.id,
        car_id: carId,
        current_count: currentCount,
      });

      if (eventError) throw eventError;

      return new Response(
        JSON.stringify({
          message: 'Car entered',
          slotId: randomSlot.id,
          carId,
          currentCount,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (eventType === 'exit') {
      // Find a random occupied slot to free
      const { data: occupiedSlots, error: fetchError } = await supabase
        .from('parking_slots')
        .select('id, car_id')
        .eq('is_occupied', true);

      if (fetchError) throw fetchError;

      if (!occupiedSlots || occupiedSlots.length === 0) {
        // Log exit attempt even if lot is empty
        await supabase.from('parking_events').insert({
          event_type: 'exit',
          slot_id: null,
          car_id: null,
          current_count: currentCount,
        });

        return new Response(
          JSON.stringify({ message: 'Parking lot empty', currentCount }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Randomly select an occupied slot to free
      const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];

      // Update the slot as vacant
      const { error: updateError } = await supabase
        .from('parking_slots')
        .update({
          is_occupied: false,
          car_id: null,
          occupied_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', randomSlot.id);

      if (updateError) throw updateError;

      // Log the exit event
      const { error: eventError } = await supabase.from('parking_events').insert({
        event_type: 'exit',
        slot_id: randomSlot.id,
        car_id: randomSlot.car_id,
        current_count: currentCount,
      });

      if (eventError) throw eventError;

      return new Response(
        JSON.stringify({
          message: 'Car exited',
          slotId: randomSlot.id,
          carId: randomSlot.car_id,
          currentCount,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid event type. Use "entry" or "exit"' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
