<script>
import axios from 'axios';
import { onMount } from 'svelte';

export let repo;
export let text = 'Github';

let count;

onMount(async () => {
    let endpoint = `https://api.github.com/repos/${repo}`;
    let response = await axios.get(endpoint);
    console.log(response);
    count = response.data.stargazers_count || 0;
})
</script>

<style>
.button {
    display: inline-block;
    vertical-align: middle;
}

.stars-count {
    display: inline-block;
    vertical-align: middle;
    padding: 2px 5px;
    background-color: #FAFAFA;
    border-radius: 2px;
    border: 1px solid #dbdbdb;
    position: relative;
    margin-left: 5px;
    color: #444444;
}

.stars-count::before {
    content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 8px solid transparent;
	border-right-color: #dbdbdb;
	border-left: 0;
	margin-top: -8px;
	margin-left: -8px;
}

.stars-count::after {
    content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 6px solid transparent;
	border-right-color: #FFF;
	border-left: 0;
	margin-top: -6px;
	margin-left: -6px;
}
</style>

<template>
<span class="github-stars-button">
    <a href="https://github.com/{repo}" class="button is-rounded">
        <span class="icon">
            <i class="fab fa-github" />
        </span>
        <span>{text}</span>
    </a>

    <a href="https://github.com/{repo}/stargazers" class="stars-count">
        <i class="fas fa-star" /> {count}
    </a>
</span>
</template>