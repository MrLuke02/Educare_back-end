import { Router } from "express";
import { verifyToken } from "../auth/token/token.auth";

const routerToken = Router();

// criando a rota de cadastro de Roles
routerToken.post("/validationToken", async (req, res) => {
  const { token } = req.body;

  const newToken = await verifyToken(token);

  return res.status(200).json({ tokenDecrypted: newToken });
});

// exportando o router
export { routerToken };
