import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

dotenv.config()

// Cloudflare R2 Client (solo si está configurado)
const r2Env = {
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME,
}
const missingR2Env = Object.entries(r2Env)
  .filter(([, value]) => !value)
  .map(([name]) => name)

let r2Client: S3Client | null = null

if (missingR2Env.length > 0) {
  console.warn(`⚠️ Cloudflare R2 no configurado: falta ${missingR2Env.join(', ')} en el .env (los comprobantes solo se adjuntan al correo)`)
} else {
  try {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${r2Env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2Env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: r2Env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    })
    console.log(`✅ Cloudflare R2 configurado (bucket: ${r2Env.CLOUDFLARE_BUCKET_NAME})`)
  } catch (error) {
    console.error('❌ Cloudflare R2: no se pudo crear el cliente', error)
  }
}

export const isR2Configured = () => r2Client !== null

/**
 * Upload file to Cloudflare R2 (bucket privado). Retorna la ruta interna del archivo.
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  if (!r2Client) {
    throw new Error('Cloudflare R2 no está configurado')
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    })

    await r2Client.send(command)
    console.log(`✅ Archivo subido a R2: ${fileName}`)

    return fileName
  } catch (error) {
    console.error('❌ Error subiendo archivo a R2:', error)
    throw new Error('Error al subir archivo a Cloudflare R2')
  }
}

/**
 * Generate unique filename for payment proof
 */
export function generatePaymentProofFilename(
  orderCode: string,
  originalName: string
): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  return `comprobantes/${orderCode}-${timestamp}.${extension}`
}

export default r2Client
