import { FullFakebooksLogo } from '@/components'
import Layout from '@/components/layouts'
import { SignIn } from '@/components/login'
import { useSession } from 'next-auth/react'

function LoginPage() {
  const session = useSession()
  console.log('session', session)
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <h1 className="mb-12">
        <FullFakebooksLogo size="lg" position="center" />
      </h1>
      <div className="items center mx-auto flex w-full max-w-md justify-center px-8">
        <SignIn />
      </div>
    </div>
  )
}

LoginPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export default LoginPage
