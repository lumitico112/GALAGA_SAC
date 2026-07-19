package com.galaga.sac.service;

import com.galaga.sac.exception.BusinessRuleException;
import com.galaga.sac.exception.ResourceNotFoundException;
import com.galaga.sac.model.Usuario;
import com.galaga.sac.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public Usuario actualizarUsuario(Long id, Usuario usuarioData) {
        Usuario usuario = obtenerUsuario(id);
        
        // Verificar si el nuevo correo ya está en uso por otro usuario
        if (!usuario.getCorreo().equals(usuarioData.getCorreo())) {
            usuarioRepository.findByCorreo(usuarioData.getCorreo()).ifPresent(existing -> {
                throw new BusinessRuleException("El correo " + usuarioData.getCorreo() + " ya está registrado por otro usuario");
            });
        }

        usuario.setNombre(usuarioData.getNombre());
        usuario.setCorreo(usuarioData.getCorreo());
        usuario.setRol(usuarioData.getRol());
        
        // Solo actualizar contraseña si se proporciona una nueva
        if (usuarioData.getContrasena() != null && !usuarioData.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(usuarioData.getContrasena()));
        }

        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        Usuario usuario = obtenerUsuario(id);
        usuarioRepository.delete(usuario);
    }
}
