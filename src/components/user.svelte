<script lang="ts">
	import { Button, Icon, Menu, MenuButton, MenuItem, Toggle } from 'svelte-ux';
	import LoginButton from './login_button.svelte';
	import LogoutButton from './logout_button.svelte';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	import { mdiLogout } from '@mdi/js';
	import { signOut } from '@auth/sveltekit/client';
	
	interface User {
		status: boolean;
		user?: {
			name?: string;
			email?: string;
		};
	}

	export let data: User;
	function stringifyToken(token: string) {
		return JSON.stringify(jwtDecode(token), null, 2);
	}

	let idToken = '';
	let accessToken = '';
	let refreshToken = '';

	onMount(() => {
		if (data && data.user) {
			idToken = stringifyToken(data.user.idToken);
			accessToken = stringifyToken(data.user.accessToken);
			refreshToken = stringifyToken(data.user.refreshToken);
		}
	});

	let userOptions = [
		{
			label: 'Sign Out',
			value: data.user?.name,
			icon: mdiLogout
		}
	];
</script>

<div>
	{#if data.status}
		<div class="userloggedin">

		</div>

		<Toggle let:on={open} let:toggle let:toggleOff>
			<Button variant="fill" size="lg" on:click={toggle}>
				{data.user?.name}
				<Menu {open} on:close={toggleOff} matchWidth>
					<MenuItem on:click={() => signOut()}>Sign Out</MenuItem>
				</Menu>
			</Button>
		</Toggle>
	{:else}
		<div>
			<LoginButton />
		</div>
	{/if}
</div>

<style>
	.userloggedin {
		display: flex;
		align-items: center;
		gap: 25px;
	}
</style>
