# Produtos

Esta parte contém os método de consulta de catalogo, produtos e SKU's. Para acessar esta parte do modulo use a key `products`. Veja os exemplos de cada seção para mais informações.

## Indice

| Metodo                                               | Descrição                                                                                                                               |
|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [getCatalog(page, limit)]()                          | Fornece uma lista paginada com todos os Produtos da loja, junto com a lista de SKUs de cada produto.                                    |
| [getCatalogByLastUpdate(dateInHours, page, limit)]() | Fornece uma lista paginada com todos os Produtos da loja filtrados pela data de atualização, junto com a lista de SKUs de cada produto. |
| [getProduct(productId)]()                            | Este serviço permite realizar a busca por um Produto usando o id do mesmo na consulta                                                   |
| [getProductsByCategory(categoryId, page, limit)]()   | Fornece uma lista paginada com todos os Produtos de uma determinada categoria da loja, junto com a lista de SKUs de cada produto.       |
| [getSkus(skuList)]()                                 | Este serviço permite realizar a busca de Produtos por uma listagem de SKU's.                                                            |
| [getSkuAvailability(skuId)]()                        | Este serviço permite consultar a disponibilidade de um SKU.                                                                             |

## Objeto de produto

Todos os métodos desta seção retornam um ou mais Produtos. Em todas os métodos o objeto de produto contém a mesma estrutura. A estrutura usada é de acordo com a tabela abaixo:

| Parâmetros                     | Descrição                                                         | Tipo                 |
|--------------------------------|-------------------------------------------------------------------|----------------------|
| id                             | Id interno do Produto                                             | String               |
| externalId                     | Id do Produto exibido para o cliente final                        | String               |
| name                           | Titulo do produto                                                 | String               |
| dateCreated                    | Data de criação do produto                                        | Date || Empty String |
| lastUpdated                    | Data do ultimo update realizado no produto                        | Date                 |
| description                    | Descrição do produto                                              | String               |
| salePrice                      | Preço de venda final (Produto por:)                               | Float                |
| defaultPrice                   | Preço de venda cheio, sem nenhum desconto (Valor de:)             | Float                |
| category                       | Lista das categorias do produto                                   | Array of Object      |
| category[].id                  | Id interno da categoria                                           | String               |
| category[].externalId          | Id da categoria exibido para o cliente final                      | String               |
| category[].name                | Titulo da categoria                                               | String               |
| secondaryCategories            | Objeto da categoria secundária                                    | Object               |
| secondaryCategories.id         | Id interno da categoria                                           | String               |
| secondaryCategories.externalId | Id da categoria exibido para o cliente final                      | String               |
| secondaryCategories.name       | Titulo da categoria                                               | String               |
| images                         | Lista das imagens do produto                                      | Array of Objects     |
| images[].type                  | Tamanho da imagem                                                 | String               |
| images[].link                  | URL da imagem                                                     | String               |
| brand                          | Marca do produto                                                  | String               |
| gift                           | Indica se o produto está disponível para presente                 | Boolean              |
| sku                            | Lista de SKU's do produto                                         | Array of Objects     |
| sku[].id                       | Id interno do SKU                                                 | String               |
| sku[].externalId               | Id do SKU exibido para o cliente final                            | String               |
| sku[].salePrice                | Valor de venda final do SKU                                       | Float                |
| sku[].defaultPrice             | Valor de venda cheio do SKU                                       | Float                |
| sku[].variation                | Descrição do SKU, descrevendo qual variação do produto é este SKU | String               |
| sku[].isAvailable              | Indica a disponibilidade do SKU                                   | Boolean              |

## products.getCatalog(page, limit)
Este método fornece uma lista paginada com todos os Produtos da loja, junto com a lista de SKUs de cada produto.

### Parâmetros

| Parâmetro | Descrição                           | Obrigatório | Type    | Valor padrão |
|-----------|-------------------------------------|-------------|---------|--------------|
| page      | O numero da página a ser consultado | Não         | Integer | 0            |
| limit     | O numero de itens por página.       | Não         | Integer | 100          |

### Exemplo

