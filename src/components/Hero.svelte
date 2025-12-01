<script>
    import CTAs from "./CTAs.svelte";
    import Header from "./Header.svelte";
    import SectionWrapper from "./SectionWrapper.svelte";
    import Footer from "./Footer.svelte";


</script>

<SectionWrapper>
    <Header />
<div
    class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14"
>
    <h2
        class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-[1200px] mx-auto w-full text-center font-semibold"
    >
        Hotel Management
        <span class="text-slate-600 line-through">Is Complicated</span><br />
        Just Got <span class="text-indigo-400">Easier</span>
    </h2>
    <p
        class="text-xl sm:text-2xl md:text-3xl text-center max-w-[1000px] mx-auto w-full"
    >
        Streamline operations, save time, and eliminate errors. Our software gives you
        <span class="italic">real-time room tracking, fast check-ins, intuitive booking tools, guest history, and automated reporting</span>
        — all in one modern and easy-to-use system designed specifically for hotel staff.
    </p>
</div>
</SectionWrapper>
<Footer />