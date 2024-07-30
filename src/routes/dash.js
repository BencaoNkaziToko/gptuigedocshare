const express = require('express')
const router = express.Router()
const dashController = require('../controllers/dashController')



router.get('/', dashController.login)
router.get('/login', dashController.login)
router.post('/auth', dashController.auth)
router.get('/logout', dashController.logout)

router.get('/index', dashController.index)

router.post('/uploadDocumento', dashController.uploadDocumento)
router.get('/apagar_documento/:id', dashController.apagar_documento)
router.get('/editar_documento/:id', dashController.editar_documento)
router.post('/editar_doc_confirme', dashController.editar_doc_confirme)
router.post('/updateDocumento', dashController.updateDocumento)

router.get('/eliminar_utilizador/:id', dashController.eliminar_utilizador)
router.post('/adicionar_utilizador', dashController.adicionar_utilizador)
router.get('/bloquear_utilizador/:id', dashController.bloquear_utilizador)
router.get('/activar_utilizador/:id', dashController.activar_utilizador)

router.get('/perfil/:id', dashController.perfil)
router.post('/novaPass', dashController.novaPass)
router.post('/editar_dados_utilizador', dashController.editar_dados_utilizador)



module.exports = router
