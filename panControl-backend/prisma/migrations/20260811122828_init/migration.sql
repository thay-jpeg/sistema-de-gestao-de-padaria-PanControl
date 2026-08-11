-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario_PK" SERIAL NOT NULL,
    "nomeUsuario" TEXT NOT NULL,
    "codigoAcesso" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "statusAtivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario_PK")
);

-- CreateTable
CREATE TABLE "produtos" (
    "idProduto_PK" SERIAL NOT NULL,
    "nomeProduto" TEXT NOT NULL,
    "codigoBarras" TEXT,
    "diasValidadePadrao" INTEGER NOT NULL,
    "percentualICMS" DECIMAL(5,2) NOT NULL,
    "percentualLucroBalcao" DECIMAL(5,2) NOT NULL,
    "percentualLucroAtacado" DECIMAL(5,2) NOT NULL,
    "precoBalcao" DECIMAL(10,2) NOT NULL,
    "precoAtacado" DECIMAL(10,2) NOT NULL,
    "quantidadeEstoque" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("idProduto_PK")
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "idIngrediente_PK" SERIAL NOT NULL,
    "nomeIngrediente" TEXT NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "quantidadeEstoque" DECIMAL(10,3) NOT NULL,
    "estoqueMinimo" DECIMAL(10,3) NOT NULL,
    "custoMedioUnitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ingredientes_pkey" PRIMARY KEY ("idIngrediente_PK")
);

-- CreateTable
CREATE TABLE "fichasTecnicas" (
    "idFichaTecnica_PK" SERIAL NOT NULL,
    "idProduto_FK" INTEGER NOT NULL,
    "idIngrediente_FK" INTEGER NOT NULL,
    "textoReceita" TEXT,
    "quantidadeNecessaria" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "fichasTecnicas_pkey" PRIMARY KEY ("idFichaTecnica_PK")
);

-- CreateTable
CREATE TABLE "clientesAtacadistas" (
    "idClienteAtacadista_PK" SERIAL NOT NULL,
    "nomeRazaoSocial" TEXT NOT NULL,
    "tipoPessoa" CHAR(1) NOT NULL,
    "documentoCliente" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clientesAtacadistas_pkey" PRIMARY KEY ("idClienteAtacadista_PK")
);

-- CreateTable
CREATE TABLE "endereco" (
    "idEndereco_PK" SERIAL NOT NULL,
    "CEP" TEXT NOT NULL,
    "complementoEnd" TEXT,
    "numeroEnd" TEXT NOT NULL,
    "idClienteAtacadista_FK" INTEGER NOT NULL,
    "idCidade_FK" INTEGER NOT NULL,
    "idLogradouro_FK" INTEGER NOT NULL,
    "idBairro_FK" INTEGER NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("idEndereco_PK")
);

-- CreateTable
CREATE TABLE "producoes" (
    "idProducao_PK" SERIAL NOT NULL,
    "quantidadeProduzida" INTEGER NOT NULL,
    "custoTotalProducao" DECIMAL(10,2) NOT NULL,
    "dataValidadeLote" TIMESTAMP(3) NOT NULL,
    "dataProducao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idProduto_FK" INTEGER NOT NULL,
    "idUsuario_FK" INTEGER NOT NULL,

    CONSTRAINT "producoes_pkey" PRIMARY KEY ("idProducao_PK")
);

-- CreateTable
CREATE TABLE "perdasProdutos" (
    "idPerdaProduto_PK" SERIAL NOT NULL,
    "quantidadePerdida" INTEGER NOT NULL,
    "motivoPerda" TEXT NOT NULL,
    "dataPerda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idProducao_FK" INTEGER NOT NULL,
    "idProduto_FK" INTEGER NOT NULL,
    "idUsuario_FK" INTEGER NOT NULL,

    CONSTRAINT "perdasProdutos_pkey" PRIMARY KEY ("idPerdaProduto_PK")
);

-- CreateTable
CREATE TABLE "unidadeFederativa" (
    "siglaUF_PK" VARCHAR(2) NOT NULL,
    "nomeUF" TEXT NOT NULL,

    CONSTRAINT "unidadeFederativa_pkey" PRIMARY KEY ("siglaUF_PK")
);

-- CreateTable
CREATE TABLE "cidade" (
    "idCidade_PK" SERIAL NOT NULL,
    "nomeCidade" TEXT NOT NULL,
    "siglaUF_FK" TEXT NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("idCidade_PK")
);

-- CreateTable
CREATE TABLE "bairro" (
    "idBairro_PK" SERIAL NOT NULL,
    "nomeBairro" TEXT NOT NULL,

    CONSTRAINT "bairro_pkey" PRIMARY KEY ("idBairro_PK")
);

-- CreateTable
CREATE TABLE "tipoLogradouro" (
    "siglaTipoLogradouro_PK" VARCHAR(10) NOT NULL,
    "nomeTipoLogradouro" TEXT NOT NULL,

    CONSTRAINT "tipoLogradouro_pkey" PRIMARY KEY ("siglaTipoLogradouro_PK")
);

