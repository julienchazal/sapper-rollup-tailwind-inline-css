<svelte:head>
    <title>Connexion</title>
</svelte:head>

<script context="module">
    export async function preload(page, session) {
        console.log(session);
    }
</script>

<script>
    import {post} from 'utils'
    import { goto, stores } from '@sapper/app';
    import ListErrors from '../components/ListErrors.svelte';
    const { session } = stores();

    let email = '';
    let password = '';
    let errors = null;

    async function submit(event) {
        const response = await post(`auth/login`, { email, password });
        console.log(response);
        errors = response.errors;
        if (response.user) {
            // Sets the User to true in the Store so we do not have to refresh the page.
            $session.user = response.user;
            goto('/profil');
        }
    }
</script>

<h1>CONNEXION</h1>

<form id="register" on:submit|preventDefault={submit}>
    <input type="email" placeholder="Email" id="email" required bind:value={email}/>
    <br><br>
    <input type="password" autocomplete="" id="password" placeholder="Mot de passe" required bind:value={password}/>
    <br><br>
    <button class="button" type="submit" disabled='{!email || !password}'>Envoyer</button>
</form>
<ListErrors {errors}/>
<br><br>
<a href="/register">Créer un compte</a>
