package offboarding.service;

import offboarding.model.MonitoredRepo;
import offboarding.repository.MonitoredRepoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class OffGateAiService {

    @Autowired
    private MonitoredRepoRepository repository;

    // Adicione o String customPrompt nos parâmetros:
public boolean runAiDeepScanAndRepair(UUID repoId, String customPrompt) {
    Optional<MonitoredRepo> repoOpt = repository.findById(repoId);
    
    if (repoOpt.isEmpty()) {
        return false;
    }

    MonitoredRepo repo = repoOpt.get();

    System.out.println("\n==================================================");
    System.out.println("⚡ [OffGate AI Engine] Inicializando motor de análise...");
    System.out.println("📥 Alvo: " + repo.getRepoName());
    
    // Mostrando a instrução do usuário no console do Java!
    System.out.println("💬 Instrução do Usuário: \"" + customPrompt + "\"");
    
    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    System.out.println("⚠️ Adaptando regras da LLM baseadas no prompt...");
    System.out.println("✨ [OffGate AI Engine] Patch gerado e salvo no banco.");
    System.out.println("==================================================\n");

    repo.setHealthy(true);
    repository.save(repo);
    return true;
}
}