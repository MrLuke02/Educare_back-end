import { Response } from "express";
import JWT from "jsonwebtoken";

// criando o metodo de geração do token, com retorno em forma de promise
const createToken = (payload: Object, res: Response) => {
  return new Promise((resolve) => {
    // chamando o metodo sign do JWT responsável por criar o token
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
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err, token) {
        if (err) {
          return res.status(400).json({ error: "Token inválido!" });
        }
        resolve(token);
      }
    );
  });
};

// criando o metodo de verificação do token, com retorno em forma de promise
const verifyToken = (token: string, res: Response) => {
  return new Promise((resolve) => {
    // chamando o metodo verify do JWT responsável por verificar o token
    JWT.verify(
      // token a ser verificado
      token,
      // chave secreta
      process.env.SECRET_KEY,
      // algoritmo que foi usado para criptografar o token
      {
        algorithms: ["HS256"],
      },
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err, token) {
        if (err) {
          return res.status(400).json({ error: "Sessão expirada!" });
        }
        resolve(token);
      }
    );
  });
};

// exportando as funcões
export { createToken, verifyToken };
