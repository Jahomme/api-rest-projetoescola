import multer from 'multer';
import multerConfig from '../config/multerConfig';

import Foto from '../models/Foto';

const upload = multer(multerConfig).single('foto');

class FotoController {
  async index(req, res) {
    try {
      const { aluno_id } = req.body;

      if (!aluno_id) {
        return res.status(400).json({
          errors: ['Faltando ID do aluno'],
        });
      }

      const fotos = await Foto.findAll({
        where: { aluno_id },
        attributes: ['id', 'url', 'filename'],
        order: [['id', 'DESC']],
      });

      return res.json(fotos);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err.code],
        });
      }
      try {
        const { originalname, filename } = req.file;
        const { aluno_id } = req.body;
        const foto = await Foto.create({ originalname, filename, aluno_id });

        return res.json(foto);
      } catch (e) {
        return res.status(400).json({
          errors: ['Aluno não existe.'],
        });
      }
    });
  }
}

export default new FotoController();
