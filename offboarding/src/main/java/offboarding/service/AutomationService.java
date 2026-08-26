package offboarding.service; // (Ajuste o pacote conforme sua estrutura)

import lombok.RequiredArgsConstructor;
import offboarding.model.Freelancer;
import offboarding.repository.FreelancerRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutomationService {

    private final FreelancerRepository repository;

    /* 
     * O Cron "0 0 0 * * ?" significa: 
     * Rodar no segundo 0, minuto 0, hora 0 (meia-noite), todos os dias.
     * 
     * DICA DE TESTE: 
     * Para testar agora, comente a linha de cima e descomente a de baixo.
     * A de baixo roda a cada 10 segundos!
     */
    // @Scheduled(cron = "*/10 * * * * *")
    @Scheduled(cron = "0 0 0 * * ?")
    public void executeAutomaticRevocation() {
        LocalDate today = LocalDate.now();
        
        List<Freelancer> expiredContracts = repository
                .findByIsRevokedFalseAndOffboardingDateLessThanEqual(today);

        if (!expiredContracts.isEmpty()) {
            for (Freelancer freelancer : expiredContracts) {
                freelancer.setRevoked(true); 
                // Nota: se no seu modelo a variável chama "isRevoked", o Lombok pode ter gerado "setRevoked(true)" ou "setIsRevoked(true)".
            }
            repository.saveAll(expiredContracts);
            System.out.println("🤖 [NEXUS AUTO] " + expiredContracts.size() + " acessos foram revogados automaticamente!");
        }
    }
}