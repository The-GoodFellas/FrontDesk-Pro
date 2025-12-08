<script>
    import MiniMonth from "../../components/MiniMonth.svelte";
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let selectedRoom = null;
    $: selectedRoom = $page.url.searchParams.get('room');
    import { findRoom } from '$lib/rooms.js';

    let selectedStatus = null;
    $: selectedStatus = $page.url.searchParams.get('status');

    $: selectedDetails = selectedRoom ? findRoom(selectedRoom) : null;

    // activeTab: 'list' | 'confirm'
    $: activeTab = selectedRoom ? 'confirm' : 'list';

    let confirmed = false;
    let guestName = '';
    let checkIn = '';
    let checkOut = '';
    let booking = null;
    let existingBookings = [];
    let loadingBookings = false;
    let showMiniIn = false;
    let showMiniOut = false;

    async function loadExistingBookings() {
        if (!selectedRoom) return;
        loadingBookings = true;
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            existingBookings = (data.bookings || []).filter(b => String(b.room_number) === String(selectedRoom));
        } catch (e) {
            console.error(e);
        } finally {
            loadingBookings = false;
        }
    }

    $: selectedRoom, loadExistingBookings();

    function overlapsExisting(ci, co) {
        if (!ci || !co) return false;
        const start = new Date(ci);
        const end = new Date(co);
        // Treat booking ranges as inclusive of check-in date and exclusive of check-out date
        for (const b of existingBookings) {
            const bStart = new Date(b.check_in_date);
            const bEnd = new Date(b.check_out_date);
            // overlap if start < bEnd and end > bStart
            if (start < bEnd && end > bStart) return true;
        }
        return false;
    }

    $: canConfirm = selectedStatus === 'Available' && guestName.trim().length > 0 && checkIn && checkOut && (new Date(checkIn) <= new Date(checkOut)) && !overlapsExisting(checkIn, checkOut);
    $: nights = (checkIn && checkOut) ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 0;
    $: nightly = selectedDetails ? parseInt(String(selectedDetails.price).replace(/[^0-9]/g, '')) || 0 : 0;
    $: total = nights > 0 ? `$${nightly * nights}` : null;

    function confirmBooking() {
        if (!canConfirm) return;
        // Persist booking via API
        fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room_number: selectedRoom,
                guest_name: guestName,
                check_in_date: checkIn,
                check_out_date: checkOut
            })
        }).then(async (res) => {
            if (!res.ok) throw new Error('Failed to create booking');
            const data = await res.json();
            booking = { id: data.id, room: selectedRoom, guestName, checkIn, checkOut };
            confirmed = true;
            // Reload bookings to update indicators
            loadExistingBookings();
        }).catch((err) => {
            console.error(err);
        });
    }
</script>

