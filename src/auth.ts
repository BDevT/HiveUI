import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/sveltekit/providers/keycloak';

const AUTH_KEYCLOAK_ID = process.env.AUTH_KEYCLOAK_ID;
const AUTH_KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER;
const AUTH_KEYCLOAK_SECRET = process.env.AUTH_KEYCLOAK_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;

// Use the environment variables
const authjsSecret = AUTH_SECRET; // Use Environment Variable AUTH_SECRET in prod

const kcConfig = {
  issuer: AUTH_KEYCLOAK_ISSUER,
  clientId: AUTH_KEYCLOAK_ID,
  clientSecret: AUTH_KEYCLOAK_SECRET
};

export const { handle, signIn, signOut } = SvelteKitAuth({
	trustHost: true,
	secret: authjsSecret,
	providers: [Keycloak(kcConfig)],
	callbacks: {
		jwt({ user, token, account, profile }) {
			if (user) {
				// User is available during sign-in
				token.id = user.id;
			}
			if (profile) {
				token.preferred_username = profile.preferred_username;
				token.given_name = profile.given_name;
				token.family_name = profile.family_name;
			}
			if (account) {
				token.idToken = account.id_token;
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}

			return token;
		},
		session({ session, token }) {
			// session.user.id = token.id;
			session.user = { ...token };
			return session;
		}
	}
});