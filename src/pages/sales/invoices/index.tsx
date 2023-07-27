import InvoicesPage from '@/components/invoice-page'
import SalesNav from '@/components/sales-nav'
import Layout from '@/components/layouts'

function InvoicesLayout() {
  return <InvoicesPage />
}

InvoicesLayout.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <Layout>
      <SalesNav>{page}</SalesNav>
    </Layout>
  )
}

export default InvoicesLayout
