import { useSession } from 'next-auth/react'
import SalesNav from '@/components/sales-nav'
// import { getFirstCustomer } from '@/models/customerserver'
// import { getFirstInvoice } from '@/models/invoiceserver'
// import { authOptions } from '@/pages/api/auth/[...nextauth]'
// import { getServerSession } from 'next-auth'
// import {
//   GetServerSidePropsContext,
//   InferGetServerSidePropsType,
// } from 'next/types'
import Layout from '@/components/layouts'
import { useRouter } from 'next/router'

function SalesPage({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  if (session.status == 'unauthenticated') {
    router.push('/login')
  }
  return <SalesNav>{children}</SalesNav>
}

SalesPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>
}

export default SalesPage

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions)
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
//   const [firstInvoice, firstCustomer] = await Promise.all([
//     getFirstInvoice(),
//     getFirstCustomer(),
//   ])
//   const data = {
//     firstInvoiceId: firstInvoice?.id,
//     firstCustomerId: firstCustomer?.id,
//   }
//   return {
//     props: {
//       data,
//     },
//   }
// }
