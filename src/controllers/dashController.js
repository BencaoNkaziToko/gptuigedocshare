const connection = require('../database/db')
var multer = require('multer');
var fs = require('fs')
const path = require("path");

function gerarCodigoAleatorio() {
    const tamanhoCodigo = 10; // Tamanho do código que deseja gerar
    const caracteres = '123456789ABCDEFGHIJabcdefghijklmnopqrstuvwxyzxKLMNOPQRSTUVWXYZ'; // Caracteres permitidos para gerar o código
    let codigo = '';
  
    for (let i = 0; i < tamanhoCodigo; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length)); // Adiciona um caractere aleatório ao código
    }
  
    return codigo;
  }
  
  
  
  let  codigoAleatorio = "G-" + gerarCodigoAleatorio();
  


exports.login = async(req, res) =>{
    req.session.destroy()
    res.render('login')
}

exports.index = async(req, res) =>{
    req.session.utilizador
    let mesAtual = 7
    let anoAtual = 2024
    let consultaGeral= `SELECT *FROM documento order by dataCadastro`
    let consultaDocHoje = `SELECT COUNT(id) AS TOTAL FROM documento WHERE dataCadastro=curdate()`
    let conultaDocMes = `SELECT COUNT(id) AS TOTAL FROM documento WHERE MONTH(dataCadastro)= ${mesAtual}`
    let conultaDocAno = `SELECT COUNT(id) AS TOTAL FROM documento WHERE YEAR(dataCadastro)= ${anoAtual}`
    let consultaCompleta= `SELECT nome, titulo, documento.id, caminho, documento.idUtilizador, descricao, dataCadastro FROM documento LEFT JOIN utilizador ON documento.idUtilizador = utilizador.id order by dataCadastro`
    let cons_utilizadores = 'SELECT *FROM utilizador ORDER BY nome'
    if(req.session.utilizador){
        connection.query(consultaGeral,(error, documentosGeral)=>{
            connection.query(consultaDocHoje,(error, documentosHoje)=>{
                connection.query(conultaDocMes,(error, documentosMes)=>{
                    connection.query(conultaDocAno,(error, documentosAno)=>{
                        connection.query(consultaCompleta,(error, documentosGeralCompleto)=>{
                            connection.query(cons_utilizadores,(error, Utilizadores)=>{
                                res.render('index', {dados_utilizador: req.session.utilizador, documentosGeral, documentosHoje, documentosMes, documentosAno, documentosGeralCompleto, Utilizadores})
                            })
                        })
                    })
                })
            })
        })
    }else{
        req.session.destroy()
        res.redirect('/login')
    }
}

exports.logout = async(req, res) =>{
    req.session.destroy()
    res.redirect('/')
}


exports.auth = async(req, res) =>{
    const {nomeUtilizador, PalavraPasse} = req.body
    connection.query(`select * from utilizador where nomeUtilizador = '${nomeUtilizador}' and palavraPasse = '${PalavraPasse}'`, 
    (error, result)=>{
        if(error) throw error
        if(result.length === 1){
            req.session.utilizador = result
            if(result[0].estado == 'Bloqueado'){
                res.render('bloqueado', {dados_utilizador: req.session.utilizador} )
            }else{
                res.redirect("/index")
            }
        }else{
            res.redirect("/")
        }
    })
}




exports.apagar_documento = async(req, res)=>{
    const {id} = req.params
    let deletar = `DELETE FROM documento WHERE id=${id}`
    connection.query(deletar,(error, result)=>{
        res.redirect('/index')
    })
}

exports.editar_documento = async(req, res)=>{
    const {id} = req.params
    let editar = `SELECT *FROM documento WHERE id=${id}`
    connection.query(editar,(error, documento)=>{
        res.render('editarDoc', {documento})
    })
}

exports.editar_doc_confirme =  async(req, res)=>{
    const {id, titulo, descricao} = req.body
    let editar = `UPDATE documento SET titulo = '${titulo}', descricao = '${descricao}' WHERE id=${id}`
    connection.query(editar,(error, result)=>{
        res.redirect('/index')
    })
}


