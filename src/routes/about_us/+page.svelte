<script>
    import Footer from "../../components/Footer.svelte";


</script>

<main class="flex flex-col">
    

    <section class="max-w-5xl mx-auto w-full p-6">
        <div class="bg-white p-6 rounded shadow">
            <h1 class="text-3xl font-semibold text-indigo-400">About FrontDesk‑Pro</h1>
            <p class="mt-3 text-gray-700">FrontDesk‑Pro is a lightweight, modern front‑desk assistant for small hotels, lodges, and guesthouses. It streamlines daily operations so staff can focus on exceptional guest service.</p>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-4 rounded border shadow-sm bg-white">
                    <h2 class="text-lg font-semibold text-indigo-400">Simple Room Management</h2>
                    <p class="mt-2 text-sm text-gray-700">Quickly view room availability and update statuses (Available, Reserved, Occupied) in a click.</p>
                </div>
                <div class="p-4 rounded border shadow-sm bg-white">
                    <h2 class="text-lg font-semibold text-indigo-400">Fast Reservations</h2>
                    <p class="mt-2 text-sm text-gray-700">Create and confirm bookings with guest details, dates, and pricing—no heavy training required.</p>
                </div>
                <div class="p-4 rounded border shadow-sm bg-white">
                    <h2 class="text-lg font-semibold text-indigo-400">Streamlined Check‑In</h2>
                    <p class="mt-2 text-sm text-gray-700">Complete check‑ins smoothly, confirm guests, and automatically update room status to keep data accurate.</p>
                </div>
            </div>

            <div class="mt-8">
                <h2 class="text-xl font-semibold">Our Mission</h2>
                <p class="mt-2 text-gray-700">We believe front‑desk software should be fast, intuitive, and reliable. FrontDesk‑Pro removes friction from everyday tasks so teams can deliver hospitality that guests remember.</p>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 rounded border shadow-sm bg-white">
                    <h3 class="text-lg font-semibold text-indigo-400">Designed for Small Teams</h3>
                    <p class="mt-2 text-sm text-gray-700">Built with a clean interface and sensible defaults so anyone on shift can use it confidently.</p>
                </div>
                <div class="p-4 rounded border shadow-sm bg-white">
                    <h3 class="text-lg font-semibold text-indigo-400">Built for Speed</h3>
                    <p class="mt-2 text-sm text-gray-700">SvelteKit and Tailwind deliver a responsive experience across devices—desktop or tablet at the desk.</p>
                </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <a href="/contact_us" class="block">
                    <button class="px-4 py-2 rounded shadow-sm border border-indigo-400 text-grey-700 bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">Contact Us</button>
                </a>
            </div>
        </div>
    </section>
</main>
<Footer />