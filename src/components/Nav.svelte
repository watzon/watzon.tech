<script>
	export let segment;
	
	let open = false;

	function toggleOpen () {
		open = !open;
	}
</script>

<style type="scss">
	.navbar-brand h2 {
		font-weight: bold;
	}
</style>

<!-- <nav>
	<ul>
		<li><a class='{segment === undefined ? "selected" : ""}' href='.'>home</a></li>
		<li><a class='{segment === "about" ? "selected" : ""}' href='about'>about</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen
		<li><a rel=prefetch class='{segment === "blog" ? "selected" : ""}' href='blog'>blog</a></li>
	</ul>
</nav> -->

<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="container">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
			<h2>watzon.tech</h2>
		</a>

		<a role="button" class="navbar-burger" class:is-active="{open}" aria-label="menu" aria-expanded="{open}" href="." on:click|preventDefault={toggleOpen}>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div class="navbar-menu" class:is-active="{open}">
		<div class="navbar-start">
			<a class="navbar-item" class:is-active={!segment} href="/">
				Home
			</a>
			<a class="navbar-item" class:is-active={segment == "projects"} href="/projects">
				Projects
			</a>
		</div>

		<div class="navbar-end">
			<a class="navbar-item" href="https://github.com/watzon">
				<span class="icon">
					<i class="fab fa-github"></i>
				</span>
				<span class="is-hidden-desktop">Github</span>
			</a>
			<a class="navbar-item" href="https://twitter.com/_watzon">
				<span class="icon">
					<i class="fab fa-twitter"></i>
				</span>
				<span class="is-hidden-desktop">Twitter</span>
			</a>
			<a class="navbar-item" href="https://dribbble.com/watzon">
				<span class="icon">
					<i class="fab fa-dribbble"></i>
				</span>
				<span class="is-hidden-desktop">Dribbble</span>
			</a>
			<a class="navbar-item" href="https://keybase.io/watzon">
				<span class="icon">
					<i class="fab fa-keybase"></i>
				</span>
				<span class="is-hidden-desktop">Keybase</span>
			</a>
		</div>
	</div>
  </div>
</nav>