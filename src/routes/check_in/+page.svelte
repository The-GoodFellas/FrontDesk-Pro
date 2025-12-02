<script>
    import OtherHeader from "../../components/OtherHeader.svelte";
    import { page } from '$app/stores';

    let guestName = '';
    let showNamePrompt = false;

    function handleCheckIn() {
        showNamePrompt = true;
    }

    function submitCheckIn() {
        if (guestName.trim()) {
            // Here you can add logic to process the check-in
            console.log(`Checked in guest: ${guestName}`);
            guestName = '';
            showNamePrompt = false;
        }
    }
</script>

<main class="flex flex-col">
    <OtherHeader />
    
    <div class="flex-1 flex items-center justify-center p-8">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 class="text-2xl font-bold text-center mb-6">Check-In</h1>
            
            <div class="space-y-4">
                <button 
                    class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded transition-colors"
                    on:click={handleCheckIn}>
                    Check In
                </button>
                
                <a href="/rooms" class="block w-full">
                    <button 
                        class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded transition-colors">
                        Back to Rooms
                    </button>
                </a>
            </div>
        </div>

        {#if showNamePrompt}
            <div class="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center">
                <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                    <h2 class="text-xl font-bold mb-4">Guest Name</h2>
                    <input 
                        type="text" 
                        placeholder="Enter guest name"
                        bind:value={guestName}
                        class="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        on:keydown={(e) => e.key === 'Enter' && submitCheckIn()}
                    />
                    <div class="flex gap-2">
                        <button 
                            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                            on:click={() => { showNamePrompt = false; guestName = ''; }}>
                            Cancel
                        </button>
                        <button 
                            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                            on:click={submitCheckIn}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</main>