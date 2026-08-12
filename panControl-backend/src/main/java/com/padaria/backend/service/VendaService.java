package com.padaria.backend.service;

import com.padaria.backend.dto.ItemVendaDTO;
import com.padaria.backend.dto.VendaRequisitadaDTO;
import com.padaria.backend.model.ItemVenda;
import com.padaria.backend.model.Produto;
import com.padaria.backend.model.Venda;
import com.padaria.backend.repository.ProdutoRepository;
import com.padaria.backend.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    // A anotação @Transactional garante que, se der erro em um pão, a venda inteira é cancelada (rollback)
    @Transactional
    public Venda registrarVenda(VendaRequisitadaDTO request) {

        Venda novaVenda = new Venda();
        novaVenda.setDataVenda(LocalDateTime.now());
        novaVenda.setMetodoPagamento(request.getMetodoPagamento());

        // Inicializa a lista de itens e a variável para calcular o total em dinheiro
        List<ItemVenda> itens = new ArrayList<>();
        double totalDaVenda = 0.0;

        // Passa por cada item que veio do Front-end (JSON)
        for (ItemVendaDTO itemDto : request.getItens()) {

            // Busca o produto real no banco de dados para pegar o preço atualizado
            Produto produtoBanco = produtoRepository.findById(itemDto.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

            ItemVenda novoItem = new ItemVenda();
            novoItem.setIdProduto_FK(produtoBanco);
            novoItem.setQuantidade(itemDto.getQuantidade());

            // Pega o preço de balcão do banco e salva no histórico do item
            novoItem.setPrecoUnitarioAplicado(produtoBanco.getPrecoBalcao());

            // Vincula o item à venda que estamos criando
            novoItem.setIdVenda_FK(novaVenda);

            // Calcula o subtotal (preço * quantidade) e soma no total da venda
            totalDaVenda += produtoBanco.getPrecoBalcao() * itemDto.getQuantidade();

            itens.add(novoItem);
        }

        // Guarda o valor total calculado e a lista de itens prontos
        novaVenda.setValorTotal(totalDaVenda);
        novaVenda.setItensVenda(itens);

        // Salva tudo no PostgreSQL de uma vez só!
        return vendaRepository.save(novaVenda);
    }
}