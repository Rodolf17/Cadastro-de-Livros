const express = require("express");
const Joi = require("joi"); // usado para validação
const app = express();
app.use(express.json());
// app.use(express.static(__dirname));

const livros = [
  { titulo: "Livro A", id: 1 },
  { titulo: "Livro B", id: 2 },
  { titulo: "Livro C", id: 3 },
  { titulo: "Livro D", id: 4 },
];

app.get("/", (req, res) => {
  res.send("Seja bem vindo a Api Rest em node.js!");
});

// manipulador para retornar todos os livros
app.get("/api/livros", (req, res) => {
  res.send(livros);
});

//manipulador de solicitações para pesquisar um livro pelo Id
app.get("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );

  if (!livro)
    res.status(404).send("Não foi possivel encontrar o livro solicitado!");
  res.send(livro);
});

//manipulador de solicitações para criar um livro
app.post("/api/livros", (req, res) => {
  const { error } = new validarLivro(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const livro = {
    id: livros.length + 1,
    titulo: req.body.titulo,
  };
  livros.push(livro);
  res.send(livro);
});

//manipulador de solicitações para atualizar um livro
app.put("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );
  if (!livro)
    res.status(404).send("Não foi possivel encontra o livro solicitado");

  const { error } = validarLivro(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  livro.titulo = req.body.titulo;
  res.send(livro);
});

//manipulador de solicitações para deletar um livro
app.delete("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );
  if (!livro)
    res.status(404).send("Não foi possivel encontrar o livro solicitado");

  const index = livros.indexOf(livro);
  livros.splice(index, 1);

  res.send(livro);
});

// função para validar o campo titulo do livro
function validarLivro(livro) {
  const schema = Joi.object({
    titulo: Joi.string().min(3).empty().required().messages({
      "string.min": "O campo titulo deve ter, no minimo, {#limit} caracteres.",
      "string.empty": "O campo titulo não pode ta vazio.",
      "any.required": "O campo titulo é obrigatorio.",
    }),
  });

  const resultado = schema.validate(livro);
  return resultado;
}

// A PORTA É UMA VARIAVEL AMBIENTE
const porta = process.env.PORT || 8080;
app.listen(porta, () => console.log("Servidor Iniciador na porta: " + porta));
