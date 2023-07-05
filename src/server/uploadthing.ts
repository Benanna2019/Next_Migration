import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
 
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { createUser, getUserByEmail, updateUser } from "@/models/userserver";
 
const f = createUploadthing();
 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, res }) => {
      // This code runs on your server before upload
      const session = await getServerSession(req, res, authOptions);
 
      // If you throw, the user will not be able to upload
      if (!session || !session.user) throw new Error("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user_email: session.user.email, user_name: session.user?.name };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
        let user = await getUserByEmail(metadata.user_email as string);
        if (!user) {
            await createUser({email: metadata.user_email as string, username: metadata.user_name as string, logoUrl: file.url });
        }
        if (user) {
            await updateUser({ id: user.id, logoUrl: file.url })
        }
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;