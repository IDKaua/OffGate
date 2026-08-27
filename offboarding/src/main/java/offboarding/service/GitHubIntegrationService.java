package offboarding.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class GitHubIntegrationService {

    // Lê o token do arquivo application.properties
    @Value("${github.token:}")
    private String githubToken;

    public boolean commitAndPush(String repoFullName, String branch, String commitMessage, String aiPrompt) {
        System.out.println("\n🌐 [GitHub API] Iniciando handshake seguro com os servidores...");

        // Se você não colocou o token, ele apenas simula para não quebrar seus testes locais
        if (githubToken == null || githubToken.trim().isEmpty()) {
            System.out.println("⚠️ [Aviso] Token (github.token) não encontrado. Simulando Push offline...");
            try { Thread.sleep(2500); } catch (InterruptedException ignored) {}
            return true;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + githubToken);
            headers.set("Accept", "application/vnd.github.v3+json");

            // 1. O código que a IA "gerou" para consertar o bug
            String fileContent = "/* \n * OFFGATE AI - PATCH DE CORREÇÃO \n" +
                                 " * Instrução do usuário: " + aiPrompt + "\n" +
                                 " * Status: Código analisado e sanitizado.\n */\n\n" +
                                 "public class OffGatePatch {\n    // Reparo aplicado com sucesso!\n}";
            
            // O GitHub exige que o arquivo seja enviado em formato Base64
            String encodedContent = Base64.getEncoder().encodeToString(fileContent.getBytes());

            // 2. Monta o pacote de dados do Commit
            Map<String, String> body = new HashMap<>();
            body.put("message", commitMessage);
            body.put("content", encodedContent);
            body.put("branch", branch);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            // 3. O alvo: cria um arquivo chamado "offgate-patch.java" na raiz do repositório!
            String url = "https://api.github.com/repos/" + repoFullName + "/contents/offgate-patch.java";
            
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ [GitHub API] Push realizado! Código injetado na branch " + branch);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ [GitHub API] Falha ao realizar Push. Verifique o token e as permissões.");
            System.err.println("Detalhe técnico: " + e.getMessage());
            // Nota: Se o arquivo já existir, o GitHub dá erro 422 pedindo o SHA antigo.
            // Para nosso MVP, vamos tratar a exceção e retornar false.
        }
        return false;
    }
}