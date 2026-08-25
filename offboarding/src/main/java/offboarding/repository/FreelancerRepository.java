package offboarding.repository;

import offboarding.model.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FreelancerRepository extends JpaRepository<Freelancer, UUID> {
}