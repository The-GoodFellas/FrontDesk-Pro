<script>
    import OtherHeader from "../../components/OtherHeader.svelte";
    import { page } from '$app/stores';
    import { setRoomStatus, findRoom } from '$lib/rooms.js';

    let guestName = '';
    let confirmPrompt = false;
    let roomNumber = '';
    let checkInConfirmed = false;
    let currentStatus = null;

    $: roomNumber = $page.url.searchParams.get('room') || '';
    $: currentStatus = (() => {
        const param = $page.url.searchParams.get('status');
        if (param) return param;
        const local = roomNumber ? (findRoom(roomNumber)?.status || null) : null;
        return local;
    })();

    // Ensure we use live status if needed
    async function refreshStatus() {
        if (!roomNumber) return;
        try {
            const res = await fetch('/api/rooms');
            if (!res.ok) return;
            const data = await res.json();
            const r = (data.rooms || []).find(r => String(r.number) === String(roomNumber));
            if (r) currentStatus = r.status;
        } catch {}
    }

    refreshStatus();

    function handleCheckIn() {
        confirmPrompt = true;
    }

    function submitCheckIn() {
        if (guestName.trim() && roomNumber) {
            fetch('/api/check_in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_number: roomNumber, actor_name: guestName })
            }).then(async (res) => {
                if (!res.ok) throw new Error('Failed to check in');
                await res.json();
                setRoomStatus(roomNumber, 'Occupied');
                currentStatus = 'Occupied';
                console.log(`Checked in guest: ${guestName} for room ${roomNumber}`);
                guestName = '';
                confirmPrompt = false;
                checkInConfirmed = true;
            }).catch((err) => console.error(err));
        }
    }
</script>

<main class="flex flex-col">
    <OtherHeader />
    
    <div class="flex-1 flex items-center justify-center p-8">
        <div class="bg-white rounded-lg shadow p-8 max-w-md w-full">
            <h1 class="text-2xl font-bold text-center mb-6">Check-In for <span class="text-indigo-400"> Room {roomNumber}</span></h1>
            {#if checkInConfirmed}
                <div class="mb-4 p-4 bg-green-50 text-green-800 rounded">
                    Check-in confirmed for room {roomNumber}.
                </div>
            {/if}
            
            <div class="space-y-4">
                {#if !checkInConfirmed && currentStatus !== 'Occupied'}
                    <button 
                        class="w-full px-4 py-3 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        on:click={handleCheckIn}>
                        Check In
                    </button>
                {:else}
                    {#if !checkInConfirmed}
                        <div class="p-3 bg-gray-50 text-gray-700 rounded border">
                            This room is currently {currentStatus}.
                        </div>
                    {/if}
                {/if}

                <a href="/rooms" class="block w-full">
                    <button 
                        class="w-full px-4 py-3 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">
                        Back to Rooms
                    </button>
                </a>
            </div>
        </div>

        {#if confirmPrompt}
            <div class="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg shadow p-6 max-w-sm w-full mx-4">
                    <h2 class="text-xl font-bold mb-2">Confirm Check-In</h2>
                    <p class="text-sm text-gray-700 mb-2">Confirm check-in for room {roomNumber}.</p>
                    <label class="block text-sm font-medium mb-1">Guest name</label>
                    <input 
                        type="text" 
                        placeholder="Enter guest name"
                        bind:value={guestName}
                        class="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        on:keydown={(e) => e.key === 'Enter' && submitCheckIn()}
                    />
                    <div class="flex gap-2">
                        <button 
                            class="flex-1 px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            on:click={() => { confirmPrompt = false; guestName = ''; }}>
                            Cancel
                        </button>
                        <button 
                            class="flex-1 px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            on:click={submitCheckIn} disabled={!guestName.trim()}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>