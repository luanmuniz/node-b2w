# Categorias

Esta seção contém os método de consulta de categorias. Para acessar esta seção do modulo use a key `categories`. Veja os exemplos de cada seção para mais informações.

## Indice

| Metodo                         | Descrição                                                    |
|--------------------------------|--------------------------------------------------------------|
| [getCategories(page, limit)]() | Fornece uma lista paginada com todas as Categorias da loja.  |
| [getAllCategories()]()         | Fornece uma lista com todos os Produtos da loja.             |

## Objeto de categoria

| Parâmetro       | Descrição                           | Type   |
|-----------------|-------------------------------------|--------|
| departamentId   | Id do departamento da categoria     | String |
| departamentName | Titulo do departamento da categoria | String |
| lineId          | Id da linha da categoria            | String |
| lineName        | Titulo da linha da categoria        | String |
| classId         | Id da classe da categoria           | String |
| className       | Titulo da classe da categoria       | String |
| subclassId      | Id da categoria                     | String |
| subclassName    | Titulo da categoria                 | String |

## categories.getCategories(page, limit)
Este método fornece uma lista paginada com todas as Categorias da loja.

### Parâmetros

| Parâmetro | Descrição                           | Obrigatório | Type    | Valor padrão |
|-----------|-------------------------------------|-------------|---------|--------------|
| page      | O numero da página a ser consultado | Não         | Integer | 0            |
| limit     | O numero de itens por página.       | Não         | Integer | 100          |

### Exemplo

```
b2w.categories.getCategories().then(function(result) {
	// Catalogo de categorias
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de categoria](#objeto-de-categoria) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md).

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo                                                  | Integer          |
| itensPerPage | A quantidade de produtos por página                                                                        | Integer          |
| totalPages   | O numero total de páginas disponíveis, calculado usando o numero de itens por página e o total de produtos | Integer          |
| offset       | O offset da lista, ou seja, a partir de qual produto em diante será mostrado                               | Integer          |
| categories   | Lista de categorias disponíveis                                                                            | Array of Objects |

## categories.getAllCategories()
Este método fornece uma lista com todas as Categorias da loja.

### Exemplo

```
b2w.categories.getAllCategories().then(function(result) {
	// Catalogo de todas as categorias
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna algumas informações da página em questão além de um `Array` de [Objeto de categoria](#objeto-de-categoria) conforme a tabela e o exemplo abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md).

| Parâmetro    | Descrição                                                   | Type             |
|--------------|-------------------------------------------------------------|------------------|
| total        | O numero total de produtos disponíveis em todo o catalogo   | Integer          |
| departaments | Lista com todos os departamentos disponíveis                | Array of Objects |
| categories   | Lista de categorias disponíveis                             | Array of Objects |

### Objeto de departamento

| Parâmetro       | Descrição                           | Type   |
|-----------------|-------------------------------------|--------|
| departamentId   | Id do departamento da categoria     | String |
| departamentName | Titulo do departamento da categoria | String |