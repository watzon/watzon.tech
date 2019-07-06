<script>
	import Nav from '../../components/Nav.svelte';
	import fa from '@fortawesome/fontawesome-pro/js/all';
</script>

<style type="scss" global>
@import "../../styles/main.scss";
</style>

<template>
    <Nav segment='projects'/>

    <main>
        <slot></slot>
    </main>
</template>