import * as React from 'react'

import { DialogComponent } from '.'

import { UploadImage } from '../forms/image-upload'

export function UploadCompanyLogo({ children, trigger }: any) {
  return (
    <DialogComponent
      trigger={trigger}
      title={'Upload Company Logo'}
      modalContent={() => <UploadImage />}
    >
      {/* @ts-ignore */}
      {children ? ({ openModal }) => children({ openModal }) : null}
    </DialogComponent>
  )
}
