<script>
    let rooms = [
        { number: "101", status: "Available", type: "Single", price: "$100" },
        { number: "102", status: "Occupied", type: "Double", price: "$150" },
        { number: "103", status: "Available", type: "Suite", price: "$200" },
        { number: "104", status: "Reserved", type: "Single", price: "$100" },
        { number: "105", status: "Available", type: "Double", price: "$150" },
        { number: "106", status: "Reserved", type: "Suite", price: "$200" },
        { number: "107", status: "Occupied", type: "Single", price: "$100" },
        { number: "108", status: "Available", type: "Double", price: "$150" },
        { number: "109", status: "Occupied", type: "Suite", price: "$200" },
        { number: "110", status: "Available", type: "Single", price: "$100" },
        { number: "201", status: "Occupied", type: "Suite", price: "$200" },
        { number: "202", status: "Available", type: "Single", price: "$100" },
        { number: "203", status: "Reserved", type: "Double", price: "$150" },
        { number: "204", status: "Available", type: "Suite", price: "$200" },
        { number: "205", status: "Occupied", type: "Single", price: "$100" },
        { number: "206", status: "Reserved", type: "Double", price: "$150" },
        { number: "207", status: "Available", type: "Suite", price: "$200" },
        { number: "208", status: "Occupied", type: "Single", price: "$100" },
        { number: "209", status: "Reserved", type: "Double", price: "$150" },
        { number: "210", status: "Available", type: "Suite", price: "$200" },
        { number: "301", status: "Available", type: "Single", price: "$100" },
        { number: "302", status: "Occupied", type: "Double", price: "$150" },
        { number: "303", status: "Reserved", type: "Suite", price: "$200" },
        { number: "304", status: "Available", type: "Single", price: "$100" },
        { number: "305", status: "Occupied", type: "Double", price: "$150" },
        { number: "306", status: "Available", type: "Suite", price: "$200" },
        { number: "307", status: "Reserved", type: "Single", price: "$100" },
        { number: "308", status: "Available", type: "Double", price: "$150" },
        { number: "309", status: "Occupied", type: "Suite", price: "$200" },
        { number: "310", status: "Available", type: "Single", price: "$100" },
        { number: "401", status: "Reserved", type: "Double", price: "$150" },
        { number: "402", status: "Available", type: "Suite", price: "$200" },
        { number: "403", status: "Occupied", type: "Single", price: "$100" },
        { number: "404", status: "Available", type: "Double", price: "$150" },
        { number: "405", status: "Occupied", type: "Suite", price: "$200" },
        { number: "406", status: "Available", type: "Single", price: "$100" },
        { number: "407", status: "Occupied", type: "Double", price: "$150" },
        { number: "408", status: "Reserved", type: "Suite", price: "$200" },
        { number: "409", status: "Available", type: "Single", price: "$100" },
        { number: "410", status: "Occupied", type: "Double", price: "$150" },
        { number: "501", status: "Available", type: "Suite", price: "$200" },
        { number: "502", status: "Reserved", type: "Single", price: "$100" },
        { number: "503", status: "Available", type: "Double", price: "$150" },
        { number: "504", status: "Occupied", type: "Suite", price: "$200" },
        { number: "505", status: "Reserved", type: "Single", price: "$100" },
        { number: "506", status: "Available", type: "Double", price: "$150" },
        { number: "507", status: "Occupied", type: "Suite", price: "$200" },
        { number: "508", status: "Available", type: "Single", price: "$100" },
        { number: "509", status: "Reserved", type: "Double", price: "$150" },
        { number: "510", status: "Available", type: "Suite", price: "$200" },
    ];

    let priceSort = null; // null = no sort, 'asc' = ascending, 'desc' = descending

    function filterRooms(status) {
        // Filter functionality to be implemented
        console.log(`Filtering by ${status}`);
    }

    function sortRooms(sortBy) {
        // Sort functionality to be implemented
        console.log(`Sorting by ${sortBy}`);
    }

    function togglePriceSort() {
        if (priceSort === null) {
            priceSort = 'desc';
        } else if (priceSort === 'desc') {
            priceSort = 'asc';
        } else {
            priceSort = null;
        }
        console.log(`Sorting by price: ${priceSort}`);
    }
</script>

<div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto flex gap-6">
        <!-- Left side buttons - Status filters -->
        <div class="w-48 space-y-4 mt-[4.5rem]">
            <button 
                class="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => filterRooms('all')}>
                All Rooms
            </button>
            <button 
                class="w-full bg-white hover:bg-green-50 text-green-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => filterRooms('available')}>
                Available
            </button>
            <button 
                class="w-full bg-white hover:bg-red-50 text-red-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => filterRooms('occupied')}>
                Occupied
            </button>
            <button 
                class="w-full bg-white hover:bg-purple-50 text-purple-600 font-semibold py-2 px-4 rounded shadow"
                on:click={() => filterRooms('reserved')}>
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
                <div class="flex-1 bg-white rounded-lg shadow-lg p-6 ml-4">
                    <div class="h-[calc(100vh-14rem)] overflow-y-auto pr-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {#each rooms as room}
                                <div class="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <h3 class="text-lg font-semibold">Room {room.number}</h3>
                                    <p class="text-sm text-gray-600">{room.type}</p>
                                    <p class="text-sm font-medium" class:text-green-600={room.status === "Available"}
                                                                 class:text-red-600={room.status === "Occupied"}
                                                                 class:text-purple-600={room.status === "Reserved"}>
                                        {room.status}
                                    </p>
                                    <p class="text-sm text-gray-800 mt-1">{room.price}/night</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Right side buttons - Sort options -->
                <div class="w-48 space-y-4">
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => sortRooms('single')}>
                        Single
                    </button>
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => sortRooms('double')}>
                        Double
                    </button>
                    <button 
                        class="w-full bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 rounded shadow"
                        on:click={() => sortRooms('suite')}>
                        Suite
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>