<script context="module">
    export async function preload(page, session) {
        const { user } = session;
        console.log(session);

        if (!user) {
            return this.redirect(302, '/');
        }

        return { user };
    }
</script>

<script>
    import { stores } from '@sapper/app';
    const { session } = stores();
    console.log($session);
</script>
<h1>Profil</h1>
Nom : {$session.user.username}<br>
email : {$session.user.email}<br>
ID : {$session.user.id}
