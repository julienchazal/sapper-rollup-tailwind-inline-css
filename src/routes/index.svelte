<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
		& img {
			width: 100%;
			max-width: 400px;
			margin: 0 0 1em 0;
		}
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script context="module">
	export async function preload(page, session) {
		if (page.query.logout) {
			session.user = undefined;
		}
	}
</script>

<script>
	import {onMount} from 'svelte'
	export let release
	export let dynamic = {};
	$: name = dynamic.artists_sort;
	$: title = dynamic.title;
	$: num_for_sale = dynamic.num_for_sale;

	onMount(async () => {
		const res = await fetch(`https://api.discogs.com/releases/2387793`);
		dynamic = await res.json();
	});
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1 class="text-blue-700">Great success!</h1>

<figure>
	<img alt='Borat' src='great-success.png' class="rounded-full border-2">
	<figcaption>HIGH FIVE!</figcaption>
</figure>
<svg class="inline-svg-icon">
	<use xlink:href="#chat"></use>
</svg>

{#if name }
<p>{name} - {title} - {num_for_sale} en vente !</p>
{/if}

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
