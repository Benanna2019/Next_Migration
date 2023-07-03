import * as React from 'react'

import { DialogComponent } from '.'

import CreateInvoiceForm from '../forms/create-invoice-form'

export function AddInvoiceDialog({ children, trigger }: any) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Create Invoice'}
      modalContent={() => <CreateInvoiceForm />}
    >
      {/* @ts-ignore */}
      {children ? ({ openModal }) => children({ openModal }) : null}
    </DialogComponent>
  )
}
