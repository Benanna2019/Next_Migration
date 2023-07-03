import { GitHubIcon } from '../Icon'
import { signIn, signOut } from 'next-auth/react'

export function SignOut() {
  return (
    <button
      className="my-1 py-1 px-2 pr-16 text-[length:14px]"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      → Sign out
    </button>
  )
}

export function SignIn() {
  return (
    <button
      className="mb-4 flex rounded-md border border-gray-800 bg-black px-4 py-3 text-sm font-semibold text-neutral-200 transition-all hover:text-white"
      onClick={() => signIn('github', { callbackUrl: '/' })}
    >
      <GitHubIcon />
      <div className="ml-3">Sign in with GitHub</div>
    </button>
  )
}
