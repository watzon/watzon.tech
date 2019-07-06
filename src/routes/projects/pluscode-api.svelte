<script>
import axios from 'axios';

// let apiEndpoint = 'https://pluscode-api.watzon.tech/api/address/encode';
let apiEndpoint = 'http://localhost:5000/api/address/encode?address=';
let queryResult;
let failed = false;
let address = '';

let executeQuery = () => {
    axios.get(apiEndpoint + address).then((res) => {
        if (res.data[0]) {
            queryResult = res.data[0];
        } else {
            failed = true;
        }
    })
}
</script>

<style lang="scss">
    .address-field .control:not(:last-child) {
        width: 100%;
    }

    .query-result {
        margin-top: 2rem;
        font-family: 'Asap', sans-serif;
    }

    .query-result .subtitle {
        margin-top: 1.2rem;
    }
</style>

<div class="hero is-primary is-medium">
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title">PlusCode API</h1>

            <div class="columns is-centered">
                <div class="column is-6">
                    <form action=".">
                        <div class="field has-addons address-field">
                            <div class="control">
                                <input type="text" class="input is-medium" name="address" placeholder="Enter an address" bind:value={address}>
                            </div>
                            <div class="control">
                                <button class="button is-secondary is-medium" on:click|preventDefault={executeQuery}>
                                    <span class="icon is-medium">
                                        <i class="far fa-arrow-right" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {#if queryResult}
            <div class="columns is-centered">
                <div class="column is-12">
                    <div class="query-result">
                        <h1 class="title">{queryResult.address}</h1>
                        <h2 class="subtitle has-text-weight-bold is-family-monospace">{queryResult.pluscode}</h2>
                    </div>
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>