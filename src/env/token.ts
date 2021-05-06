// criando a constante de chave secreta para a criação do token
const SECRET_KEY = `k/sVUH6H4NDMEODa8xoKXFe6tz5IjlLZ6DuMZKfCRFymB1ihaQFc0PLIekYovMbQPrOo22Nw8fnZ
JA++lXGZ173jna6y8AxTnXDwsME3Nv/h4SqqPAKanVGCaTwPMshOksfE1sUcAci7U1+X2lImHub7E
pgRUP1oUqptJygSEi+BNv5eSn54i1dNm9Dj/aacJtxalZhFWyoXtwevgmpDuL/dR6CTqRPs2eXiqF
N6UtuO07ruEElmuYqb7VwiBTuyWRz9Tu/ZbIdsuS21KUctJXn97ET8wYYVGwEpOphpJso+tqm6NAM
4L6/qhFRnTvlOmy8SVqik36+6spILbHW5HQ==`;

// exportando a chave secreta
export { SECRET_KEY };

// codigo usado para a criação da chave secreta
// node -e "console.log(require('crypto').randomBytes(256).toString('base64'));
