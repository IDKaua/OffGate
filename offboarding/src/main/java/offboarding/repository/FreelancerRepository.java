package offboarding.repository;

import offboarding.model.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, UUID> {
    
    // Busca todos que NÃO estão revogados E a data de offboarding é hoje ou já passou
    List<Freelancer> findByIsRevokedFalseAndOffboardingDateLessThanEqual(LocalDate date);
    
}