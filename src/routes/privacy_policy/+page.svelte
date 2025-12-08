<script>
    import Footer from "../../components/Footer.svelte";
    import { site } from "$lib/site.js";


</script>

<main class="flex flex-col">

    <section class="max-w-5xl mx-auto w-full p-6">
        <div class="bg-white p-6 rounded shadow">
            <h1 class="text-3xl font-semibold text-indigo-400">Privacy Policy</h1>
            <p class="mt-3 text-gray-700">This Privacy Policy explains how FrontDesk‑Pro ("we", "us", or "our") collects, uses, and protects your information when you use our services.</p>


            <div class="mt-8 space-y-6">
                <section>
                    <h2 class="text-xl font-semibold">Information We Collect</h2>
                    <ul class="mt-2 list-disc list-inside text-gray-700 space-y-1">
                        <li>Guest details such as name, check‑in and check‑out dates.</li>
                        <li>Room data (availability, status, type, and pricing).</li>
                        <li>Basic usage data to improve reliability and performance.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">How We Use Information</h2>
                    <ul class="mt-2 list-disc list-inside text-gray-700 space-y-1">
                        <li>To manage reservations, check‑ins, and room status updates.</li>
                        <li>To maintain accurate records for front‑desk operations.</li>
                        <li>To enhance the product experience and support users.</li>
    
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Cookies & Local Storage</h2>
                    <p class="mt-2 text-gray-700">We may use cookies or local storage to keep session preferences and improve usability. You can manage these in your browser settings.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Data Retention</h2>
                    <p class="mt-2 text-gray-700">Operational data is retained only as long as necessary to provide the service and comply with legal or business requirements.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Your Rights</h2>
                    <ul class="mt-2 list-disc list-inside text-gray-700 space-y-1">
                        <li>Access and correct your personal information.</li>
                        <li>Request deletion where applicable.</li>
                        <li>Opt out of non‑essential data collection.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Third‑Party Services</h2>
                    <p class="mt-2 text-gray-700">If we integrate with third‑party tools (e.g., payment or analytics providers), their policies apply to their respective services. We select reputable providers and limit shared data.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Security</h2>
                    <p class="mt-2 text-gray-700">We use reasonable administrative and technical safeguards to protect information. No system is perfectly secure, but we continuously improve our practices.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Changes to This Policy</h2>
                    <p class="mt-2 text-gray-700">We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make changes, we will revise the "Effective date" above and, where appropriate, provide additional notice.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Related Documents</h2>
                    <p class="mt-2 text-gray-700">Please also review our <a href="{site.tosPath}" class="text-indigo-400 hover:text-indigo-500 underline">Terms of Service</a> for additional information about using {site.name}.</p>
                </section>

                <section>
                    <h2 class="text-xl font-semibold">Contact</h2>
                    <p class="mt-2 text-gray-700">Questions about this policy? Visit our <a href="/contact_us" class="text-indigo-400 hover:text-indigo-500 underline">Contact Us</a> page.</p>
                </section>
            </div>
        </div>
    </section>
</main>

<Footer />