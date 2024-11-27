import {db} from '../../../../server/db'

export const POST = async (req: Request) => {
  const {data} = await req.json()
  const id = data.id
  const firstName = data.first_name
  const lastName = data.last_name
  const imageUrl = data.image_url
  const emailAddress = data.email_addresses[0].email_address

  await db.user.create({
    data: {
      id,
      firstName,
      lastName,
      imageUrl,
      emailAddress
    }
  })

  return new Response("Success", {status: 200})
}