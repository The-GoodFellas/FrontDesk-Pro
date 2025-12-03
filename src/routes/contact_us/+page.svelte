<script>
    import OtherHeader from "../../components/OtherHeader.svelte";
    import Footer from "../../components/Footer.svelte";
    export let form;


</script>

<main class="flex flex-col">
    <OtherHeader />
    <section class="max-w-5xl mx-auto w-full p-6">
        <div class="bg-white p-6 rounded shadow">
            <h1 class="text-3xl font-semibold text-indigo-400">Contact Us</h1>

            {#if form?.success}
                <div class="mt-4 p-4 bg-green-50 text-green-800 rounded">
                    Thanks, your message has been sent.
                </div>
                <div class="mt-4">
                    <a href="/" class="inline-block">
                        <button class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">Go Home</button>
                    </a>
                </div>
            {:else}
                <p class="mt-3 text-gray-700">We’d love to hear from you. Send us a message and we’ll get back to you shortly.</p>
                <form method="post" class="mt-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium">Name</label>
                        <input name="name" type="text" class="mt-1 block w-full border rounded px-3 py-2" placeholder="Your name" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Email</label>
                        <input name="email" type="email" class="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Message</label>
                        <textarea name="message" rows="5" class="mt-1 block w-full border rounded px-3 py-2" placeholder="How can we help?" required />
                    </div>

                    <div class="flex gap-3">
                        <button
                            type="submit"
                            class="px-4 py-2 rounded shadow-sm border border-indigo-400 text-gray-700 bg-indigo-400 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >Send Message</button>
                        <a href="/" class="inline-block">
                            <button type="button" class="px-4 py-2 rounded shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">Cancel</button>
                        </a>
                    </div>
                </form>
            {/if}
        </div>
    </section>
</main>

<Footer />