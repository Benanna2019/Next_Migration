import * as React from 'react'

import { DialogComponent } from '.'

import AddCustomerForm from '../forms/add-customer-form'

export function AddCustomerDialog({ children, trigger }: any) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Add Customer'}
      modalContent={() => <AddCustomerForm />}
    >
      {/* @ts-ignore */}
      {children ? ({ openModal }) => children({ openModal }) : null}
    </DialogComponent>
  )
}
