<script>
    import OtherHeader from "../../components/OtherHeader.svelte";
    import { page } from '$app/stores';
    import { setRoomStatus } from '$lib/rooms.js';

    let confirmPrompt = false;
    let guestName = '';
    let roomNumber = '';
    let checkOutConfirmed = false;
    let currentStatus = null;
    let expectedName = '';
    let errorMessage = '';
    let allowFuzzy = false;

    $: roomNumber = $page.url.searchParams.get('room') || '';
    $: currentStatus = $page.url.searchParams.get('status') || null;

    function handleCheckOut() {
        errorMessage = '';
        expectedName = '';
        confirmPrompt = true;
        // fetch expected guest name for this room (if a booking exists for today)
        fetchExpectedGuestName();
    }

    async function fetchExpectedGuestName() {
        if (!roomNumber) return;
        try {
            const res = await fetch('/api/bookings');
            if (!res.ok) return;
            const data = await res.json();
            const booking = (data.bookings || []).find(b => String(b.room_number) === String(roomNumber) && new Date(b.check_in_date) <= new Date() && new Date(b.check_out_date) >= new Date());
            if (booking) expectedName = booking.guest_name;
        } catch (err) {
            // ignore silently
        }
    }

    function submitCheckOut() {
        if (roomNumber && currentStatus === 'Occupied' && guestName.trim()) {
            errorMessage = '';
            fetch('/api/check_out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_number: roomNumber, actor_name: guestName, allow_fuzzy: allowFuzzy })
            }).then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    errorMessage = data?.error || 'Failed to check out';
                    return;
                }
                setRoomStatus(roomNumber, 'Available');
                console.log(`Checked out guest: ${guestName} from room ${roomNumber}`);
                checkOutConfirmed = true;
                confirmPrompt = false;
                guestName = '';
                currentStatus = 'Available';
            }).catch((err) => {
                console.error(err);
                errorMessage = 'Network error while checking out';
            });
        }
    }
</script>

<main class="flex flex-col">
    <OtherHeader />
    <div class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
        <div class="flex-1 flex items-center justify-center p-8">
            <div class="bg-white rounded-lg shadow p-8 max-w-md w-full">
                <h1 class="text-2xl font-bold text-center mb-6">Check-Out for <span class="text-indigo-400"> Room {roomNumber}</span></h1>
                {#if checkOutConfirmed}
                    <div class="mb-4 p-4 bg-green-50 text-green-800 rounded">
                        Check-out confirmed for room {roomNumber}.
                    </div>
                {/if}
                
                <div class="space-y-4">
                    {#if !checkOutConfirmed && currentStatus === 'Occupied'}
                        <button 
                            class="w-full px-4 py-3 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            on:click={handleCheckOut}>
                            Check Out
                        </button>
                    {:else}
                        {#if !checkOutConfirmed}
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
                    <h2 class="text-xl font-bold mb-4">Confirm Check-Out</h2>
                    <p class="text-sm text-gray-700 mb-2">Confirm check-out for room {roomNumber}.</p>
                    <label class="block text-sm font-medium mb-1">Guest name</label>
                    <input 
                        type="text" 
                        placeholder="Enter guest name"
                        bind:value={guestName}
                        class="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        on:keydown={(e) => e.key === 'Enter' && submitCheckOut()}
                    />
                    <label class="flex items-center gap-2 text-sm mb-2">
                        <input type="checkbox" bind:checked={allowFuzzy} class="w-4 h-4" />
                        <span>Allow fuzzy match (partial / nickname)</span>
                    </label>
                    {#if expectedName}
                        <div class="mb-2 text-sm text-gray-600">Expected name: <strong class="text-gray-800">{expectedName}</strong></div>
                    {/if}
                    {#if errorMessage}
                        <div class="mb-3 p-3 bg-red-50 text-red-800 rounded border">{errorMessage}</div>
                    {/if}
                    <div class="flex gap-2">
                        <button 
                            class="flex-1 px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            on:click={() => { confirmPrompt = false; guestName = ''; }}>
                            Cancel
                        </button>
                        <button 
                            class="flex-1 px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            on:click={submitCheckOut} disabled={!guestName.trim()}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>
