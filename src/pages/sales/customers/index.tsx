import { getCustomerListItems } from '@/models/customerserver'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import CustomerLayout from '@/components/customer-layout'
import { redirect } from 'next/navigation'
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types'
import SalesNav from '@/components/sales-nav'
import Layout from '@/components/layouts'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { fetcher } from '@/utils'
import { useQuery } from '@tanstack/react-query'

function CustomersPage({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  if (session.status == 'unauthenticated') {
    router.push('/login')
  }

  return <CustomerLayout>{children}</CustomerLayout>
}

CustomersPage.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <SalesNav>{page}</SalesNav>
    </Layout>
  )
}

export default CustomersPage

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const user = await getServerSession(context.req, context.res, authOptions)
//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
//   const customers = await getCustomerListItems()
//   return {
//     props: {
//       customers,
//     },
//   }
// }
