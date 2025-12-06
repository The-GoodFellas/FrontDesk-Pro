<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let reservedRanges = [];
  export let monthDate = new Date();
  export let selectedDate = null;

  function prevMonth() {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    monthDate = new Date(y, m - 1, 1);
  }

  function nextMonth() {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    monthDate = new Date(y, m + 1, 1);
  }

  function startOfMonth(d) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
  function endOfMonth(d) { const x = new Date(d.getFullYear(), d.getMonth()+1, 0); x.setHours(23,59,59,999); return x; }
  function isReserved(date) {
    for (const r of reservedRanges) {
      const s = new Date(r.check_in_date);
      const e = new Date(r.check_out_date);
      if (date >= s && date < e) return true;
    }
    return false;
  }

  $: start = startOfMonth(monthDate);
  $: end = endOfMonth(monthDate);
  $: firstWeekday = start.getDay();
  $: days = end.getDate();
  $: grid = [];
  $: {
    grid = [];
    for (let i=0;i<firstWeekday;i++) grid.push(null);
    for (let d=1; d<=days; d++) grid.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d));
    while (grid.length % 7 !== 0) grid.push(null);
  }
</script>

<div class="mini-month">
  <div class="flex items-center justify-between mb-1">
    <button class="px-1 py-0.5 text-[11px] rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" on:click={prevMonth} aria-label="Previous month">◀</button>
    <div class="text-xs font-semibold text-gray-700">{monthDate.toLocaleString(undefined, { month: 'short' })} {monthDate.getFullYear()}</div>
    <button class="px-1 py-0.5 text-[11px] rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" on:click={nextMonth} aria-label="Next month">▶</button>
  </div>
  <div class="grid grid-cols-7 gap-0.5 text-center text-[10px] text-gray-500 mb-1">
    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
  </div>
  <div class="grid grid-cols-7 gap-0.5">
    {#each grid as cell}
      {#if cell === null}
        <div class="h-5"></div>
      {:else}
        {#if isReserved(cell)}
          <div class="h-5 flex items-center justify-center rounded text-[11px] bg-gray-200 text-gray-400 cursor-not-allowed" title="Reserved">
            {cell.getDate()}
          </div>
        {:else}
          <button class="h-5 w-full flex items-center justify-center rounded text-[11px] bg-white text-gray-700 hover:bg-indigo-50"
                  class:bg-indigo-100={selectedDate && (new Date(selectedDate)).toDateString() === cell.toDateString()}
                  on:click={() => dispatch('pick', cell)}>
            {cell.getDate()}
          </button>
        {/if}
      {/if}
    {/each}
  </div>
  <div class="mt-1 flex items-center gap-2 text-[10px] text-gray-600">
    <span class="inline-block w-3 h-3 rounded bg-gray-200 border border-gray-300"></span> Reserved
  </div>
</div>

<style>
</style>