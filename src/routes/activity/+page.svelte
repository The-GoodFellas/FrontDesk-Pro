<script>
  let bookings = [];
  let activity = [];
  let loading = true;

  async function loadData() {
    loading = true;
    try {
      const [bRes, aRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/activity')
      ]);
      const bJson = await bRes.json();
      const aJson = await aRes.json();
      bookings = bJson.bookings || [];
      activity = aJson.activity || [];
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  loadData();
</script>

<main class="flex flex-col">
  <div class="max-w-6xl mx-auto w-full p-6">
    <h1 class="text-2xl font-semibold mb-4">Activity</h1>
    {#if loading}
      <div>Loading...</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section class="bg-white p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-2">Recent Bookings</h2>
          <ul class="space-y-2">
            {#each bookings as b}
              <li class="text-sm text-gray-700 border rounded p-2">
                Room {b.room_number} • {b.guest_name} • {b.check_in_date} → {b.check_out_date} • {b.created_at}
              </li>
            {/each}
            {#if bookings.length === 0}
              <li class="text-sm text-gray-500">No bookings yet.</li>
            {/if}
          </ul>
        </section>
        <section class="bg-white p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-2">Room Activity</h2>
          <ul class="space-y-2">
            {#each activity as a}
              <li class="text-sm text-gray-700 border rounded p-2">
                Room {a.room_number} • {a.action} • by {a.actor_name} • {a.occurred_at}
              </li>
            {/each}
            {#if activity.length === 0}
              <li class="text-sm text-gray-500">No activity yet.</li>
            {/if}
          </ul>
        </section>
      </div>
    {/if}
  </div>
</main>
