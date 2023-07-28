"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerConfig = require('../config/multerConfig'); var _multerConfig2 = _interopRequireDefault(_multerConfig);

var _Foto = require('../models/Foto'); var _Foto2 = _interopRequireDefault(_Foto);
var _Aluno = require('../models/Aluno'); var _Aluno2 = _interopRequireDefault(_Aluno);

const upload = _multer2.default.call(void 0, _multerConfig2.default).single('foto');

class FotoController {
  async index(req, res) {
    try {
      const { aluno_id } = req.params;

      if (!aluno_id) {
        return res.status(400).json({
          errors: ['Faltando ID do aluno'],
        });
      }

      const fotos = await _Foto2.default.findAll({
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
        const foto = await _Foto2.default.create({ originalname, filename, aluno_id });

        return res.json(foto);
      } catch (e) {
        return res.status(400).json({
          errors: ['Aluno não existe.'],
        });
      }
    });
  }

  async update(req, res) {
    const { aluno_id } = req.params;
    const { fotos } = req.body;

    try {
      const aluno = await _Aluno2.default.findByPk(aluno_id);
      if (!aluno) {
        return res.status(404).json({
          mensagem: 'Aluno não encontrado',
        });
      }

      // Update the photos in the database
      await Promise.all(
        fotos.map((foto) => _Foto2.default.update({ id: foto.id }, { where: { aluno_id } })),
      );

      return res.status(200).json({ mensagem: 'Disposição das fotos atualizada com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar a disposição das fotos:', error);
      return res.status(400).json({ mensagem: 'Erro ao atualizar a disposição das fotos.' });
    }
  }

  async delete(req, res) {
    try {
      const { aluno_id, foto_id } = req.params;

      if (!aluno_id || !foto_id) {
        return res.status(400).json({
          errors: ['Faltando ID do aluno ou da foto'],
        });
      }

      const foto = await _Foto2.default.findOne({
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

exports. default = new FotoController();
