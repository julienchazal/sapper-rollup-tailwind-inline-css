<svelte:head>
    <title>Register</title>
</svelte:head>

<script context="module">
    export async function preload(page, session) {
        const { user } = session;

        if (user) {
            return this.redirect(302, '/');
        }

        return { user };
    }
</script>

<script>
    import {post} from 'utils'
    import { goto, stores } from '@sapper/app';
    const { session } = stores();

    let email = '';
    let password = '';
    let username = '';
    async function submit(event) {
        const response = await post(`auth/register`, { username, email, password });
        console.log(response);
        if (response.user) {
            // Sets the User to true in the Store so we do not have to refresh the page.
            $session.user = response.user;
            goto('/');
        }
    }
</script>

<h1>INSCRIPTION</h1>

<form id="register" on:submit|preventDefault={submit}>
    <input type="text" placeholder="Your Name" bind:value={username}>
    <br><br>
    <input type="email" placeholder="Email" id="email" required bind:value={email}/>
    <br><br>
    <input type="password" autocomplete="" id="password" placeholder="Mot de passe" required bind:value={password}/>
    <br><br>
    <button class="button" type="submit" disabled='{!email || !password}'>Envoyer</button>
</form>
