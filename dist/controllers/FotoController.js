"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multerConfig = require('../config/multerConfig'); var _multerConfig2 = _interopRequireDefault(_multerConfig);

var _Foto = require('../models/Foto'); var _Foto2 = _interopRequireDefault(_Foto);

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
