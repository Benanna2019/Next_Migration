import InvoicesPage from '@/components/invoice-page'
import SalesNav from '@/components/sales-nav'
import { getInvoiceListItems } from '@/models/invoiceserver'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth'
import Layout from '@/components/layouts'

export default function InvoicesLayout(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <Layout>
      <SalesNav>
        <InvoicesPage data={props.data} dueSoonPercent={props.dueSoonPercent} />
      </SalesNav>
    </Layout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getServerSession(context.req, context.res, authOptions)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const invoiceListItems = await getInvoiceListItems()
  const dueSoonAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'due') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const overdueAmount = invoiceListItems.reduce((sum, li) => {
    if (li.dueStatus !== 'overdue') {
      return sum
    }
    const remainingBalance = li.totalAmount - li.totalDeposits
    return sum + remainingBalance
  }, 0)
  const data = {
    invoiceListItems,
    overdueAmount,
    dueSoonAmount,
  }

  const hundo = data.dueSoonAmount + data.overdueAmount
  const dueSoonPercent = Math.floor((data.dueSoonAmount / hundo) * 100)
  return {
    props: {
      data,
      dueSoonPercent,
    },
  }
}
