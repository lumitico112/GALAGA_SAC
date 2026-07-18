package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conductor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conductor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conductor")
    private Long idConductor;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(nullable = false, length = 20)
    private String licencia;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Disponible";
}
