import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: '038cnybx',
  dataset: 'production',
  apiVersion: 'v1',
  token:
    "skwOzEck40A7SHUcpi6lOPmQunRt3aPM6g79SLe2dGEFIdbWo5b6Ag4A39hYuqKgj3nb5eor5hRwdaPTgSDaFuCTDFvPCeaW0F1ekY6dcbbDeSGEB8aaDZeJ3QXIgaIswMKRe7hWjvjAMKey5So6SErh97w7Y2SISXdfhrNenU7yvyGfV3O4",
  useCdn: false,
})