package com.galaga.sac.config;

import com.galaga.sac.model.Usuario;
import com.galaga.sac.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(Usuario.builder()
                    .nombre("Administrador Galaga")
                    .correo("admin@galaga.com")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol("ADMIN")
                    .build());

            usuarioRepository.save(Usuario.builder()
                    .nombre("Coordinador Logistico")
                    .correo("coordinador@galaga.com")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol("COORDINADOR")
                    .build());

            usuarioRepository.save(Usuario.builder()
                    .nombre("Conductor Principal")
                    .correo("conductor@galaga.com")
                    .contrasena(passwordEncoder.encode("123456"))
                    .rol("CONDUCTOR")
                    .build());
            
            System.out.println("==================================================");
            System.out.println(">>> Usuarios iniciales creados exitosamente en la base de datos.");
            System.out.println("==================================================");
        }
    }
}
