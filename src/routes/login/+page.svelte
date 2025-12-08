<script>
  import { onMount } from 'svelte';
  let username = '';
  let password = '';
  let error = '';

  async function submit(e) {
    e.preventDefault();
    error = '';
    const res = await fetch('/api/auth?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!data.ok) {
      error = data.error || 'Login failed';
    } else {
      window.location.href = '/rooms';
    }
  }
</script>

<div class="max-w-sm mx-auto mt-12 p-6 border rounded">
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  {#if error}
  <p class="text-red-600 mb-2">{error}</p>
  {/if}
  <form on:submit={submit}>
    <label class="block mb-2">
      <span class="text-sm">Username</span>
      <input class="w-full border rounded p-2" bind:value={username} required />
    </label>
    <label class="block mb-4">
      <span class="text-sm">Password</span>
      <input type="password" class="w-full border rounded p-2" bind:value={password} required />
    </label>
    <button
      type="submit"
      class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      Login
    </button>
  </form>
</div>