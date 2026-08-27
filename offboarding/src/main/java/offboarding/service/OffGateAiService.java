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

    @Autowired
    private GitHubIntegrationService githubService; // Injetando o nosso robô do Git

    // Atualize os parâmetros do método
    public boolean runAiDeepScanAndRepair(UUID repoId, String customPrompt, String commitMessage, String customBranch) {
        Optional<MonitoredRepo> repoOpt = repository.findById(repoId);
        if (repoOpt.isEmpty()) return false;

        MonitoredRepo repo = repoOpt.get();
        
        // Se o usuário digitou uma branch no formulário, usa ela. Senão, usa a do banco.
        String branchToPush = (customBranch != null && !customBranch.trim().isEmpty()) ? customBranch : repo.getTargetBranch();

        System.out.println("\n==================================================");
        System.out.println("⚡ [OffGate AI Engine] Code Review aprovado pelo usuário!");
        System.out.println("📦 Destino: " + repo.getRepoName() + " | Branch: " + branchToPush);
        System.out.println("📝 Mensagem: " + commitMessage);

        // Passa os dados do formulário para o serviço do GitHub
        boolean pushSuccess = githubService.commitAndPush(repo.getRepoName(), branchToPush, commitMessage, customPrompt);

        if (pushSuccess) {
            repo.setHealthy(true);
            repository.save(repo);
            return true;
        }
        return false;
    }
}