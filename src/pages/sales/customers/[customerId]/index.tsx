import CustomerIdPage from '@/components/customer-id-page'
import { useRouter } from 'next/router'
import CustomerLayout from '@/components/customer-layout'
import Layout from '@/components/layouts'
import SalesNav from '@/components/sales-nav'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/utils'

function CustomerIdRoute() {
  const router = useRouter()
  const customerId = router.query.customerId

  const customerQueryData = useQuery(
    ['customer', customerId],
    () => fetcher(`/api/get-customer/${customerId}`),
    { useErrorBoundary: true, enabled: !!customerId }
  )
  return <CustomerIdPage customerInfo={customerQueryData} />
}

CustomerIdRoute.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <SalesNav>
        <CustomerLayout>{page}</CustomerLayout>
      </SalesNav>
    </Layout>
  )
}

export default CustomerIdRoute

// export async function getServerSideProps(
//   context: GetServerSidePropsContext & { params: { customerId: string } }
// ) {
//   const user = await getServerSession(context.req, context.res, authOptions)
//   if (!user) {
//     redirect('/login')
//   }
//   const customers = await getCustomerListItems()

//   const data = { customers }
//   return {
//     props: {
//       data,
//     },
//   }
// }
