<script>
	import Nav from '../components/Nav.svelte';
	export let segment;
</script>

<svelte:head>
	<title>Chris Watson - Designer, Developer, Open Sorcerer</title>
</svelte:head>

<template>
	<section class="hero is-primary is-fullheight">
		<div class="hero-head">
			<Nav {segment}/>
		</div>
		<div class="hero-body">
			<div class="container has-text-centered">
				<h1 class="title">Chris Watson</h1>
				<figure class="image avatar">
					<img src="/images/watzon.svg" alt="avatar">
				</figure>
				<h2 class="subtitle has-text-weight-bold">Designer, Developer, Open Sorcerer</h2>
			</div>
		</div>
	</section>
</template>
