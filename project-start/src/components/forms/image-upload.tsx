import { UploadButton } from '@/utils/uploadthing'
// You need to import our styles for the button to look right. Best to import in the root /_app.tsx but this is fine
import '@uploadthing/react/styles.css'

export function UploadImage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log('Files: ', res)
          alert('Upload Completed')
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`)
        }}
      />
    </main>
  )
}
