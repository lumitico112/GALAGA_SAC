package com.galaga.sac.service;

import com.galaga.sac.dto.AuthResponse;
import com.galaga.sac.dto.LoginRequest;
import com.galaga.sac.dto.RegisterRequest;
import com.galaga.sac.model.Usuario;
import com.galaga.sac.repository.UsuarioRepository;
import com.galaga.sac.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private Usuario mockUsuario;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setIdUsuario(1L);
        mockUsuario.setNombre("Test User");
        mockUsuario.setCorreo("test@galaga.com");
        mockUsuario.setContrasena("encoded_password");
        mockUsuario.setRol("ADMIN");
    }

    @Test
    void testLoginSuccess() {
        LoginRequest req = new LoginRequest();
        req.setCorreo("test@galaga.com");
        req.setContrasena("123456");

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(tokenProvider.generateToken(mockAuth)).thenReturn("mock_jwt_token");
        when(usuarioRepository.findByCorreo("test@galaga.com")).thenReturn(Optional.of(mockUsuario));

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock_jwt_token", res.getToken());
        assertEquals("test@galaga.com", res.getCorreo());
        assertEquals("ADMIN", res.getRol());
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("Nuevo User");
        req.setCorreo("nuevo@galaga.com");
        req.setContrasena("123456");
        req.setRol("CONDUCTOR");

        when(usuarioRepository.findByCorreo(req.getCorreo())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(req.getContrasena())).thenReturn("encoded_pass");
        
        Usuario guardado = new Usuario();
        guardado.setCorreo(req.getCorreo());
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(guardado);

        Usuario res = authService.registrar(req);

        assertNotNull(res);
        assertEquals("nuevo@galaga.com", res.getCorreo());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
