<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { mdiLogin } from '@mdi/js';
	import { Button } from 'svelte-ux';
</script>

<Button icon={mdiLogin} variant="fill" size="lg" on:click={() => signIn('keycloak')}>Sign In</Button>