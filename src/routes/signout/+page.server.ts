import { signOut } from "../../auth.ts"
import type { Actions } from "./$types.js"

export const actions = { default: signOut } satisfies Actions