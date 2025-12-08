<script>
  let { children } = $props();
  import "../app.css";
  import Header from "../components/Header.svelte";
  import OtherHeader from "../components/OtherHeader.svelte";
  import { page } from '$app/stores';
  
</script>


{#if $page.url.pathname === '/'}
  <Header />
{:else}
  <OtherHeader />
{/if}
{@render children()}