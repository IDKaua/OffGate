package offboarding.controller;

import offboarding.security.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;

    // 1. O método de Cadastro (Agora dentro da classe!)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        // Como é um MVP, vamos simular que o cadastro deu certo 
        // para o React liberar a tela sem precisarmos de banco de dados para usuários agora.
        Map<String, String> response = new HashMap<>();
        response.put("message", "Usuário cadastrado com sucesso!");
        
        return ResponseEntity.ok(response);
    }

    // 2. O método de Login atualizado para enviar um JSON perfeito para o React
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Credencial master do sistema
        if ("admin".equals(request.getUsername()) && "admin123".equals(request.getPassword())) {
            String token = jwtService.generateToken(request.getUsername());
            
            // O React espera receber { "token": "eyJh..." }
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            
            return ResponseEntity.ok(response);
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("message", "Credenciais inválidas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}

@Data
class LoginRequest {
    private String username;
    private String password;
}