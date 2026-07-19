package com.galaga.sac.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
@Data
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;
    private String accion;
    private String entidad;
    private LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    private String detalles;
}
