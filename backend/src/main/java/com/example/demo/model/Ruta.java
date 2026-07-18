package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ruta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ruta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Long idRuta;
    
    @Column(nullable = false, length = 100)
    private String origen;
    
    @Column(nullable = false, length = 100)
    private String destino;
    
    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;
    
    @Column(name = "fecha_llegada")
    private LocalDateTime fechaLlegada;
    
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "Planificada";
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_conductor")
    private Conductor conductor;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_vehiculo")
    private Vehiculo vehiculo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_operador")
    private Operador operador;
}
