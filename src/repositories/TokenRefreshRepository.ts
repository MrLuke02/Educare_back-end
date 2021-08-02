import { EntityRepository, Repository } from "typeorm";

import { TokenRefresh } from "../models/TokenRefresh";

// criando o repositorio customizado/personalizado passando o model
@EntityRepository(TokenRefresh)
// extendendo a classe Repository, passando também o model
class TokenRefreshRepository extends Repository<TokenRefresh> {}

// exportando a classe
export { TokenRefreshRepository };
