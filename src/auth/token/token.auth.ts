import JWT, { VerifyErrors } from "jsonwebtoken";
import { Message } from "../../env/message";
import { AppError } from "../../errors/AppErrors";

type TokenType = {
  sub: string;
  roles: string[];
};

// codigo usado para a criação da chave secreta
// node -e "console.log(require('crypto').randomBytes(256).toString('base64'));

// criando o metodo de geração do token, com retorno em forma de promise
const createToken = (payload: Object): Promise<string> => {
  return new Promise((resolve) => {
    // chamando o metodo sign do JWT responsável por criar o token
    JWT.sign(
      // conteúdo do token
      payload,
      // chave secreta
      process.env.SECRET_KEY,
      // opções/configurações, aqui no caso foi passado o algoritmo usado e o tempo de expiração
      {
        algorithm: "HS512",
        expiresIn: "1h",
      },
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err: Error, token: string) {
        if (err) {
          throw new AppError(Message.CREATION_ERROR_TOKEN, 500);
        }
        resolve(token);
      }
    );
  });
};

// criando o metodo de verificação do token, com retorno em forma de promise
const verifyToken = (token: string): Promise<TokenType> => {
  return new Promise((resolve) => {
    // chamando o metodo verify do JWT responsável por verificar o token
    JWT.verify(
      // token a ser verificado
      token,
      // chave secreta
      process.env.SECRET_KEY,
      // algoritmo que foi usado para criptografar o token
      {
        algorithms: ["HS512"],
      },
      // função para retornar o token caso ocorra tudo bem, caso de algo errado retorna um json de error
      function (err: VerifyErrors, token: TokenType) {
        if (err) {
          if (err.name === "TokenExpiredError") {
            throw new AppError(Message.EXPIRED_SESSION, 401);
          } else if (err.name === "JsonWebTokenError") {
            throw new AppError(Message.INVALID_TOKEN, 401);
          } else {
            throw new AppError(err.name, 401);
          }
        }
        resolve(token);
      }
    );
  });
};

// exportando as funcões
export { createToken, verifyToken };
