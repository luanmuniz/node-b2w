# Erros

Esta seção trata dos erros do sistema. Todos os erros são capturados via `.catch()`.

## Objeto de Erro

Em todos os métodos o objeto de erro contém a mesma estrutura. A estrutura usada é de acordo com a tabela abaixo:

| Parâmetro | Descrição                                                                       | Type              |
|-----------|---------------------------------------------------------------------------------|-------------------|
| success   | Indica se a requisição foi completa com sucesso, neste case será sempre `false` | Boolean           |
| code      | Código do erro na lib                                                           | String            |
| message   | Mensagem descritiva de qual é o problema                                        | String            |
| err       | Instancia de Error() caso este for declarado                                    | Instance of Error |

## Lista de Erros

| Seção    | Código             | Mensagem                                                   |
|----------|--------------------|------------------------------------------------------------|
| core     | requestError       | Request Error                                              |
| core     | missingCredentials | You need to pass your credentials to initialize the module |
| core     | companyNotFound    | This company does not exist                                |
| products | missingId          | You need to pass a valid id                                |
| products | missingIds         | You need to pass a valid array of id                       |
| products | productNotFound    | Product not found                                          |
| products | categoryNotFound   | Category not found                                         |
| products | skuNotFound        | Sku not found                                              |
| products | invalidDate        | You need to pass a valid date                              |
| client   | missingId          | You need to pass a valid id                                |
| client   | clientNotFound     | Client not found                                           |
| category | missingId          | You need to pass a valid id                                |
| tracking | missingZipCode     | You need to pass a valid zipcode                           |
| tracking | missingPayment     | You need to pass a valid payment type                      |
| tracking | missingSku         | You need to pass a valid Sku                               |

## Lista de Erros da seção de Pedidos (`b2w.order`)