<script>
    import OtherHeader from "../../components/OtherHeader.svelte";
    import { page } from '$app/stores';
    import { setRoomStatus, findRoom } from '$lib/rooms.js';

    let confirmPrompt = false;
    let guestName = '';
    let roomNumber = '';
    let checkOutConfirmed = false;
    $: currentStatus = roomNumber ? (findRoom(roomNumber)?.status || 'Available') : null;

    $: roomNumber = $page.url.searchParams.get('room') || '';

    function handleCheckOut() {
        confirmPrompt = true;
    }

    function submitCheckOut() {
        if (roomNumber && currentStatus === 'Occupied' && guestName.trim()) {
            setRoomStatus(roomNumber, 'Available');
            console.log(`Checked out guest: ${guestName} from room ${roomNumber}`);
            checkOutConfirmed = true;
            confirmPrompt = false;
            guestName = '';
        }
    }
</script>

<main class="flex flex-col">
    <OtherHeader />
    
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

        {#if confirmPrompt}
            <div class="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center">
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
