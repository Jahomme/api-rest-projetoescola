import multer from 'multer';
import multerConfig from '../config/multerConfig';

import Foto from '../models/Foto';
import Aluno from '../models/Aluno';

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

  async update(req, res) {
    const { aluno_id } = req.params;
    // const { fotos } = req.body;

    try {
      const aluno = await Aluno.findByPk(aluno_id);
      if (!aluno) {
        return res.status(404).json({
          mensagem: 'Aluno não encontrado',
        });
      }

      aluno.Fotos = req.body;

      await aluno.update();

      return res.status(200).json({ mensagem: 'Disposição das fotos atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar a disposição das fotos:', error);
      return res.status(400).json({ mensagem: 'Erro ao atualizar a disposição das fotos.' });
    }
  }
}

export default new FotoController();
