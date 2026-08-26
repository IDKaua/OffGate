package offboarding; // (O seu pacote pode estar diferente)

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // <-- Adicione esta linha!
public class OffboardingApplication {
    public static void main(String[] args) {
        SpringApplication.run(OffboardingApplication.class, args);
    }
}