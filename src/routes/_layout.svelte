<script>
	import Nav from '../components/Nav.svelte';
	import fa from '../../node_modules/@fortawesome/fontawesome-pro/js/all.js';

	export let segment;
</script>

<style type="scss" global>
@import "../styles/main.scss";
</style>

<template>
    <main>
        <slot></slot>
    </main>
</template>