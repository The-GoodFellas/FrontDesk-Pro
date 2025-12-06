<script>
    let rooms = [];
    let loading = true;
    let showPrompt = false;
    let promptRoom = null;
    let acting = false;
    
    async function loadRooms() {
        loading = true;
        try {
            const res = await fetch('/api/rooms');
            const data = await res.json();
            rooms = data.rooms || [];
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    }
    
    loadRooms();

    let statusFilter = 'all'; // e.g., 'Available', 'Occupied', 'Reserved', or 'all'
    let typeFilter = null; // 'Single', 'Double', 'Suite', or null
    let priceSort = null; // 'asc', 'desc', or null

    function setTypeFilter(type) {
        typeFilter = type;
    }

    function setStatusFilter(status) {
        statusFilter = status;
    }

    function togglePriceSort() {
        if (priceSort === null) priceSort = 'desc';
        else if (priceSort === 'desc') priceSort = 'asc';
        else priceSort = null;
    }

    function onRoomClick(e, room) {
        // For reserved or occupied rooms, intercept and show action prompt
        if (room.status === 'Reserved' || room.status === 'Occupied') {
            e.preventDefault();
            promptRoom = room;
            showPrompt = true;
        }
    }

    async function proceedCheckIn() {
        if (!promptRoom) return;
        const url = `/check_in?room=${promptRoom.number}&status=${encodeURIComponent(promptRoom.status)}`;
        window.location.href = url;
    }

    async function proceedCheckOut() {
        if (!promptRoom) return;
        const url = `/check_out?room=${promptRoom.number}&status=${encodeURIComponent(promptRoom.status)}`;
        window.location.href = url;
    }

    async function scheduleFutureBooking() {
        if (!promptRoom) return;
        const url = `/reservations?room=${promptRoom.number}&status=Available`;
        window.location.href = url;
    }

    async function cancelReservation() {
        if (!promptRoom) return;
        acting = true;
        try {
            const res = await fetch('/api/cancel_reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_number: String(promptRoom.number), actor_name: 'Admin' })
            });
            if (!res.ok) {
                console.error('Cancel failed', await res.text());
            }
            await loadRooms();
            showPrompt = false;
            promptRoom = null;
        } catch (e) {
            console.error(e);
        } finally {
            acting = false;
        }
    }

    $: filteredRooms = rooms.filter(room =>
    (statusFilter === 'all' || room.status === statusFilter) &&
    (!typeFilter || room.type.toLowerCase() === typeFilter?.toLowerCase())
);

$: sortedRooms = priceSort
    ? [...filteredRooms].sort((a, b) => {
        const priceA = parseInt(a.price.replace('$', ''));
        const priceB = parseInt(b.price.replace('$', ''));
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
    })
    : filteredRooms;
</script>

<div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto flex gap-6">
        <!-- Left side buttons - Status filters -->
        <div class="w-48 space-y-4 mt-[4.5rem]">
            <button 
                class="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => setStatusFilter('all')}>
                All Rooms
            </button>
            <button 
                class="w-full bg-white hover:bg-green-50 text-green-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => setStatusFilter('Available')}>
                Available
            </button>
            <button 
                class="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => setStatusFilter('Occupied')}>
                Occupied
            </button>
            <button 
                class="w-full bg-white hover:bg-purple-50 text-purple-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => setStatusFilter('Reserved')}>
                Reserved
            </button>
        </div>

        <!-- Center and right section -->
        <div class="flex-1 flex flex-col">
            <!-- Sort by Price button -->
            <div class="flex justify-end mb-4 mr-60">
                <button 
                    class="text-gray-700 hover:text-indigo-600 font-semibold py-2 px-4 flex items-center gap-2"
                    on:click={togglePriceSort}>
                    Sort by Price 
                    {#if priceSort === 'desc'}
                        <i class="fa-solid fa-arrow-down"></i>
                    {:else if priceSort === 'asc'}
                        <i class="fa-solid fa-arrow-up"></i>
                    {/if}
                </button>
            </div>

            <div class="flex gap-6">
                <!-- Center scrollable box -->
                <div class="flex-1 bg-white rounded-lg shadow-lg p-6">
                    <div class="h-[calc(100vh-14rem)] overflow-y-auto pr-4">
                        {#if loading}
                            <div class="text-gray-600">Loading rooms...</div>
                        {/if}
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each sortedRooms as room}
                                <a href={room.status === 'Reserved' ? `/check_in?room=${room.number}&status=${encodeURIComponent(room.status)}` : room.status === 'Occupied' ? `/check_out?room=${room.number}&status=${encodeURIComponent(room.status)}` : `/reservations?room=${room.number}&status=${encodeURIComponent(room.status)}`} class="block p-4 border rounded-lg hover:shadow-md transition-shadow no-underline hover:no-underline" aria-label={`Open details for room ${room.number}`} on:click={(e) => onRoomClick(e, room)}>
                                    <h3 class="text-lg font-semibold">Room {room.number}</h3>
                                    <p class="text-sm text-gray-600">{room.type}</p>
                                    <p class="text-sm font-medium" class:text-green-600={room.status === "Available"} class:text-red-600={room.status === "Occupied"} class:text-purple-600={room.status === "Reserved"}>{room.status}</p>
                                    <p class="text-sm text-gray-800 mt-1">{room.price}/night</p>
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Right side buttons - Sort options -->
                <div class="w-48 space-y-4">
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => setTypeFilter(null)}>
                        All Types
                    </button>
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => setTypeFilter('single')}>
                        Single
                    </button>
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => setTypeFilter('double')}>
                        Double
                    </button>
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => setTypeFilter('suite')}>
                        Suite
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

{#if showPrompt}
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 class="text-xl font-semibold mb-2">Room {promptRoom?.number} is {promptRoom?.status}</h2>
            <p class="text-gray-600 mb-4">Choose an action to continue:</p>
            <div class="space-y-3">
                {#if promptRoom?.status === 'Reserved'}
                    <button class="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-semibold py-2 px-4 rounded shadow" on:click={proceedCheckIn} disabled={acting}>
                        Check In
                    </button>
                {/if}
                {#if promptRoom?.status === 'Occupied'}
                    <button class="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-2 px-4 rounded shadow" on:click={proceedCheckOut} disabled={acting}>
                        Check Out
                    </button>
                {/if}
                <button class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow" on:click={scheduleFutureBooking} disabled={acting}>
                    Book for a Future Date
                </button>
                {#if promptRoom?.status === 'Reserved'}
                    <button class="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-2 px-4 rounded shadow" on:click={cancelReservation} disabled={acting}>
                        {acting ? 'Cancelling…' : 'Cancel Reservation'}
                    </button>
                {/if}
                <button class="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded shadow" on:click={() => { showPrompt = false; promptRoom = null; }} disabled={acting}>
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}