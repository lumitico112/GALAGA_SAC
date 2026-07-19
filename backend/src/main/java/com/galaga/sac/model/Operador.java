package com.galaga.sac.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "operador")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_operador")
    private Long idOperador;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(length = 20)
    private String telefono;
}