<main class="flex flex-col">
    <div class="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
        <div class="max-w-5xl mx-auto w-full p-6">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-semibold">Bookings</h1>
                <div class="flex gap-2">
                    <button class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200" on:click={() => goto('/rooms')}>Browse Rooms</button>            </div>
            </div>

            {#if activeTab === 'list'}
                <p class="text-sm text-gray-600">No room selected. Click a room on the Rooms page to start a booking.</p>
            {/if}

            {#if activeTab === 'confirm'}
                <div class="bg-white p-6 rounded shadow">
                    <h1 class="text-xl font-semibold">Confirm booking for <span class="text-indigo-400"> Room {selectedRoom}</span></h1>
                    <p class="mt-2 text-sm text-gray-600">Please confirm the booking details for the selected room.</p>

                    {#if selectedStatus !== 'Available'}
                        <div class="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded">This room is currently <strong>{selectedStatus}</strong> and cannot be booked.</div>
                        <div class="mt-4">
                            <button class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200" on:click={() => goto('/rooms')}>Back to Rooms</button>
                        </div>
                    {:else}
                        {#if confirmed}
                            <div class="mt-4 p-4 bg-green-50 text-green-800 rounded">
                                Booking confirmed for room {booking.room}.
                                <div class="text-sm text-gray-700 mt-2">Guest: {booking.guestName}<br />{booking.checkIn} → {booking.checkOut}</div>
                            </div>
                            <div class="mt-4 flex gap-3">
                                <button class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200" on:click={() => goto('/rooms')}>Back to Rooms</button>
                                <button class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200" on:click={() => goto('/reservations')}>Make Another Booking</button>
                            </div>
                        {:else}
                            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                <div class="md:col-span-2 space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium">Guest name</label>
                                        <input type="text" bind:value={guestName} class="mt-1 block w-full border rounded px-3 py-2" placeholder="Full name" />
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-sm font-medium">Check-in</label>
                                            <div class="flex items-center gap-2">
                                                <button type="button" class="mt-1 block w-full border-2 rounded px-3 py-2 border-black ring-1 ring-black text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-black focus:ring-1 text-left" on:click={() => { showMiniIn = !showMiniIn; }} aria-label="Open check-in calendar">
                                                    {checkIn ? checkIn : 'Select date'}
                                                </button>
                                            </div>
                                            {#if checkIn && checkOut && overlapsExisting(checkIn, checkOut)}
                                                <div class="mt-1 text-sm text-red-600">Selected dates overlap an existing reservation.</div>
                                            {/if}
                                            {#if showMiniIn}
                                                <div class="mt-2 relative">
                                                    <!-- Click-away overlay -->
                                                    <div class="fixed inset-0 z-10" on:click={() => { showMiniIn = false; }}></div>
                                                    <div class="absolute z-20 bg-white border rounded shadow p-3">
                                                        <MiniMonth reservedRanges={existingBookings} on:pick={(e) => { checkIn = e.detail.toISOString().slice(0,10); showMiniIn = false; }} />
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium">Check-out</label>
                                            <div class="flex items-center gap-2">
                                                <button type="button" class="mt-1 block w-full border-2 rounded px-3 py-2 border-black ring-1 ring-black text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-black focus:ring-1 text-left" on:click={() => { showMiniOut = !showMiniOut; }} aria-label="Open check-out calendar">
                                                    {checkOut ? checkOut : 'Select date'}
                                                </button>
                                            </div>
                                            {#if checkIn && checkOut && overlapsExisting(checkIn, checkOut)}
                                                <div class="mt-1 text-sm text-red-600">Selected dates overlap an existing reservation.</div>
                                            {/if}
                                            {#if showMiniOut}
                                                <div class="mt-2 relative">
                                                    <!-- Click-away overlay -->
                                                    <div class="fixed inset-0 z-10" on:click={() => { showMiniOut = false; }}></div>
                                                    <div class="absolute z-20 bg-white border rounded shadow p-3">
                                                        <MiniMonth reservedRanges={existingBookings} on:pick={(e) => { checkOut = e.detail.toISOString().slice(0,10); showMiniOut = false; }} />
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>

                                    <div class="mt-2">
                                        <label class="block text-sm font-medium">Reserved dates for this room</label>
                                        {#if loadingBookings}
                                            <div class="text-sm text-gray-600">Loading reservations…</div>
                                        {:else if existingBookings.length === 0}
                                            <div class="text-sm text-gray-600">No future reservations.</div>
                                        {:else}
                                            <ul class="text-sm text-gray-700 list-disc pl-5">
                                                {#each existingBookings as b}
                                                    <li>{b.check_in_date} to {b.check_out_date}</li>
                                                {/each}
                                            </ul>
                                        {/if}
                                        {#if overlapsExisting(checkIn, checkOut)}
                                            <div class="mt-2 p-2 bg-red-50 text-red-700 rounded">Selected dates overlap an existing reservation.</div>
                                        {/if}
                                    </div>
                                </div>

                                <aside class="md:col-span-1 bg-white p-4 rounded border shadow-sm">
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-600">Price</label>
                                            {#if selectedDetails}
                                                <div class="mt-1 text-lg font-semibold text-gray-900">{selectedDetails.price}</div>
                                            {:else}
                                                <div class="mt-1 text-sm text-gray-700">See room listing</div>
                                            {/if}
                                        </div>

                                        <div class="pt-2 border-t">
                                            <label class="block text-sm font-medium text-gray-600">Type</label>
                                            <div class="mt-1 text-lg font-semibold text-gray-900">{selectedDetails ? selectedDetails.type : '-'}</div>
                                        </div>

                                        {#if nights > 0}
                                            <div class="pt-3 border-t">
                                                <div class="text-sm text-gray-600">Nights: <span class="font-medium text-gray-800">{nights}</span></div>
                                                <div class="text-sm text-gray-600">Total: <span class="font-semibold text-gray-900">{total}</span></div>
                                            </div>
                                        {/if}
                                    </div>
                                </aside>
                            </div>

                            <div class="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    on:click={confirmBooking}
                                    disabled={!canConfirm}
                                    aria-label="Confirm booking"
                                >
                                    Confirm Booking
                                </button>

                                <button
                                    type="button"
                                    class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    on:click={() => goto('/rooms')}
                                >
                                    Cancel
                                </button>
                            </div>
                            {#if !canConfirm}
                                <p class="mt-2 text-sm text-red-600">Please enter guest name and valid check-in/out dates (check-in ≤ check-out), and avoid overlapping an existing reservation.</p>
                            {/if}
                        {/if}
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</main>