exports.eliminar_utilizador = async(req, res)=>{
    const {id} = req.params
    let deletar = `DELETE FROM utilizador WHERE id=${id}`
    connection.query(deletar,(error, result)=>{
        res.redirect('/index')
    })
}

exports.adicionar_utilizador = async(req, res)=>{
    const nivel = "Comum"
    const estado = "Activo"
    const {nome, nomeUtilizador, palavraPasse} = req.body
    let inserir = `INSERT INTO utilizador VALUES(NULL, '${nome}', '${nomeUtilizador}', '${palavraPasse}', '${nivel}','${estado}')`
    connection.query(inserir,(error, result)=>{
        res.redirect('/index')
    })
}

exports.bloquear_utilizador = async(req, res)=>{
    const estado = "Bloqueado"
    const {id} = req.params
    let bloquear = `UPDATE utilizador SET estado = '${estado}' WHERE id=${id}`
    connection.query(bloquear,(error, result)=>{
        res.redirect('/index')
    })
}

exports.activar_utilizador = async(req, res)=>{
    const estado = "Activado"
    const {id} = req.params
    let activar = `UPDATE utilizador SET estado = '${estado}' WHERE id=${id}`
    connection.query(activar,(error, result)=>{
        res.redirect('/index')
    })
}

exports.perfil = async(req, res)=>{
    const {id} = req.params
    let mostrarPerfil = `SELECT *FROM utilizador WHERE id=${id}`
    connection.query(mostrarPerfil,(error, perfil)=>{
        res.render('perfil', {perfil})
    })
}

  
exports.novaPass =  async(req, res)=>{
    const {id, novaPalavra_passe} = req.body
    let alterar = `UPDATE utilizador SET palavraPasse = '${novaPalavra_passe}' WHERE id=${id}`
    connection.query(alterar,(error, result)=>{
        req.session.destroy()
        res.redirect('/')
    })
}


exports.editar_dados_utilizador = async(req, res)=>{
    const {id, nome, nomeUtilizador} = req.body
    let alterar = `UPDATE utilizador SET nome = '${nome}', nomeUtilizador = '${nomeUtilizador}' WHERE id=${id}`
    connection.query(alterar,(error, result)=>{
        req.session.destroy()
        res.redirect('/')
    })
}

// Defina uma variável para armazenar o caminho do arquivo
var filePath = null;

// Verifica se a pasta já foi criada
fs.stat('./public/uploads', function(err, stats) {
  if (err) {
    // Cria a pasta se ela não existir
    fs.mkdir('./public/uploads', function(err) {
      if (err) {
        console.log(err.stack);
      } else {
        console.log('Pasta "uploads" criada com sucesso.');
      }
    });
  } else { 
    console.log('Pasta "uploads" já existe.');
  }
});

var fileName = null; 
var ext = null;

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
      ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
      fileName = file.fieldname +'_'+codigoAleatorio+''+ext;
      var filePath = './public/uploads/' + fileName;
      callback(null, fileName);
    }
});



exports.uploadDocumento = async(req, res) => {
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        var Titulo= req.body.titulo
        var Descricao = req.body.descricao
        var Id = req.body.id
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        sql = `insert into documento values(null, '${Titulo}', '${Descricao}', curdate(), '${fileName}', '${ext}', ${Id})`
        connection.query(sql, (error, resultado)=>{
            if(error) throw error
            res.redirect('/index')
        })    
    })    
}

exports.updateDocumento = async(req, res) => {
    
    var upload = multer({ storage: storage }).single('userFile');
    upload(req, res, function(err) {
        var Id = req.body.id
        if (err) {
            return res.end("Erro ao fazer upload do arquivo.");
        }
        sql = `UPDATE documento SET dataCadastro = CURDATE(), caminho = '${fileName}', extensao = '${ext}' WHERE id = ${Id}`
        connection.query(sql, (error, resultado)=>{
            if(error) throw error
            res.redirect('/index')
        })    
    })  
}
