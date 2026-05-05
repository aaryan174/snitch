import ImageKit from '@imagekit/nodejs';


const client = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE,
  publicKey: process.env.IMAGE_KIT_PUBLIC,
  urlEndpoint: process.env.IMAGE_KIT_URL,
});


export async function uploadImage({buffer, fileName, folder="sntich"}) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}