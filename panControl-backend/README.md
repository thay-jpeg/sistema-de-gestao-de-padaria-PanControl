Este diretório contém a infraestrutura de banco de dados, utilizando **Node.js**, **Prisma ORM** e **PostgreSQL**.

## Passo a Passo para Configuração Local

Siga os passos abaixo para rodar o banco de dados e o ambiente de desenvolvimento na sua máquina:

1. Instalar as Dependências:

Instale os pacotes necessários, incluindo o Prisma e o dotenv:

```bash
npm install
```

2. Configurar Variáveis de Ambiente:

O arquivo .env não é versionado no Git por questões de segurança, então é necessário criar esse arquivo na pasta backend.

Crie um arquivo chamado .env.

Adicione a seguinte linha, substituindo SUA_SENHA_AQUI pela senha do seu usuário postgres local:

```bash
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/pancontrol?schema=public"
```

3. Rodar o Migrations:

Para criar o banco, executar linha abaixo: 

```bash
npx prisma migrate dev
```

Rode o comando abaixo para visualizar a interface web:

```bash
npx prisma studio
```