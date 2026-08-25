package offboarding.controller;

import offboarding.model.Freelancer;
import offboarding.repository.FreelancerRepository;
import offboarding.security.EncryptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerRepository repository;
    private final EncryptionService encryptionService;

    @PostMapping
    public ResponseEntity<Freelancer> create(@RequestBody Freelancer freelancer) {
        Freelancer savedFreelancer = repository.save(freelancer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFreelancer);
    }

    @GetMapping
    public ResponseEntity<List<Freelancer>> listAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/encrypt-test")
    public ResponseEntity<String> testEncryption(@RequestBody String plainText) {
        return ResponseEntity.ok(encryptionService.encrypt(plainText));
    }

    @PostMapping("/decrypt-test")
    public ResponseEntity<String> testDecryption(@RequestBody String encryptedText) {
        return ResponseEntity.ok(encryptionService.decrypt(encryptedText));
    }
}