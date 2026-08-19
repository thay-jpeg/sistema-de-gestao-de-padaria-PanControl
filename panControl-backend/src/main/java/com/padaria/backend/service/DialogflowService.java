package com.padaria.backend.service;

import java.io.InputStream;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.SessionsSettings;
import com.google.cloud.dialogflow.v2.TextInput;

@Service
public class DialogflowService {

    private final String JSON_KEY_FILE = "pancontrol-ai-9xvg-c0f79aaa5d5c.json"; 
    
    // ID projeto no Google Cloud
    private final String PROJECT_ID = "pancontrol-ai-9xvg"; 

    public String enviarMensagem(String sessionId, String texto) {
        try {
            // o arquivo JSON com as credenciais
            InputStream credentialsStream = new ClassPathResource(JSON_KEY_FILE).getInputStream();
            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
            
            // permissão de acesso
            SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            // conexão com o Dialogflow
            try (SessionsClient sessionsClient = SessionsClient.create(sessionsSettings)) {
                // sessão única para o usuário
                SessionName session = SessionName.of(PROJECT_ID, sessionId);

                // prepara o texto que veio do React
                TextInput.Builder textInput = TextInput.newBuilder().setText(texto).setLanguageCode("pt-BR");
                QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

                // envia para o Dialogflow e pega a resposta
                DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);
                return response.getQueryResult().getFulfillmentText();
            }
        } catch (Exception e) {
            System.err.println("Erro ao comunicar com o Dialogflow: " + e.getMessage());
            return "Desculpe, estou com problemas técnicos para conectar ao meu cérebro no momento.";
        }
    }
}