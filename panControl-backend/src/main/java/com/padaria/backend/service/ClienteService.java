package com.padaria.backend.service;

import com.padaria.backend.dto.ClienteRequestDTO;
import com.padaria.backend.dto.ClienteResponseDTO;
import com.padaria.backend.model.ClienteAtacadista;
import com.padaria.backend.repository.ClienteAtacadistaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteAtacadistaRepository clienteRepository;

    @Transactional
    public ClienteResponseDTO criarCliente(ClienteRequestDTO dto) {
        ClienteAtacadista cliente = new ClienteAtacadista();
        mapearDtoParaEntidade(dto, cliente);
        if (cliente.getAtivo() == null) {
            cliente.setAtivo(true);
        }
        ClienteAtacadista salvo = clienteRepository.save(cliente);
        return mapearEntidadeParaDto(salvo);
    }

    public List<ClienteResponseDTO> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(this::mapearEntidadeParaDto)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarClientePorId(Integer id) {
        return clienteRepository.findById(id)
                .map(this::mapearEntidadeParaDto)
                .orElse(null);
    }

    @Transactional
    public ClienteResponseDTO atualizarCliente(Integer id, ClienteRequestDTO dto) {
        ClienteAtacadista clienteExistente = clienteRepository.findById(id).orElse(null);
        if (clienteExistente == null) return null;

        mapearDtoParaEntidade(dto, clienteExistente);
        if (dto.getAtivo() != null) {
            clienteExistente.setAtivo(dto.getAtivo());
        }

        ClienteAtacadista atualizado = clienteRepository.save(clienteExistente);
        return mapearEntidadeParaDto(atualizado);
    }

    @Transactional
    public boolean deletarCliente(Integer id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void mapearDtoParaEntidade(ClienteRequestDTO dto, ClienteAtacadista entidade) {
        entidade.setNomeRazaoSocial(dto.getNomeRazaoSocial());
        entidade.setTipoPessoa(dto.getTipoPessoa());
        entidade.setDocumentoCliente(dto.getDocumentoCliente());
        entidade.setDataNascimento(dto.getDataNascimento());
        entidade.setAtivo(dto.getAtivo());
    }

    private ClienteResponseDTO mapearEntidadeParaDto(ClienteAtacadista entidade) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setIdClienteAtacadista(entidade.getIdClienteAtacadista());
        dto.setNomeRazaoSocial(entidade.getNomeRazaoSocial());
        dto.setTipoPessoa(entidade.getTipoPessoa());
        dto.setDocumentoCliente(entidade.getDocumentoCliente());
        dto.setDataNascimento(entidade.getDataNascimento());
        dto.setAtivo(entidade.getAtivo());
        return dto;
    }
}