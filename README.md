# Desafio Kafka com Node.JS


### Sobre o projeto
Esse repositório tem como objetivo armazenar a solução para um desafio proposto para a ingressar na empresa Croct.

![Kafka Schema](https://user-images.githubusercontent.com/943036/148793496-5f73bd8f-f515-4e28-8fa6-9fbc88aa0ca4.png)

O objetivo é desenvolver uma aplicação [Kafka](https://kafka.apache.org/) que realize a busca da geolocalização de IPs na API [IPStack](https://ipstack.com/). 

O sistema consiste em 4 pontos principais:
- Um tópico de entrada, para receber o payload de busca de localização de IP.
- Conexão com a API [IPStack](https://ipstack.com/).
- Conexão com um cache [Redis](https://redis.io/).
- Um tópico de saída, para retornar os resultados da busca para o usuário.

## Tecnologias

Tecnologias utilizadas na aplicação:

- [Node.JS](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [KafkaJS](https://kafka.js.org/)
- [Axios](https://axios-http.com/)

## Rodando o projeto

### Pré-requisitos

É necessario ter instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Instalação

1. Clone o repositório

```sh
git clone https://github.com/adryan30/kafka-challenge.git
```

2. Utilize docker-compose para iniciar os serviços

```sh
docker compose up
OR
docker compose up producer consumer kafka zookeeper cache kafka-ui
```

3. Utilize um cliente HTTP (ou cURL) para realizar as requisições.

```sh
curl --location --request POST 'localhost:3000/ip' \
--header 'Content-Type: application/json' \
--data-raw '{
    "client_id": "<a client ID>",
    "ip":"<any valid IP address>"
}'
```

## Contato

**Adryan Almeida**

[![Gmail][gmail-shield]][gmail-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

Link do projeto: [https://github.com/adryan30/kafka-challenge](https://github.com/adryan30/kafka-challenge)


[gmail-shield]: https://img.shields.io/badge/email-red?logo=gmail&style=for-the-badge&colorB=555
[gmail-url]: mailto:adryan.software@gmail.com
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/adryanalmeida
[product-screenshot]: ./assets/landing.png