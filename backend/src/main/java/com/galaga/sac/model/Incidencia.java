package com.galaga.sac.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidencia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidencia")
    private Long idIncidencia;
    
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false, length = 50)
    private String tipo;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Reportada";
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ruta")
    private Ruta ruta;
    
    @PrePersist
    protected void onCreate() {
        if (fechaHora == null) {
            fechaHora = LocalDateTime.now();
        }
    }
}
