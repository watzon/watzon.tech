<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	import ProjectCard from '../../components/ProjectCard.svelte';

	const projectsJson = 'https://gist.githubusercontent.com/watzon/772419598a0b47af0c6b1247c7429160/raw';
	export let projects = [];

	onMount(() => {
		axios.get(projectsJson)
			.then(res => {
				let featured = res.data.featured.map((f) => { f["featured"] = true; return f; })
				projects = featured.concat(res.data.projects);
			});
	})
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<template>
	<section class="hero is-medium is-primary">
        <div class="hero-body">
			<div class="container has-text-centered">
				<h1 class="title">Projects</h1>
				<h2 class="subtitle">Just a few of many. See <a href="https://github.com/watzon">my github</a> for more.</h2>
			</div>
		</div>
    </section>

	<section class="section">
		<div class="container">
			<div class="columns is-multiline">
				{#each projects as project}
					<div class="column is-6">
						<ProjectCard {...project} />
					</div>
				{/each}
			</div>
		</div>
	</section>
</template>