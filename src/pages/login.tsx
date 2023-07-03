import { FullFakebooksLogo, inputClasses } from '@/components'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { SignIn, SignOut } from '@/components/login'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  }
}
