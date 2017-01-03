# Frete

Esta seção contém o método de consulta de frete. Para acessar esta seção do modulo use a key `tracking`. Veja os exemplos de cada seção para mais informações.

## Indice

| Metodo                                                   | Descrição                                                                                                       |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [getTrackingInfo(zipCode, paymentType, skuObj, copum)]() | Fornece os dados de frete para a entrega do produto enviado no cep enviado com os devidos descontos aplicados.  |

## tracking.getTrackingInfo(zipCode, paymentType, skuObj, copum)
Este método ornece os dados de frete para a entrega do produto enviado no cep enviado com os devidos descontos aplicados.

### Parâmetros

| Parâmetro       | Descrição | Obrigatório | Type     | Valor padrão |
|-----------------|-----------|-------------|----------|--------------|
| zipCode         |           | Sim         | String   | -            |
| paymentType     |           | Sim         | String   | -            |
| skuObj          |           | Sim         | Object   | -            |
| skuObj.id       |           | Sim         | String   | -            |
| skuObj.quantity |           | Não         | Integer  | -            |
| skuObj.similar  |           | Não         | String   | -            |
| copum           |           | Não         | String   | -            |

### Exemplo

```
b2w.tracking.getTrackingInfo('04570000', 'corporate', { id: 123456 }).then(function(result) {
	// Objeto de frete
}).catch(function(err) {
	// Objeto de Erro
});
```

### Retorno

Este método retorna um obejto conforme a tabela abaixo.
Em caso de erro será retornado dentro no método `.catch()` um [objeto de Erro](/docs/pt-br/Errors.md).

| Parâmetro    | Descrição                                                                                                  | Type             |
|--------------|------------------------------------------------------------------------------------------------------------|------------------|
