import { getServerSession } from 'next-auth/next'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { authOptions } from './auth/[...nextauth]'
import invariant from 'tiny-invariant'
import {
  parseDate,
  validateCustomerId,
  validateDueDate,
  validateLineItemQuantity,
  validateLineItemUnitPrice,
} from '@/utils'
import { LineItemFields, createInvoice } from '@/models/invoiceserver'
import { NextResponse } from 'next/server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { intent, customerId, invoiceDueDate, invoiceLineItems } =
    await req.body

  switch (intent) {
    case 'create': {
      const dueDateString = invoiceDueDate
      invariant(typeof customerId === 'string', 'customerId is required')
      invariant(typeof dueDateString === 'string', 'dueDate is required')
      const dueDate = parseDate(dueDateString)

      const lineItemIds = invoiceLineItems.map(
        (lineItem: any) => lineItem.lineItemId
      )
      const lineItemQuantities = invoiceLineItems.map(
        (lineItem: any) => lineItem.quantity
      )
      const lineItemUnitPrices = invoiceLineItems.map(
        (lineItem: any) => lineItem.unitPrice
      )
      const lineItemDescriptions = invoiceLineItems.map(
        (lineItem: any) => lineItem.description
      )
      const lineItems: Array<LineItemFields> = []
      for (let i = 0; i < lineItemQuantities.length; i++) {
        const quantity = +lineItemQuantities[i]
        const unitPrice = +lineItemUnitPrices[i]
        const description = lineItemDescriptions[i]
        invariant(typeof quantity === 'number', 'quantity is required')
        invariant(typeof unitPrice === 'number', 'unitPrice is required')
        invariant(typeof description === 'string', 'description is required')

        lineItems.push({ quantity, unitPrice, description })
      }

      const errors = {
        customerId: validateCustomerId(customerId),
        dueDate: validateDueDate(dueDate),
        lineItems: lineItems.reduce((acc, lineItem, index) => {
          const id = lineItemIds[index]
          invariant(typeof id === 'string', 'lineItem ids are required')
          acc[id] = {
            quantity: validateLineItemQuantity(lineItem.quantity),
            unitPrice: validateLineItemUnitPrice(lineItem.unitPrice),
          }
          return acc
        }, {} as Record<string, { quantity: null | string; unitPrice: null | string }>),
      }

      const customerIdHasError = errors.customerId !== null
      const dueDateHasError = errors.dueDate !== null
      const lineItemsHaveErrors = Object.values(errors.lineItems).some(
        (lineItem) => Object.values(lineItem).some(Boolean)
      )
      const hasErrors =
        dueDateHasError || customerIdHasError || lineItemsHaveErrors

      if (hasErrors) {
        res.status(400).json(errors)
      }

      const invoice = await createInvoice({ dueDate, customerId, lineItems })

      res.status(200).json(invoice.id)
    }
  }
  res.status(404).json(`Unsupported intent: ${intent}`)
}
