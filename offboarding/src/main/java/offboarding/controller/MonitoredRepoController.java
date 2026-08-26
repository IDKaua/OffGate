package offboarding.controller;

import offboarding.model.MonitoredRepo;
import offboarding.repository.MonitoredRepoRepository;
import offboarding.service.OffGateAiService; // <-- Nova importação do nosso serviço
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/repositories")
public class MonitoredRepoController {

    @Autowired
    private MonitoredRepoRepository repository;

    @Autowired
    private OffGateAiService aiService; // <-- Injetando o Motor de IA

    @GetMapping
    public List<MonitoredRepo> getAllRepos() {
        return repository.findAll();
    }

    @PostMapping
    public MonitoredRepo createRepo(@RequestBody MonitoredRepo repo) {
        repo.setHealthy(false); 
        return repository.save(repo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRepo(@PathVariable UUID id) {
        return repository.findById(id).map(repo -> {
            repository.delete(repo);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // O método foi limpo e agora delega o trabalho pesado para o Service!
    @PutMapping("/{id}/repair")
    public ResponseEntity<?> repairRepo(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> payload) {
    
    // Pega o prompt enviado pelo React, ou usa um padrão se vier vazio
    String prompt = (payload != null && payload.containsKey("prompt")) 
                    ? payload.get("prompt") 
                    : "Fazer análise completa e corrigir vulnerabilidades padrão.";
                    
    boolean isRepaired = aiService.runAiDeepScanAndRepair(id, prompt);
    
    if (isRepaired) {
        return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
}
}