<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { mdiLogout } from '@mdi/js';
	import { Button } from 'svelte-ux';
</script>

<Button icon={mdiLogout} variant="fill" size="lg" on:click={() => signOut()}>Sign Out</Button>