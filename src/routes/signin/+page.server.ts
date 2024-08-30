import { signIn } from "../../auth.ts"
import type { Actions } from "./$types.js"

export const actions = { default: signIn } satisfies Actions