# Introdução

Este modulo é uma abstração da API do Grupo B2W para clientes B2B. Para utilizar esta API é necessário entrar em contato com o Grupo B2W e firmar acordos comerciais. Então antes de continuar, tenha certeza que você tem todas as permissões e chaves de acesso.

## Esclarecimentos

Este modulo não é oficial, isso significa que não foi criado pela equipe do Grupo B2W e sim por um parceiro terceiro. Caso você precise de algum suporte ou orientação para usar este modulo por favor crie um issue neste repositório e NÃO entre em contato com o suporte técnico do Grupo B2W.

Este modulo não contém nenhuma informação privilegiada sendo somente uma abstração da API Publica para os parceiros B2B. Se você trabalha dentro do Grupo B2W e ficou preocupado com o conteúdo deste projeto, desde já esclareço que não existe nenhum dado de natureza privada e ou interna. Caso você precise de algum esclarecimento de qualquer natureza você pode entrar em contato criando uma issue [clicando aqui](/issues/new) ou através do email [suporte@zimp.me](mailto:suporte@zimp.me)

## Instalação

Todo o modulo está na `npm` e pode ser instalado através do comando:

```bash
npm install b2w
```

## Inicialização

Para iniciar o modulo você deve usar a função `init(credenciais, ambiente)`. <br>
Esta função recebe 2 argumentos sendo o primeiro um objeto contendo as credenciais e o segundo o nome do ambiente a ser usado conforme o exemplo abaixo, passando os parâmetros corretos:

```javascript
var b2w = require('b2w').init({
	symbol: 'symbol',
	company: 'company',
	login: 'login' ,
	password: 'password',
}, 'development');
```
### Parametros

O primeiro argumento deve ser um `Object` com as chaves exemplificadas acima.
Os parâmetros `symbol`, `login` e `password` serão enviados pelo Grupo B2W.<br>
O parâmetro `company` é usado para informar qual das lojas você deseja consultar e recebe um destes 3 valores:

- `americanas`
- `submarino`
- `shoptime`

Como segundo argumento a função recebe o nome do ambiente que será usado na aplicação. A API fornece um ambiente de homologação para testes, para usar este ambiente, passe como segundo argumento o valor `development`.

### Retorno

Como retorno do método `init()` temos o modulo inicializado com acesso aos objetos abaixo. Clique para acessar a documentação de cada método:

```json
{
	"products": [Object],
	"tracking": [Object],
	"categories": [Object],
	"order": [Object],
	"client": [Object]
}
```

- [b2w.products](/docs/pt-br/Products.md) - Este modulo contem todos os métodos de consulta de catalogo, produtos e SKU's
- [b2w.tracking](/docs/pt-br/Tracking.md) - Este modulo contém todas os métodos de consulta de frete
- [b2w.categories](/docs/pt-br/Categories.md) - Este modulo contém todas os métodos de consulta de categorias disponíveis no catalogo
- [b2w.order](/docs/pt-br/Orders.md) - Este modulo contém todas os métodos de consulta e criação de pedidos
- [b2w.client](/docs/pt-br/Clients.md) - Este modulo contém todas os métodos de consulta de clientes

### Error

Para acessar a tabela de erros bem como as informações de como os mesmos são retornados. [Clique aqui](/docs/pt-br/Errors.md)

## Documentação oficial da API

Este modulo é uma abstração da API para Nodejs. Caso você queira acesso a documentação oficial da API em seu "estado natural". Baixe a versão 1.9 da documentação em HTML [Clicando aqui](https://raw.githubusercontent.com/ZimpFidelidade/node-b2w/master/docs/official-api-docs.html) e abra-a no seu navegador.





