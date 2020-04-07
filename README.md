# think-music

[![GitHub version](https://badge.fury.io/gh/thalysonalexr%2Fthink-music.svg)](https://badge.fury.io/gh/thalysonalexr%2Fthink-music)
[![Software License](https://img.shields.io/apm/l/vim-mode.svg)](https://github.com/thalysonalexr/think-music/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/thalysonalexr/think-music/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/thalysonalexr)

> Simples API para integração de aplicações que desejarem aderir a esta ideia.

<p align="center">
  <a href="https://github.com/thalysonrodrigues/freestylesheets">
    <img src="./docs/logo.jpg" alt="logo" title="Freestylesheets">
  </a>
</p>

## O que seria isso?

Esta é uma API construída com Node.js e Express para estudar conceitos de ORM com Sequelize e um compilado de outros conhecimentos. Esta é uma simples ideia de serviço Web para manipulação de interpretações sobre músicas.

## :rocket: Tecnologias

- express
- postgres
- sequelize
- nodemailer
- jsonwebtoken
- jest

## Contribuir

> Passo 1: de um fork neste repositório e em seguida faça o clone

```
git clone https://github.com/<yourusername>/think-music
```

> Passo 2: configure as variáveis de ambiente. Por padrão deixei um arquivo de exemplo `.env.example`. Devem ser configurados para api (`./api/.env.example`) e para os containers do Docker (`./.env.example`).

> Passo 3: instale as dependências do projeto (yarn)

```
cd api/
yarn install
```

> Passo 4: utilize docker e docker compose para subir os containers da aplicação

```
# subir os containers
docker-compose up
# verificar os processos
docker ps
```

> Passo 5: teste com Jest ([100% coverage](https://github.com/thalysonalexr/think-music/blob/master/docs/coverage.png))

```
yarn test
```

> Passo 6: crie novas features... (desenvolva muitoooooo)

```
git checkot -b add-<feature-name>
```

> Passo 6: push e realize um pull request para o repositório original

## Surgimento da ideia

Uma das coisas que amo na vida é música. Muitas das músicas que escuto suas letras transmitem essencialmente algo que passou em minha vida, e é claro, vem de uma interpretação intrínseca. Bom, desenvolvi esta API para colocar em prática uma ideia que tive há um tempo: "uma plataforma, site ou aplicativo em que eu pudesse compartilhar com outras pessoas o que entendo sobre algumas músicas e agregar novos pensamentos de outras pessoas, pois uma interpretação não tem certo ou errado e talvez não precise fazer sentido"; também compilar alguns conhecimentos adquiridos recentemente sobre algumas tecnologias em JS. Se você é um desenvolvedor frontend, sinta-se a vontade para criar aplicações para consumir esta API e fornecer ao usuário uma experiência que eu e outras pessoas provavelmente gostariam. Qualquer dúvida entre em contato, novas ideias para este projeto faça um pull request. A comunidade é aberta, seja um colaborador e de antemão, seja bem-vindo.

## Teste os Endpoints da API com Insomnia

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Think%20Music%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fthalysonalexr%2Fthink-music%2Fmaster%2Fdocs%2FInsomnia_2020-03-26.json)

---

## Créditos

Construído com ♥ por [Thalyson Rodrigues](https://www.linkedin.com/in/thalysonrodrigues/)