-- CreateTable
CREATE TABLE "logradouro" (
    "idLogradouro_PK" SERIAL NOT NULL,
    "nomeLogradouro" TEXT NOT NULL,
    "siglaTipoLogradouro_FK" TEXT NOT NULL,

    CONSTRAINT "logradouro_pkey" PRIMARY KEY ("idLogradouro_PK")
);

-- CreateTable
CREATE TABLE "DDI" (
    "DDI_PK" INTEGER NOT NULL,

    CONSTRAINT "DDI_pkey" PRIMARY KEY ("DDI_PK")
);

-- CreateTable
CREATE TABLE "DDD" (
    "DDD_PK" INTEGER NOT NULL,

    CONSTRAINT "DDD_pkey" PRIMARY KEY ("DDD_PK")
);

-- CreateTable
CREATE TABLE "foneCliente" (
    "nroTelefone_PK" VARCHAR(15) NOT NULL,
    "DDD_PK" INTEGER NOT NULL,
    "DDI_PK" INTEGER NOT NULL,
    "idCliente_FK" INTEGER NOT NULL,

    CONSTRAINT "foneCliente_pkey" PRIMARY KEY ("nroTelefone_PK")
);

-- CreateTable
CREATE TABLE "dominioEmail" (
    "idDominioEmail_PK" SERIAL NOT NULL,
    "dominio" TEXT NOT NULL,

    CONSTRAINT "dominioEmail_pkey" PRIMARY KEY ("idDominioEmail_PK")
);

-- CreateTable
CREATE TABLE "emailCliente" (
    "idEmail_PK" SERIAL NOT NULL,
    "credencial" TEXT NOT NULL,
    "idDominioEmail_FK" INTEGER NOT NULL,
    "idClienteAtacadista_FK" INTEGER NOT NULL,

    CONSTRAINT "emailCliente_pkey" PRIMARY KEY ("idEmail_PK")
);

-- CreateTable
CREATE TABLE "comprasIngredientes" (
    "idCompras_PK" SERIAL NOT NULL,
    "quantidadeComprada" DECIMAL(10,3) NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "quantidadeRestante" DECIMAL(10,3) NOT NULL,
    "custoTotal" DECIMAL(10,2) NOT NULL,
    "dataCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario_FK" INTEGER NOT NULL,
    "idIngrediente_FK" INTEGER NOT NULL,

    CONSTRAINT "comprasIngredientes_pkey" PRIMARY KEY ("idCompras_PK")
);

-- CreateTable
CREATE TABLE "pedidosVenda" (
    "idPedidoVenda_PK" SERIAL NOT NULL,
    "situacao" TEXT NOT NULL,
    "dataPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "idClienteAtacadista_FK" INTEGER NOT NULL,
    "idUsuario_FK" INTEGER NOT NULL,

    CONSTRAINT "pedidosVenda_pkey" PRIMARY KEY ("idPedidoVenda_PK")
);

-- CreateTable
CREATE TABLE "itensPedido" (
    "idItensPedido_PK" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitarioAplicado" DECIMAL(10,2) NOT NULL,
    "idProduto_FK" INTEGER NOT NULL,
    "idPedidoVenda_FK" INTEGER NOT NULL,

    CONSTRAINT "itensPedido_pkey" PRIMARY KEY ("idItensPedido_PK")
);

-- CreateTable
CREATE TABLE "vendas" (
    "idVenda_PK" SERIAL NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "dataVenda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario_FK" INTEGER NOT NULL,
    "idClienteAtacadista_FK" INTEGER,
    "idPedidoVenda_FK" INTEGER,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("idVenda_PK")
);

