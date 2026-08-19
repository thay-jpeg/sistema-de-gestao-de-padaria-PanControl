package com.padaria.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.padaria.backend.dto.ProdutoResponseDTO;
import com.padaria.backend.service.DialogflowService;
import com.padaria.backend.service.FichaTecnicaService;
import com.padaria.backend.service.IngredienteService;
import com.padaria.backend.service.ProdutoService;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private ProdutoService produtoService; 
    
    @Autowired 
    private FichaTecnicaService fichaService;

    @Autowired
    private IngredienteService ingredienteService;

    @Autowired
    private DialogflowService dialogflowService;

    @PostMapping
    public Map<String, Object> receberPerguntaDialogflow(@RequestBody Map<String, Object> request) {
        
        // navegando no JSON do Dialogflow para extrair a intetion e o parameter
        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        Map<String, Object> intent = (Map<String, Object>) queryResult.get("intent");
        String intentName = (String) intent.get("displayName");

        Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");
        String nomeProduto = (String) parameters.get("Produto");

        String respostaBot = "";

       // acionar os services do sistema dependendo do que o usuario quer
        try {
            if (nomeProduto == null || nomeProduto.isEmpty()) {
                respostaBot = "Desculpe, não entendi de qual produto você está falando. Pode repetir o nome?";
            } else {
                
                ProdutoResponseDTO produto = produtoService.buscarPorNome(nomeProduto);
                
                if ("Consultar.FichaTecnica".equals(intentName)) {
                    var fichas = fichaService.listarFichasPorProduto(produto.getIdProduto());
                    
                    StringBuilder receita = new StringBuilder();
                    receita.append("O produto solicitado é o ").append(produto.getNomeProduto())
                           .append(". A sua ficha técnica possui ").append(fichas.size()).append(" ingredientes:\n");
                    
                    for(var ficha : fichas) {
                        Integer idIng = ficha.getIdIngrediente();
                        var ingrediente = ingredienteService.buscarIngredientePorId(idIng);
                        
                        String nomeIngrediente = ingrediente.getNomeIngrediente();
                        String unidade = ingrediente.getUnidadeMedida();
                        
                        String qtdFormatada;
                        

                        if (unidade != null && unidade.trim().equalsIgnoreCase("un")) {              
                            qtdFormatada = String.valueOf(ficha.getQuantidadeNecessaria().intValue());
                        } else {
                        
                            qtdFormatada = ficha.getQuantidadeNecessaria().stripTrailingZeros().toPlainString();
                        }

                        receita.append("- ")
                               .append(nomeIngrediente)
                               .append(", ")
                               .append(qtdFormatada)
                               .append(" ")
                               .append(unidade)
                               .append("\n");
                    }
                    
                    respostaBot = receita.toString();
                }
                else if ("Consultar.Preco".equals(intentName)) {
                    respostaBot = String.format("O preço de balcão do produto %s é R$ %.2f.", 
                                                produto.getNomeProduto(), produto.getPrecoBalcao());
                }
                else if ("Consultar.Estoque".equals(intentName)) {
                    respostaBot = "Nós temos " + produto.getQuantidadeEstoque() + " unidades de " + 
                                  produto.getNomeProduto() + " no estoque atual.";
                }
                else if ("Consultar.Validade".equals(intentName)) {
                    respostaBot = "A validade padrão do produto " + produto.getNomeProduto() + 
                                  " é de " + produto.getDiasValidadePadrao() + " dias.";
                }
                else {
                    respostaBot = "Ainda estou aprendendo e não sei responder isso sobre o " + produto.getNomeProduto() + ".";
                }
            }
        } catch (IllegalArgumentException e) {
    
            respostaBot = "Puxa, eu procurei aqui mas não encontrei nenhum produto chamado '" + nomeProduto + "' no nosso sistema.";
        } catch (Exception e) {
            respostaBot = "Ocorreu um erro interno ao buscar os dados do produto.";
        }

        // monta o pacote de resposta no formato exato que o Dialogflow exige
        Map<String, Object> response = new HashMap<>();
        response.put("fulfillmentText", respostaBot);

        return response;
    }

    @PostMapping("/perguntar")
    public Map<String, String> fazerPerguntaPeloReact(@RequestBody Map<String, String> request) {
        String texto = request.get("texto");
        String sessionId = request.get("sessionId");

        // POST para o Dialogflow
        String respostaDaIA = dialogflowService.enviarMensagem(sessionId, texto);

        Map<String, String> response = new HashMap<>();
        response.put("resposta", respostaDaIA);
        
        return response;
    }
}