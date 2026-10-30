import { EmailClient } from '@azure/communication-email'
import dotenv from 'dotenv'

dotenv.config()

// Email client (solo si está configurado)
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING
const senderAddress = process.env.SENDER_EMAIL

let emailClient: EmailClient | null = null

if (!connectionString || !senderAddress) {
  const missing = [!connectionString && 'AZURE_COMMUNICATION_CONNECTION_STRING', !senderAddress && 'SENDER_EMAIL'].filter(Boolean)
  console.warn(`⚠️ Azure Email no configurado: falta ${missing.join(' y ')} en el .env`)
} else {
  try {
    emailClient = new EmailClient(connectionString)
    console.log(`✅ Azure Email Client configurado (remitente: ${senderAddress})`)
  } catch (error) {
    console.error('❌ Azure Email: la cadena de conexión no es válida', error)
  }
}

export interface OrderEmailLine {
  cantidad: number
  nombre: string
  complementos: string[]
  observaciones?: string
}

export interface OrderEmailData {
  codigo: string
  tokenConfirmacion: string
  sedeNombre: string
  fecha: Date
  tipoEntrega: 'domicilio' | 'recoger'
  clienteNombre: string
  clienteTelefono: string
  clienteEmail?: string
  barrio?: string
  tipoVivienda?: string
  direccion?: string
  notas?: string
  lines: OrderEmailLine[]
  subtotal: number
  costoDomicilio: number | null
  total: number
  metodoPago: 'efectivo' | 'transferencia'
  comprobante?: { name: string; contentType: string; buffer: Buffer }
}

/**
 * Send order notification email to sede
 */
export async function sendOrderEmail(order: OrderEmailData, sedeEmail: string): Promise<void> {
  if (!emailClient) {
    console.log('📧 Email no enviado (Azure no configurado):', sedeEmail)
    return
  }

  try {
    const poller = await emailClient.beginSend({
      senderAddress: senderAddress!,
      content: {
        subject: `🍌 Pedido ${order.codigo} — ${order.sedeNombre}`,
        html: generateOrderEmailHTML(order),
      },
      recipients: {
        to: [{ address: sedeEmail }],
      },
      attachments: order.comprobante
        ? [
            {
              name: order.comprobante.name,
              contentType: order.comprobante.contentType,
              contentInBase64: order.comprobante.buffer.toString('base64'),
            },
          ]
        : undefined,
    })
    await poller.pollUntilDone()

    console.log(`✅ Email del pedido ${order.codigo} enviado a ${sedeEmail}`)
  } catch (error) {
    console.error(`❌ Error enviando email del pedido ${order.codigo}:`, error)
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const money = (value: number) => `$${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:4px 12px 4px 0;font-weight:bold;color:#2D2318;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:4px 0;color:#2D2318;">${value}</td>
    </tr>`
}

/**
 * Generate HTML template for order email
 */
function generateOrderEmailHTML(order: OrderEmailData): string {
  const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirmar-pedido/${encodeURIComponent(order.codigo)}?token=${order.tokenConfirmacion}`
  const fecha = order.fecha.toLocaleString('es-CO', { timeZone: 'America/Bogota' })

  const lines = order.lines
    .map(
      (line) => `
      <p style="margin:0 0 8px;color:#2D2318;">
        <strong>${line.cantidad}x</strong> ${escapeHtml(line.nombre)}
        ${line.complementos.length ? `<br><span style="color:#6b6258;font-size:13px;">+ ${line.complementos.map(escapeHtml).join(', ')}</span>` : ''}
        ${line.observaciones ? `<br><em style="color:#6b6258;font-size:13px;">“${escapeHtml(line.observaciones)}”</em>` : ''}
      </p>`
    )
    .join('')

  const entrega =
    order.tipoEntrega === 'domicilio'
      ? row('Dirección', `${escapeHtml(order.direccion ?? '')}${order.barrio ? `, ${escapeHtml(order.barrio)}` : ''}`) +
        (order.tipoVivienda ? row('Vivienda', escapeHtml(order.tipoVivienda)) : '')
      : row('Entrega', 'Recoge en tienda')

  const domicilio =
    order.tipoEntrega === 'recoger' ? 'Sin costo' : order.costoDomicilio === null ? 'Por confirmar' : money(order.costoDomicilio)

  const pago =
    order.metodoPago === 'transferencia'
      ? `<strong>Método de pago:</strong> TRANSFERENCIA (Bre-B)${order.comprobante ? ' — comprobante adjunto a este correo' : ''}`
      : `<strong>Método de pago:</strong> EFECTIVO (contra entrega)`

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5EFE6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">
    <div style="background:#ffffff;border-radius:16px;padding:24px;">
      <h1 style="margin:0;color:#0B6E4F;font-size:24px;line-height:1.3;">🍌 Pedido ${escapeHtml(order.codigo)} — ${escapeHtml(order.sedeNombre)}</h1>
      <p style="margin:4px 0 20px;color:#6b6258;font-size:13px;">${fecha}</p>

      <table style="border-collapse:collapse;font-size:15px;margin-bottom:16px;">
        ${row('Cliente', escapeHtml(order.clienteNombre))}
        ${row('Teléfono', escapeHtml(order.clienteTelefono))}
        ${order.clienteEmail ? row('Correo', escapeHtml(order.clienteEmail)) : ''}
        ${entrega}
      </table>

      <div style="background:#F5EFE6;border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="margin:0 0 10px;font-weight:bold;color:#2D2318;">Productos</p>
        ${lines}
      </div>

      ${order.notas ? `<p style="margin:0 0 16px;color:#2D2318;"><strong>Indicaciones:</strong> ${escapeHtml(order.notas)}</p>` : ''}

      <table style="width:100%;border-collapse:collapse;font-size:15px;color:#2D2318;">
        <tr><td style="padding:4px 0;">Subtotal</td><td style="padding:4px 0;text-align:right;">${money(order.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;border-bottom:2px solid #2D2318;">Domicilio</td><td style="padding:4px 0;text-align:right;border-bottom:2px solid #2D2318;">${domicilio}</td></tr>
        <tr><td style="padding:10px 0;font-size:20px;font-weight:bold;">TOTAL</td><td style="padding:10px 0;text-align:right;font-size:20px;font-weight:bold;">${money(order.total)}</td></tr>
      </table>

      <div style="background:#E8F5EC;border-left:4px solid #0B6E4F;border-radius:8px;padding:12px 16px;margin:16px 0 24px;color:#2D2318;">
        💳 ${pago}
      </div>

      <div style="text-align:center;">
        <a href="${confirmUrl}" style="display:inline-block;background:#0B6E4F;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:10px;">✅ Confirmar pedido</a>
      </div>
    </div>
    <p style="text-align:center;color:#6b6258;font-size:12px;margin-top:16px;">Demaduro · Este es un correo automático, por favor no responder.</p>
  </div>
</body>
</html>`
}

export default emailClient