-- CreateTable
CREATE TABLE "itensVenda" (
    "idItensVenda_PK" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitarioAplicado" DECIMAL(10,2) NOT NULL,
    "idProduto_FK" INTEGER NOT NULL,
    "idVenda_FK" INTEGER NOT NULL,

    CONSTRAINT "itensVenda_pkey" PRIMARY KEY ("idItensVenda_PK")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigoAcesso_key" ON "usuarios"("codigoAcesso");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigoBarras_key" ON "produtos"("codigoBarras");

-- CreateIndex
CREATE UNIQUE INDEX "clientesAtacadistas_documentoCliente_key" ON "clientesAtacadistas"("documentoCliente");

-- AddForeignKey
ALTER TABLE "fichasTecnicas" ADD CONSTRAINT "fichasTecnicas_idProduto_FK_fkey" FOREIGN KEY ("idProduto_FK") REFERENCES "produtos"("idProduto_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fichasTecnicas" ADD CONSTRAINT "fichasTecnicas_idIngrediente_FK_fkey" FOREIGN KEY ("idIngrediente_FK") REFERENCES "ingredientes"("idIngrediente_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_idClienteAtacadista_FK_fkey" FOREIGN KEY ("idClienteAtacadista_FK") REFERENCES "clientesAtacadistas"("idClienteAtacadista_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_idCidade_FK_fkey" FOREIGN KEY ("idCidade_FK") REFERENCES "cidade"("idCidade_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_idLogradouro_FK_fkey" FOREIGN KEY ("idLogradouro_FK") REFERENCES "logradouro"("idLogradouro_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_idBairro_FK_fkey" FOREIGN KEY ("idBairro_FK") REFERENCES "bairro"("idBairro_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producoes" ADD CONSTRAINT "producoes_idProduto_FK_fkey" FOREIGN KEY ("idProduto_FK") REFERENCES "produtos"("idProduto_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producoes" ADD CONSTRAINT "producoes_idUsuario_FK_fkey" FOREIGN KEY ("idUsuario_FK") REFERENCES "usuarios"("idUsuario_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdasProdutos" ADD CONSTRAINT "perdasProdutos_idProducao_FK_fkey" FOREIGN KEY ("idProducao_FK") REFERENCES "producoes"("idProducao_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdasProdutos" ADD CONSTRAINT "perdasProdutos_idProduto_FK_fkey" FOREIGN KEY ("idProduto_FK") REFERENCES "produtos"("idProduto_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdasProdutos" ADD CONSTRAINT "perdasProdutos_idUsuario_FK_fkey" FOREIGN KEY ("idUsuario_FK") REFERENCES "usuarios"("idUsuario_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cidade" ADD CONSTRAINT "cidade_siglaUF_FK_fkey" FOREIGN KEY ("siglaUF_FK") REFERENCES "unidadeFederativa"("siglaUF_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logradouro" ADD CONSTRAINT "logradouro_siglaTipoLogradouro_FK_fkey" FOREIGN KEY ("siglaTipoLogradouro_FK") REFERENCES "tipoLogradouro"("siglaTipoLogradouro_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foneCliente" ADD CONSTRAINT "foneCliente_DDD_PK_fkey" FOREIGN KEY ("DDD_PK") REFERENCES "DDD"("DDD_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foneCliente" ADD CONSTRAINT "foneCliente_DDI_PK_fkey" FOREIGN KEY ("DDI_PK") REFERENCES "DDI"("DDI_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foneCliente" ADD CONSTRAINT "foneCliente_idCliente_FK_fkey" FOREIGN KEY ("idCliente_FK") REFERENCES "clientesAtacadistas"("idClienteAtacadista_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emailCliente" ADD CONSTRAINT "emailCliente_idDominioEmail_FK_fkey" FOREIGN KEY ("idDominioEmail_FK") REFERENCES "dominioEmail"("idDominioEmail_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emailCliente" ADD CONSTRAINT "emailCliente_idClienteAtacadista_FK_fkey" FOREIGN KEY ("idClienteAtacadista_FK") REFERENCES "clientesAtacadistas"("idClienteAtacadista_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprasIngredientes" ADD CONSTRAINT "comprasIngredientes_idUsuario_FK_fkey" FOREIGN KEY ("idUsuario_FK") REFERENCES "usuarios"("idUsuario_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprasIngredientes" ADD CONSTRAINT "comprasIngredientes_idIngrediente_FK_fkey" FOREIGN KEY ("idIngrediente_FK") REFERENCES "ingredientes"("idIngrediente_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidosVenda" ADD CONSTRAINT "pedidosVenda_idClienteAtacadista_FK_fkey" FOREIGN KEY ("idClienteAtacadista_FK") REFERENCES "clientesAtacadistas"("idClienteAtacadista_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidosVenda" ADD CONSTRAINT "pedidosVenda_idUsuario_FK_fkey" FOREIGN KEY ("idUsuario_FK") REFERENCES "usuarios"("idUsuario_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itensPedido" ADD CONSTRAINT "itensPedido_idProduto_FK_fkey" FOREIGN KEY ("idProduto_FK") REFERENCES "produtos"("idProduto_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itensPedido" ADD CONSTRAINT "itensPedido_idPedidoVenda_FK_fkey" FOREIGN KEY ("idPedidoVenda_FK") REFERENCES "pedidosVenda"("idPedidoVenda_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_idUsuario_FK_fkey" FOREIGN KEY ("idUsuario_FK") REFERENCES "usuarios"("idUsuario_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_idClienteAtacadista_FK_fkey" FOREIGN KEY ("idClienteAtacadista_FK") REFERENCES "clientesAtacadistas"("idClienteAtacadista_PK") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_idPedidoVenda_FK_fkey" FOREIGN KEY ("idPedidoVenda_FK") REFERENCES "pedidosVenda"("idPedidoVenda_PK") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itensVenda" ADD CONSTRAINT "itensVenda_idProduto_FK_fkey" FOREIGN KEY ("idProduto_FK") REFERENCES "produtos"("idProduto_PK") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itensVenda" ADD CONSTRAINT "itensVenda_idVenda_FK_fkey" FOREIGN KEY ("idVenda_FK") REFERENCES "vendas"("idVenda_PK") ON DELETE RESTRICT ON UPDATE CASCADE;