```
b2w.products.getCatalog().then(function(result) {
	// Catalogo de produto
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de produtos](#objeto-de-produto) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). 

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo                                                  | Integer          |
| itensPerPage | A quantidade de produtos por página                                                                        | Integer          |
| totalPages   | O numero total de páginas disponíveis, calculado usando o numero de itens por página e o total de produtos | Integer          |
| offset       | O offset da lista, ou seja, a partir de qual produto em diante será mostrado                               | Integer          |
| products     | Lista de produtos disponíveis                                                                              | Array of Objects |

## getCatalogByLastUpdate(dateInHours, page, limit)
Este método fornece uma lista paginada com todos os Produtos da loja filtrados pela data de atualização, junto com a lista de SKUs de cada produto.

### Parâmetros

| Parâmetro   | Descrição                                        | Obrigatório | Type    | Valor padrão |
|-------------|--------------------------------------------------|-------------|---------|--------------|
| dateInHours | Tempo em horas da ultima atualização em diante   | Sim         | Integer | -            |
| page        | O numero da página a ser consultado              | Não         | Integer | 0            |
| limit       | O numero de itens por página.                    | Não         | Integer | 100          |

### Exemplo

```
b2w.products.getCatalogByLastUpdate(48).then(function(result) {
	// Catalogo de produto
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de produtos](#objeto-de-produto) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). 

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo                                                  | Integer          |
| itensPerPage | A quantidade de produtos por página                                                                        | Integer          |
| totalPages   | O numero total de páginas disponíveis, calculado usando o numero de itens por página e o total de produtos | Integer          |
| offset       | O offset da lista, ou seja, a partir de qual produto em diante será mostrado                               | Integer          |
| products     | Lista de produtos disponíveis                                                                              | Array of Objects |

## getProduct(productId)
Este método permite realizar a busca por um Produto usando o id do mesmo na consulta.

### Parâmetros

| Parâmetro | Descrição                      | Obrigatório | Type    | Valor padrão |
|-----------|--------------------------------|-------------|---------|--------------|
| productId | Id do produto a ser consultado | Sim         | Integer | -            |

### Exemplo

```
b2w.products.getProduct(123456).then(function(result) {
	// Objeto de produto
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna um Objeto de produto conforme a indicado no inicio deste arquivo, na seção [Objeto de produto](#objeto-de-produto).
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). 

## getProductsByCategory(categoryId, page, limit)
Este método fornece uma lista paginada com todos os Produtos de uma determinada categoria da loja, junto com a lista de SKUs de cada produto.

### Parâmetros

| Parâmetro  | Descrição                           | Obrigatório | Type    | Valor padrão |
|------------|-------------------------------------|-------------|---------|--------------|
| categoryId | Id da categoria a ser consultado    | Sim         | Integer | -            |
| page       | O numero da página a ser consultado | Não         | Integer | 0            |
| limit      | O numero de itens por página.       | Não         | Integer | 100          |

### Exemplo

```
b2w.products.getProductsByCategory(123456).then(function(result) {
	// Catalogo de produto
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de produtos](#objeto-de-produto) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). 

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo                                                  | Integer          |
| itensPerPage | A quantidade de produtos por página                                                                        | Integer          |
| totalPages   | O numero total de páginas disponíveis, calculado usando o numero de itens por página e o total de produtos | Integer          |
| offset       | O offset da lista, ou seja, a partir de qual produto em diante será mostrado                               | Integer          |
| products     | Lista de produtos disponíveis                                                                              | Array of Objects |

## getSkus(skuList)
Este método permite realizar a busca de Produtos por uma listagem de SKU's.

### Parâmetros

| Parâmetro | Descrição                    | Obrigatório | Type                       |
|-----------|------------------------------|-------------|----------------------------|
| skuList   | Lista de SKU's para consulta | Sim         | Array of Strings || String |

### Exemplo

```
b2w.products.getSkus(123456).then(function(result) {
	// Objeto do Sku
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de produtos](#objeto-de-produto) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). /Users/luanmuniz/Projects/node-b2w/docs/pt-br/Categories.md

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo                                                  | Integer          |
| products     | Lista de produtos disponíveis                                                                              | Array of Objects |

## getSkuAvailability(skuId)
Este método permite consultar a disponibilidade de um SKU.

### Parâmetros

| Parâmetro | Descrição | Obrigatório | Type   |
|-----------|-----------|-------------|--------|
| skuId     | Id do Sku | Sim         | String |

### Exemplo

```
b2w.products.getSkuAvailability(123456).then(function(result) {
	// Resultado de disponibilidade
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de produtos](#objeto-de-produto) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md). 

| Parâmetro    | Descrição                                             | Type    |
|--------------|-------------------------------------------------------|---------|
| externalId   | Id do Produto exibido para o cliente final            | String  |
| name         | Titulo do produto                                     | String  |
| isAvailable  | Indica a disponibilidade do SKU                       | Boolean |
| salePrice    | Preço de venda final (Produto por:)                   | Float   |
| defaultPrice | Preço de venda cheio, sem nenhum desconto (Valor de:) | Float   |

