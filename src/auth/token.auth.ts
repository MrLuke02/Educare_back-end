import { Response } from "express";
import JWT from "jsonwebtoken";

// criando o metodo de geração do token, com retorno em forma de promise
const generate = (payload: Object, res: Response) =>
  new Promise((resolve) => {
    // chamando o metodo sign do JWT que é o metodo que de fato cria o token
    JWT.sign(
      // conteúdo do token
      payload,
      // chave secreta
      process.env.SECRET_KEY,
      // opções/configurações, aqui no caso foi passado o algoritmo usado e o tempo de expiração
      {
        algorithm: "HS256",
        expiresIn: "1h",
      },
      // a função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err, token) {
        if (err) {
          return res.status(400).json({ error: "Token inválido!" });
        }
        resolve(token);
      }
    );
  });

// exportando a funcao
export { generate };
