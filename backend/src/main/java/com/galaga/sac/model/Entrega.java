package com.galaga.sac.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entrega")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrega {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_entrega")
    private Long idEntrega;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Entregado";
    
    @Column(columnDefinition = "TEXT")
    private String observacion;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ruta", unique = true)
    private Ruta ruta;
    
    @PrePersist
    protected void onCreate() {
        if (fechaEntrega == null) {
            fechaEntrega = LocalDateTime.now();
        }
    }
}
