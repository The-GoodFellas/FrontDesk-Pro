<script>
    import { page } from '$app/stores';
    import { setRoomStatus, findRoom } from '$lib/rooms.js';

    let guestName = '';
    let confirmPrompt = false;
    let roomNumber = '';
    let checkInConfirmed = false;
    let currentStatus = null;
    let errorMessage = '';
    let allowFuzzy = false;
    let suggestions = [];

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
            errorMessage = '';
            suggestions = [];
            fetch('/api/check_in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_number: roomNumber, actor_name: guestName, allow_fuzzy: allowFuzzy })
            }).then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    errorMessage = data?.error || 'Failed to check in';
                    suggestions = data?.found || [];
                    return;
                }
                setRoomStatus(roomNumber, 'Occupied');
                currentStatus = 'Occupied';
                console.log(`Checked in guest: ${guestName} for room ${roomNumber}`);
                guestName = '';
                confirmPrompt = false;
                checkInConfirmed = true;
                suggestions = [];
            }).catch((err) => {
                console.error(err);
                errorMessage = 'Network error while checking in';
            });
        }
    }
</script>

<main class="flex flex-col">
    <div class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
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
        </div>

        {#if confirmPrompt}
            <div class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
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
                    <label class="flex items-center gap-2 text-sm mb-3">
                        <input type="checkbox" bind:checked={allowFuzzy} class="w-4 h-4" />
                        <span>Allow fuzzy match (partial / nickname)</span>
                    </label>
                    {#if errorMessage}
                        <div class="mb-3 p-3 bg-red-50 text-red-800 rounded border">{errorMessage}</div>
                        {#if suggestions && suggestions.length}
                            <div class="mt-2 text-sm text-gray-700">
                                <div class="font-medium mb-1">Did you mean:</div>
                                <ul class="space-y-1">
                                    {#each suggestions as s}
                                        <li>
                                            <button class="text-left w-full px-2 py-1 rounded hover:bg-gray-100" on:click={() => { guestName = s.guest_name || s; errorMessage = ''; suggestions = []; }}>
                                                {s.guest_name || (s.room_number ? `${s.guest_name}` : s)}
                                            </button>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    {/if}
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