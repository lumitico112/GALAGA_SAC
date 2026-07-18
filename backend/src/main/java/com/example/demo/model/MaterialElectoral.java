package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "material_electoral")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialElectoral {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_material")
    private Long idMaterial;
    
    @Column(nullable = false, length = 150)
    private String descripcion;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "En Almacen";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ruta")
    private Ruta ruta;
}
