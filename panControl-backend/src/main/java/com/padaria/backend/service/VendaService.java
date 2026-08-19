package com.padaria.backend.service;

import com.padaria.backend.dto.ItemVendaDTO;
import com.padaria.backend.dto.ItemVendaRequestDTO;
import com.padaria.backend.dto.VendaRequestDTO;
import com.padaria.backend.dto.PedidoRequestDTO;
import com.padaria.backend.model.*;
import com.padaria.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VendaService {

    @Autowired private VendaRepository vendaRepository;
    @Autowired private ItemVendaRepository itemVendaRepository;
    @Autowired private PedidoVendaRepository pedidoVendaRepository;
    @Autowired private ItemPedidoRepository itemPedidoRepository;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ClienteAtacadistaRepository clienteAtacadistaRepository;

    @Transactional(rollbackFor = Exception.class)
    public Venda registrarVenda(VendaRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado!"));

        ClienteAtacadista cliente = null;
        boolean vendaAtacado = false;

        if (request.getIdClienteAtacadista() != null) {
            cliente = clienteAtacadistaRepository.findById(request.getIdClienteAtacadista())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));
            vendaAtacado = true;
        }

        Venda novaVenda = new Venda();
        novaVenda.setMetodoPagamento(request.getMetodoPagamento());
        novaVenda.setUsuario(usuario);
        novaVenda.setClienteAtacadista(cliente);
        novaVenda.setDataVenda(LocalDateTime.now());
        novaVenda.setValorTotal(0.0);

        Venda vendaSalva = vendaRepository.save(novaVenda);
        double valorTotalFinal = 0.0;

        for (ItemVendaRequestDTO itemDto : request.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto ID " + itemDto.getIdProduto() + " não encontrado!"));

            if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o Produto " + produto.getIdProduto());
            }

            Double precoAplicado = vendaAtacado ? produto.getPrecoAtacado().doubleValue() : produto.getPrecoBalcao().doubleValue();
            valorTotalFinal += precoAplicado * itemDto.getQuantidade();

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

    @Transactional(rollbackFor = Exception.class)
    public PedidoVenda criarPedido(PedidoRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        ClienteAtacadista cliente = clienteAtacadistaRepository.findById(request.getIdClienteAtacadista())
                .orElseThrow(() -> new RuntimeException("Cliente Atacadista não encontrado para o pedido!"));

        PedidoVenda novoPedido = new PedidoVenda();
        novoPedido.setSituacao("pendente");
        novoPedido.setDataPedido(LocalDateTime.now());
        novoPedido.setUsuario(usuario);
        novoPedido.setClienteAtacadista(cliente);
        novoPedido.setValorTotal(0.0);

        PedidoVenda pedidoSalvo = pedidoVendaRepository.save(novoPedido);
        double valorTotalFinal = 0.0;

        for (ItemVendaDTO itemDto : request.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getIdProduto())
                    .orElseThrow(() -> new RuntimeException("Produto ID " + itemDto.getIdProduto() + " não encontrado!"));

            if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para reservar o Produto " + produto.getIdProduto());
            }

            Double precoAplicado = produto.getPrecoAtacado().doubleValue();
            valorTotalFinal += precoAplicado * itemDto.getQuantidade();

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());
            produtoRepository.save(produto);

            ItemPedido novoItem = new ItemPedido();
            novoItem.setProduto(produto);
            novoItem.setPedidoVenda(pedidoSalvo);
            novoItem.setQuantidade(itemDto.getQuantidade());
            novoItem.setPrecoUnitarioAplicado(precoAplicado);
            itemPedidoRepository.save(novoItem);
        }

        pedidoSalvo.setValorTotal(valorTotalFinal);
        return pedidoVendaRepository.save(pedidoSalvo);
    }

    @Transactional(rollbackFor = Exception.class)
    public PedidoVenda cancelarPedido(Long idPedido) {
        PedidoVenda pedido = pedidoVendaRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));

        if ("cancelado".equalsIgnoreCase(pedido.getSituacao()) || "entregue".equalsIgnoreCase(pedido.getSituacao())) {
            throw new RuntimeException("Apenas pedidos pendentes podem ser cancelados.");
        }

        pedido.setSituacao("cancelado");

        List<ItemPedido> itens = itemPedidoRepository.findByPedidoVenda(pedido);
        for (ItemPedido item : itens) {
            Produto produto = item.getProduto();
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
            produtoRepository.save(produto);
        }

        return pedidoVendaRepository.save(pedido);
    }

    // --- MÉTODOS DE RELATÓRIO ADICIONADOS AQUI ---

    public List<Venda> listarTodasAsVendas() {
        return vendaRepository.findAll();
    }

    public List<PedidoVenda> listarTodosOsPedidos() {
        return pedidoVendaRepository.findAll();
    }
}