<script>
    import Hero from "../components/Hero.svelte";


</script>
<main class="flex flex-col">
    <Hero />
</main>

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>