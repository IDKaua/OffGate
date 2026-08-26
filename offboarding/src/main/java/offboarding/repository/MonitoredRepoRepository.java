package offboarding.repository;

import offboarding.model.MonitoredRepo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MonitoredRepoRepository extends JpaRepository<MonitoredRepo, UUID> {
}