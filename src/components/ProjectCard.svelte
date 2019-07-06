<script>
    import GithubStarsButton from '../components/GithubStarsButton.svelte';

    export let title;
    export let description;
    export let github;
    export let homepageUrl;
    export let cardBgImage;

    let cardBgColor = () => {
        let cssHSL = "hsl(" + 360 * Math.random() + ',' +
                            (25 + 70 * Math.random()) + '%,' + 
                            (85 + 10 * Math.random()) + '%)'
        return cssHSL
    }
</script>

<style lang="postcss">
.project-card {
  border-radius: 1rem;
  background-size: cover;
  box-shadow: 5px 5px 15px rgba(30, 30, 30, 0.5);
  height: 100%;
  min-height: 250px;
}
.project-card .content {
  border-radius: 1rem;
  padding: 2.5rem 45% 2.5rem 2.5rem;
  background: url("/images/card-content-bg.svg") left center no-repeat;
  background-size: cover;
  height: 100%;
}
.project-card .title {
  font-weight: 800;
  font-family: 'Asap', sans-serif;
  margin-bottom: 0.8rem;
}
.project-card .description {
  font-weight: 500;
  font-family: 'Asap', sans-serif;
  font-size: 1rem;
}
.project-card .links .link {
  display: inline-block;
}
.project-card .links .link:not(:last-child) {
  margin-right: 0.8rem;
}
</style>

<template>
    <div class="project-card" style="background-color: {cardBgColor()}; background-image: url('{cardBgImage}')">
        <div class="content">
            <h1 class="title">{ title }</h1>
            <p class="description">{ description }</p>
            <div class="links">
              {#if homepageUrl}
              <div class="link">
                  <a href="{homepageUrl}" class="button is-rounded is-primary">
                      <span class="icon is-medium">
                          <i class="fas fa-home"></i>
                      </span>
                      <span>Home</span>
                  </a>
              </div>
              {/if}
              {#if github}
              <div class="link">
                  <GithubStarsButton repo={github} />
              </div>
              {/if}
            </div>
        </div>
    </div>
</template>