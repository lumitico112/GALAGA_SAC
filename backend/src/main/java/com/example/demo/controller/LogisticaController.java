package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.LogisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/logistica")
public class LogisticaController {

    @Autowired
    private LogisticaService logisticaService;

    // --- Conductores ---
    @GetMapping("/conductores")
    public ResponseEntity<List<Conductor>> listarConductores() {
        return ResponseEntity.ok(logisticaService.listarConductores());
    }

    @GetMapping("/conductores/disponibles")
    public ResponseEntity<List<Conductor>> listarConductoresDisponibles() {
        return ResponseEntity.ok(logisticaService.listarConductoresDisponibles());
    }

    @PostMapping("/conductores")
    public ResponseEntity<Conductor> crearConductor(@RequestBody Conductor conductor) {
        return ResponseEntity.ok(logisticaService.guardarConductor(conductor));
    }

    // --- Vehículos ---
    @GetMapping("/vehiculos")
    public ResponseEntity<List<Vehiculo>> listarVehiculos() {
        return ResponseEntity.ok(logisticaService.listarVehiculos());
    }

    @GetMapping("/vehiculos/disponibles")
    public ResponseEntity<List<Vehiculo>> listarVehiculosDisponibles() {
        return ResponseEntity.ok(logisticaService.listarVehiculosDisponibles());
    }

    @PostMapping("/vehiculos")
    public ResponseEntity<Vehiculo> crearVehiculo(@RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(logisticaService.guardarVehiculo(vehiculo));
    }

    // --- Operadores ---
    @GetMapping("/operadores")
    public ResponseEntity<List<Operador>> listarOperadores() {
        return ResponseEntity.ok(logisticaService.listarOperadores());
    }

    @PostMapping("/operadores")
    public ResponseEntity<Operador> crearOperador(@RequestBody Operador operador) {
        return ResponseEntity.ok(logisticaService.guardarOperador(operador));
    }

    // --- Rutas ---
    @GetMapping("/rutas")
    public ResponseEntity<List<Ruta>> listarRutas() {
        return ResponseEntity.ok(logisticaService.listarRutas());
    }

    @GetMapping("/rutas/{id}")
    public ResponseEntity<Ruta> obtenerRuta(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.obtenerRuta(id));
    }

    @PostMapping("/rutas")
    public ResponseEntity<?> planificarRuta(@RequestBody Ruta ruta) {
        try {
            return ResponseEntity.ok(logisticaService.planificarRuta(ruta));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/rutas/{id}/iniciar")
    public ResponseEntity<?> iniciarTransito(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(logisticaService.iniciarTransito(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // --- Material Electoral ---
    @PostMapping("/material")
    public ResponseEntity<MaterialElectoral> crearMaterial(@RequestBody MaterialElectoral material) {
        return ResponseEntity.ok(logisticaService.guardarMaterial(material));
    }

    @GetMapping("/material/ruta/{idRuta}")
    public ResponseEntity<List<MaterialElectoral>> listarMaterialesPorRuta(@PathVariable Long idRuta) {
        return ResponseEntity.ok(logisticaService.listarMaterialesPorRuta(idRuta));
    }
}
