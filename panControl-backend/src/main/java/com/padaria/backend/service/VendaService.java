package com.padaria.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.padaria.backend.dto.ItemVendaRequestDTO;
import com.padaria.backend.dto.VendaRequestDTO;
import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.model.ItemVenda;
import com.padaria.backend.model.Produto;
import com.padaria.backend.model.Usuario;
import com.padaria.backend.model.Venda;
import com.padaria.backend.repository.ClienteAtacadistaRepository;
import com.padaria.backend.repository.ItemVendaRepository;
import com.padaria.backend.repository.ProdutoRepository;
import com.padaria.backend.repository.UsuarioRepository;
import com.padaria.backend.repository.VendaRepository;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteAtacadistaRepository clienteAtacadistaRepository;

    @Transactional
    public Venda registrarVenda(VendaRequestDTO request) {

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Vendedor (Usuário) não encontrado na base de dados!"));

        ClienteAtacadista cliente = null;
        boolean vendaAtacado = false;

        if (request.getIdClienteAtacadista() != null) {
            cliente = clienteAtacadistaRepository.findById(request.getIdClienteAtacadista())
                    .orElseThrow(() -> new RuntimeException("Cliente Atacadista não encontrado!"));
            vendaAtacado = true;
        }

        Venda novaVenda = new Venda();
        novaVenda.setMetodoPagamento(request.getMetodoPagamento());
        novaVenda.setUsuario(usuario);
        novaVenda.setClienteAtacadista(cliente);
        novaVenda.setValorTotal(0.0);

        Venda vendaSalva = vendaRepository.save(novaVenda);
        double valorTotalFinal = 0.0;

        for (ItemVendaRequestDTO itemDto : request.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto ID " + itemDto.getIdProduto() + " não encontrado!"));

            if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente. Produto " + produto.getIdProduto() + " possui apenas " + produto.getQuantidadeEstoque() + " unidades.");
            }

            Double precoAplicado = vendaAtacado ? produto.getPrecoAtacado().doubleValue() : produto.getPrecoBalcao().doubleValue();

            if (precoAplicado == null) {
                throw new RuntimeException("O preço não foi configurado corretamente para o Produto ID " + produto.getIdProduto());
            }

            double subtotal = precoAplicado * itemDto.getQuantidade();
            valorTotalFinal += subtotal;

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());
            produtoRepository.save(produto);

            ItemVenda novoItem = new ItemVenda();
            novoItem.setProduto(produto);
            novoItem.setVenda(vendaSalva);
            novoItem.setQuantidade(itemDto.getQuantidade());
            novoItem.setPrecoUnitarioAplicado(precoAplicado);

            itemVendaRepository.save(novoItem);
        }

        vendaSalva.setValorTotal(valorTotalFinal);
        return vendaRepository.save(vendaSalva);
    }
}