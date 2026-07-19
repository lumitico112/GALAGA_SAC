package com.galaga.sac.service;

import com.galaga.sac.dto.AuthResponse;
import com.galaga.sac.dto.LoginRequest;
import com.galaga.sac.dto.RegisterRequest;
import com.galaga.sac.model.Usuario;
import com.galaga.sac.repository.UsuarioRepository;
import com.galaga.sac.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getCorreo(),
                        loginRequest.getContrasena()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByCorreo(loginRequest.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado post-autenticación"));

        return AuthResponse.builder()
                .token(jwt)
                .correo(usuario.getCorreo())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol())
                .build();
    }

    public Usuario registrar(RegisterRequest registerRequest) {
        if (usuarioRepository.findByCorreo(registerRequest.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(registerRequest.getNombre())
                .correo(registerRequest.getCorreo())
                .contrasena(passwordEncoder.encode(registerRequest.getContrasena()))
                .rol(registerRequest.getRol())
                .build();

        return usuarioRepository.save(usuario);
    }
}
