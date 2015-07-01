sdk-javascript
==============

SDK em JavaScript para utilizar as chamadas públicas do Frete.co

#frete.co.js - Módulo em Angular.js para integração com o Frete.co!

##Inclua o frete.co na suas dependencias:

var app = angular.module('seuApp',['Freteco']);

Configure seu appkey:

```javascript
angular.module('seuApp').config(function(FretecoProvider) {
  FretecoProvider.setApiKey('seu app key');
});
```

##Fazendo consulta de CEP:

```javascript
angular.module('seuApp').controller('suaController', function($scope, Freteco) {
  $scope.getAddressFromZipcode = function (zipcode) {
    Freteco.getAddressFromZipcode(zipcode)
      .then(function (response) {
        $scope.address = response;
      })
      .catch(function(error) {
        throw new Error(error);
      });
  };
});
```

##Fazendo consulta de Frete:

```javascript
angular.module('seuApp').controller('suaController', function($scope, Freteco) {
  $scope.getDeliveryCost = function(nCdServico, sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento, nCdEmpresa, sDsSenha) {

    Freteco.getDelivery(nCdServico, sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento, nCdEmpresa, sDsSenha)
      .then(function (response) {
        $scope.deliveryCost = response.total;
      })
      .catch(function (err) {
        $console.error(err);
      });
  };
});
```

###Fazendo consulta de Frete pré definida:

É possível pré configurar as dimensões do produto, tipo de entrega e contrato com correios para que estas informações sejam sempre utilizadas.

```javascript
angular.module('seuApp').config(function(FretecoProvider) {
  FretecoProvider.setApiKey('seu app key');
  FretecoProvider.predefProductDimension(nCdFormato, nVlPeso, nVlAltura, nVlLargura, nVlDiametro, nVlComprimento);
  FretecoProvider.predefDeliveryType(nCdServico, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento);
  FretecoProvider.predefContract(nCdEmpresa, sDsSenha);
});
```

Agora para calcular um frete é só utilizar a chamada mais simples:
```javascript
angular.module('seuApp').controller('suaController', function($scope, Freteco) {
  $scope.getPredefDelivery = function (sCepOrigem, sCepDestino) {
    Freteco.getPredefDelivery(sCepOrigem, sCepDestino)
      .then(function (response) {
        $scope.delivery = response;
      })
      .catch(function(error) {
        throw new Error(error);
      });
  };
});
```


## Parâmetros:

Os parâmetros são iguais aos da API dos correios:

Parâmetro  | Descrição
------------- | -------------
nCdServico | Código do serviço: (40010: SEDEX Varejo), (40045: SEDEX a Cobrar Varejo), (40215: SEDEX 10 Varejo), (40290: SEDEX Hoje Varejo), (41106: PAC Varejo)
sCepOrigem | CEP de origem.
sCepDestino | CEP de destino.
nVlPeso | Peso da encomenda, incluindo sua embalagem. O peso deve ser informado em quilogramas. Se o formato for Envelope, o valor máximo permitido será 1kg.
nCdFormato | Formato da encomenda (incluindo embalagem). (1: Formato caixa/pacote), (2: Formato rolo/prisma), (3: Envelope)
nVlComprimento | Comprimento da encomenda (incluindo embalagem), em centímetros.
nVlAltura | Altura da encomenda (incluindo embalagem), em centímetros. Se o formato for envelope, informar zero (0).
nVlLargura | Largura da encomenda (incluindo embalagem), em centímetros.
nVlDiametro | Diâmetro da encomenda (incluindo embalagem), em centímetros.
sCdMaoPropria | Indica se a encomenda será entregue com o serviço adicional mão própria. (S – Sim, N – Não).
nVlValorDeclarado | Indica se a encomenda será entregue com o serviço adicional valor declarado.
    Neste campo deve ser apresentado o valor declarado desejado, em Reais.
sCdAvisoRecebimento | Indica se a encomenda será entregue com o serviço adicional aviso de recebimento. (S – Sim, N – Não).
