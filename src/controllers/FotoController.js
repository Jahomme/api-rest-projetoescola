import multer from 'multer';
import multerConfig from '../config/multerConfig';

import Foto from '../models/Foto';

const upload = multer(multerConfig).single('foto');

class FotoController {
  async index(req, res) {
    try {
      const { aluno_id } = req.params;

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

  async delete(req, res) {
    try {
      const { aluno_id, foto_id } = req.params;

      if (!aluno_id || !foto_id) {
        return res.status(400).json({
          errors: ['Faltando ID do aluno ou da foto'],
        });
      }

      const foto = await Foto.findOne({
        where: { id: foto_id, aluno_id },
      });

      if (!foto) {
        return res.status(400).json({
          errors: ['Foto não encontrada para o aluno especificado'],
        });
      }

      await foto.destroy();

      return res.json({
        mensagem: 'Foto excluída com sucesso',
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new FotoController();
