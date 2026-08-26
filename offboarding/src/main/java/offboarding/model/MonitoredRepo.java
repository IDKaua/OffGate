package offboarding.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "repositories")
public class MonitoredRepo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String repoName;      
    private String repoUrl;       
    private String targetBranch;  
    private String techStack;     
    
    private LocalDate dateAdded;  
    private boolean isHealthy;    
}