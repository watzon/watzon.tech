<script>
	import Nav from '../../components/Nav.svelte';
	import fa from '@fortawesome/fontawesome-pro/js/all';
</script>

<style type="scss" global>
@import "../../styles/main.scss";
</style>

<svelte:head>
	<title>Chris Watson - Projects</title>
</svelte:head>

<template>
    <Nav segment='projects'/>

    <main>
        <slot></slot>
    </main>
</template>