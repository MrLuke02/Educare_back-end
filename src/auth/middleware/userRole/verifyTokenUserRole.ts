import { Request, Response } from "express";
import { verifyToken } from "../../token.auth";

// função para a verificação dos tokens
const verifyTokenUserRole = async (
  req: Request,
  res: Response,
  next: Function
) => {
  // armazenando o token retornado da função
  const token = await verifyToken(req.headers.authorization.split(" ")[1], res);

  // verificando se o token é de um administrador
  if (token["roles"].some((role: string) => role === "ADM")) {
    // avança para o proximo middleware
    next();
  } else {
    // caso o token não seja de um administrador, retorna um json de error
    return res.status(401).json({ error: "Token inválido!" });
  }
};

// exportando a função VerifyTokenUser
export { verifyTokenUserRole };
