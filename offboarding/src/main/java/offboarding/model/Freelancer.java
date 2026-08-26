package offboarding.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "freelancers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // --- MÁGICA ACONTECENDO AQUI ---
    @Convert(converter = offboarding.security.StringCryptoConverter.class)
    @Column(name = "github_username", nullable = false)
    private String githubUsername;

    @Convert(converter = offboarding.security.StringCryptoConverter.class)
    @Column(name = "aws_iam_user")
    private String awsIamUser;
    // -------------------------------

    @Column(name = "offboarding_date", nullable = false)
    private LocalDate offboardingDate;

    @Builder.Default
    @Column(name = "is_revoked", nullable = false)
    private Boolean isRevoked = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isRevoked == null) {
            this.isRevoked = false;
        }
    }

    public void setRevoked(boolean b) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setRevoked'");
    }
}