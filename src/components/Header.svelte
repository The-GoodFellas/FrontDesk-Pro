<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    let user;
    $effect(() => {
        user = $page.data?.user || null;
    });

    async function logout() {
        try {
            await fetch('/api/auth?action=logout', { method: 'POST' });
        } catch (_) {}
        goto('/');
    }
</script>

<header class="flex flex-col relative z-20">
    <div class="max-w-[1900px] mx-auto w-full flex justify-between py-6 px-4 lg:px-6">
        <a href="/">
            <h1
            class="font-semibold">
            FrontDesk&nbsp;<span 
            class="text-indigo-400">Pro</span>
            </h1>
        </a>
        <button class="md:hidden grid place-items-center" aria-label="Menu">
            <i class="fa-solid fa-bars"></i>
        </button>
        <nav class="hidden md:flex items-center gap-4 lg:gap-6">
                     {#if !user}
                         <a href="/login" class="duration-200 hover:text-indigo-400 cursor-pointer">Login</a>
                     {:else}
                         <span class="text-sm text-gray-600">{user.username}</span>
                         <a href="/" on:click|preventDefault={logout} class="duration-200 hover:text-indigo-400 cursor-pointer">Logout</a>
                     {/if}
        </nav>
    </div>
</header>