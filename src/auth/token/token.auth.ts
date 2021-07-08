import JWT, { DefaultToken, VerifyErrors } from "jsonwebtoken";
import { SECRET_KEY } from "../../env/token";
import { Status } from "../../env/status";

// criando o metodo de geração do token, com retorno em forma de promise
const createToken = (payload: Object): Promise<string> => {
  return new Promise((resolve, reject) => {
    // chamando o metodo sign do JWT responsável por criar o token
    JWT.sign(
      // conteúdo do token
      payload,
      // chave secreta
      SECRET_KEY,
      // opções/configurações, aqui no caso foi passado o algoritmo usado e o tempo de expiração
      {
        algorithm: "HS512",
        expiresIn: "1h",
      },
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err: Error, token: string) {
        if (err) {
          reject({ Message: Status.CREATION_ERROR_TOKEN, Status: 500 });
        }
        resolve(token);
      }
    );
  });
};

// criando o metodo de verificação do token, com retorno em forma de promise
const verifyToken = (token: string): Promise<DefaultToken> => {
  return new Promise((resolve, reject) => {
    // chamando o metodo verify do JWT responsável por verificar o token
    JWT.verify(
      // token a ser verificado
      token,
      // chave secreta
      SECRET_KEY,
      // algoritmo que foi usado para criptografar o token
      {
        algorithms: ["HS512"],
      },
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err: VerifyErrors, token: DefaultToken) {
        if (err) {
          reject({ Message: Status.EXPIRED_SESSION, Status: 401 });
        }
        resolve(token);
      }
    );
  });
};

// exportando as funcões
export { createToken, verifyToken };
