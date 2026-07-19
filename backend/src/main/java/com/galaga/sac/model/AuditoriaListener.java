package com.galaga.sac.model;

import com.galaga.sac.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import java.time.LocalDateTime;

@Component
public class AuditoriaListener {

    private static AuditoriaRepository auditoriaRepository;

    @Autowired
    public void setAuditoriaRepository(AuditoriaRepository repo) {
        AuditoriaListener.auditoriaRepository = repo;
    }

    @PostPersist
    public void postPersist(Object target) {
        logAudit("CREATE", target);
    }

    @PostUpdate
    public void postUpdate(Object target) {
        logAudit("UPDATE", target);
    }

    @PostRemove
    public void postRemove(Object target) {
        logAudit("DELETE", target);
    }

    private void logAudit(String accion, Object target) {
        if (auditoriaRepository == null) return;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.getName() != null) ? auth.getName() : "SISTEMA";

        Auditoria aud = new Auditoria();
        aud.setUsuario(username);
        aud.setAccion(accion);
        aud.setEntidad(target.getClass().getSimpleName());
        aud.setTimestamp(LocalDateTime.now());
        aud.setDetalles(target.toString());

        // Usamos un nuevo hilo o evitamos problemas de transacción anidada si falla
        try {
            auditoriaRepository.save(aud);
        } catch (Exception e) {
            // Log fallback
            System.err.println("Error guardando auditoria: " + e.getMessage());
        }
    }
}
