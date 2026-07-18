package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehiculo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehiculo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private Long idVehiculo;
    
    @Column(nullable = false, unique = true, length = 15)
    private String placa;
    
    @Column(nullable = false, length = 50)
    private String tipo;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal capacidad;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Disponible";
    
    @Column(length = 50)
    private String gps;
}
