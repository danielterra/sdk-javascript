/**
  Frete.co Module
  Author: daniel.borlino@ingresse.com
  nCdServico - Código do serviço:
  40010 SEDEX Varejo
  40045 SEDEX a Cobrar Varejo
  40215 SEDEX 10 Varejo
  40290 SEDEX Hoje Varejo
  41106 PAC Varejo

  sCepOrigem - CEP de origem.

  sCepDestino - CEP de destino.

  nVlPeso - Peso da encomenda, incluindo sua embalagem. O peso deve ser informado em quilogramas. Se o formato for Envelope, o valor máximo permitido será 1kg.

  nCdFormato - Formato da encomenda (incluindo embalagem).
      Valores possíveis: 1, 2 ou 3
      1 – Formato caixa/pacote
      2 – Formato rolo/prisma
      3 - Envelope

  nVlComprimento - Comprimento da encomenda (incluindo embalagem), em centímetros.

  nVlAltura - Altura da encomenda (incluindo embalagem), em centímetros. Se o formato for envelope, informar zero (0).

  nVlLargura - Largura da encomenda (incluindo embalagem), em centímetros.

  nVlDiametro - Diâmetro da encomenda (incluindo embalagem), em centímetros.

  sCdMaoPropria - Indica se a encomenda será entregue com o serviço adicional mão própria.
      Valores possíveis: S ou N (S – Sim, N – Não).

  nVlValorDeclarado - Indica se a encomenda será entregue com o serviço adicional valor declarado.
      Neste campo deve ser apresentado o valor declarado desejado, em Reais.

  sCdAvisoRecebimento - Indica se a encomenda será entregue com o serviço adicional aviso de recebimento.
      Valores possíveis: S ou N (S – Sim, N – Não).
*/


angular.module('Freteco', []).provider('Freteco', function () {
  var apiKey;
  var predef = {};

  var apiVersion = 'v1';
  var domain = 'https://frete.co';
  var returnFormat = 'json'; // options json or xml

  return {
    setApiKey: function (value) {
      apiKey = value;
    },
    setApiVersion: function (value) {
      apiVersion = value;
    },
    setDomain: function (value) {
      domain = value;
    },
    predefProductDimension: function (nCdFormato, nVlPeso, nVlAltura, nVlLargura, nVlDiametro, nVlComprimento) {
      if (isNaN(nCdFormato) || isNaN(nVlPeso) || isNaN(nVlAltura) || isNaN(nVlLargura) || isNaN(nVlDiametro) || isNaN(nVlComprimento)) {
        throw new Error('Um dos parâmetros obrigatórios não foi informado');
      }

      predef.nCdFormato = nCdFormato;
      predef.nVlPeso = nVlPeso;
      predef.nVlAltura = nVlAltura;
      predef.nVlLargura = nVlLargura;
      predef.nVlDiametro = nVlDiametro;
      predef.nVlComprimento = nVlComprimento;
    },
    predefDeliveryType: function (nCdServico, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento) {
      if (isNaN(nCdServico) || !sCdMaoPropria || !sCdAvisoRecebimento || isNaN(nVlValorDeclarado)) {
        throw new Error('Um dos parâmetros obrigatórios não foi informado');
      }

      predef.nCdServico = nCdServico;
      predef.sCdMaoPropria = sCdMaoPropria;
      predef.nVlValorDeclarado = nVlValorDeclarado;

      predef.sCdAvisoRecebimento = sCdAvisoRecebimento;
    },
    predefContract: function (nCdEmpresa, sDsSenha) {
      if (!nCdEmpresa || !sDsSenha) {
        throw new Error('Um dos parâmetros obrigatórios não foi informado');
      }

      predef.nCdEmpresa = nCdEmpresa;
      predef.sDsSenha = sDsSenha;
    },
    $get: function ($http, $q) {
      return {
        apiKey: apiKey,
        apiVersion: apiVersion,
        domain: domain,
        returnFormat: returnFormat,
        predef: predef,
        getAddressFromZipcode: function (zipcode) {
          var deferred = $q.defer();
          $http.get(this.domain + '/api/' + this.apiVersion + '/zipcode/' + zipcode + '/?apikey=' + this.apiKey + '&format=' + this.returnFormat)
            .success(function (response) {
              if (!response.success) {
                deferred.reject(response);
                return;
              }

              deferred.resolve(response);
            })
            .error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },
        getDelivery: function (nCdServico, sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento, nCdEmpresa, sDsSenha) {
          var deferred = $q.defer();

          var url = this.domain + '/api/' + this.apiVersion + '/carriers/correios' + '/?apikey=' + this.apiKey + '&format=' + this.returnFormat;

          if (nCdEmpresa && sDsSenha) {
            url += '&nCdEmpresa=' + nCdEmpresa;
            url += '&sDsSenha=' + sDsSenha;
          }

          if (isNaN(nCdServico) || isNaN(sCepOrigem) || isNaN(sCepDestino) || isNaN(nVlPeso) || isNaN(nCdFormato) || isNaN(nVlComprimento) || isNaN(nVlAltura) || isNaN(nVlLargura) || isNaN(nVlDiametro) || !sCdMaoPropria || !sCdAvisoRecebimento) {
            deferred.reject(new Error('Um dos parâmetros obrigatórios não foi informado.'));
            return deferred.promise;
          }

          url += '&nCdServico=' + nCdServico;
          url += '&sCepOrigem=' + sCepOrigem;
          url += '&sCepDestino=' + sCepDestino;
          url += '&nVlPeso=' + nVlPeso;
          url += '&nCdFormato=' + nCdFormato;
          url += '&nVlComprimento=' + nVlComprimento;
          url += '&nVlAltura=' + nVlAltura;
          url += '&nVlLargura=' + nVlLargura;
          url += '&nVlDiametro=' + nVlDiametro;
          url += '&sCdMaoPropria=' + sCdMaoPropria;
          url += '&nVlValorDeclarado=' + nVlValorDeclarado;
          url += '&sCdAvisoRecebimento=' + sCdAvisoRecebimento;

          if (nCdEmpresa && sDsSenha) {
            url += '&nCdEmpresa=' + nCdEmpresa;
            url += '&sDsSenha=' + sDsSenha;
          }

          $http.get(url)
            .success(function (response) {
              if (!response.length) {
                deferred.reject(response);
                return;
              }

              deferred.resolve(response);
            })
            .error(function (error) {
              deferred.reject(error);
            });

          return deferred.promise;
        },
        getPredefDelivery: function (sCepOrigem, sCepDestino) {
          return this.getDelivery(this.predef.nCdServico, sCepOrigem, sCepDestino, this.predef.nVlPeso, this.predef.nCdFormato, this.predef.nVlComprimento, this.predef.nVlAltura, this.predef.nVlLargura, this.predef.nVlDiametro, this.predef.sCdMaoPropria, this.predef.nVlValorDeclarado, this.predef.sCdAvisoRecebimento, this.predef.nCdEmpresa, this.predef.sDsSenha);
        }
      };
    }
  };
});
