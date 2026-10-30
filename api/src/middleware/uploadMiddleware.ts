import multer from 'multer'
import type { Request, Response, NextFunction } from 'express'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, ALLOWED_TYPES.includes(file.mimetype)),
})

/**
 * Recibe el comprobante de pago (campo "comprobante") en memoria
 */
export function uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
  upload.single('comprobante')(req, res, (error: unknown) => {
    if (error) {
      const tooLarge = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
      return res.status(400).json({
        success: false,
        error: tooLarge ? 'El comprobante debe pesar menos de 5 MB' : 'No se pudo procesar el comprobante',
      })
    }
    return next()
  })
}
