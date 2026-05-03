import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export const UPLOADS_DEST = 'uploads/perfil';

export const multerPerfilConfig = {
  storage: diskStorage({
    destination: UPLOADS_DEST,
    filename: (_req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(
          'Apenas imagens são aceitas (jpeg, png, gif, webp).',
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};
