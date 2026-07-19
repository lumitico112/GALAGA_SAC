package com.galaga.sac.controller;

import com.galaga.sac.dto.AuthResponse;
import com.galaga.sac.dto.LoginRequest;
import com.galaga.sac.dto.RegisterRequest;
import com.galaga.sac.model.Usuario;
import com.galaga.sac.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrar(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.registrar(registerRequest));
    }
}
