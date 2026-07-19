package com.galaga.sac.controller;

import com.galaga.sac.model.*;
import com.galaga.sac.service.LogisticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/conductores/{id}")
    public ResponseEntity<Conductor> obtenerConductor(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.obtenerConductor(id));
    }

    @PostMapping("/conductores")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Conductor> crearConductor(@RequestBody Conductor conductor) {
        return ResponseEntity.ok(logisticaService.guardarConductor(conductor));
    }

    @PutMapping("/conductores/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Conductor> actualizarConductor(@PathVariable Long id, @RequestBody Conductor conductor) {
        return ResponseEntity.ok(logisticaService.actualizarConductor(id, conductor));
    }

    @DeleteMapping("/conductores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarConductor(@PathVariable Long id) {
        logisticaService.eliminarConductor(id);
        return ResponseEntity.noContent().build();
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

    @GetMapping("/vehiculos/{id}")
    public ResponseEntity<Vehiculo> obtenerVehiculo(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.obtenerVehiculo(id));
    }

    @PostMapping("/vehiculos")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR')")
    public ResponseEntity<Vehiculo> crearVehiculo(@RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(logisticaService.guardarVehiculo(vehiculo));
    }

    @PutMapping("/vehiculos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR', 'SUPERVISOR')")
    public ResponseEntity<Vehiculo> actualizarVehiculo(@PathVariable Long id, @RequestBody Vehiculo vehiculo) {
        return ResponseEntity.ok(logisticaService.actualizarVehiculo(id, vehiculo));
    }

    @DeleteMapping("/vehiculos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarVehiculo(@PathVariable Long id) {
        logisticaService.eliminarVehiculo(id);
        return ResponseEntity.noContent().build();
    }

    // --- Mantenimientos ---
    @GetMapping("/vehiculos/{idVehiculo}/mantenimientos")
    public ResponseEntity<List<com.galaga.sac.model.Mantenimiento>> listarMantenimientos(@PathVariable Long idVehiculo) {
        return ResponseEntity.ok(logisticaService.listarMantenimientosPorVehiculo(idVehiculo));
    }

    @PostMapping("/vehiculos/{idVehiculo}/mantenimientos")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<com.galaga.sac.model.Mantenimiento> registrarMantenimiento(
            @PathVariable Long idVehiculo,
            @RequestBody com.galaga.sac.model.Mantenimiento mantenimiento) {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setIdVehiculo(idVehiculo);
        mantenimiento.setVehiculo(vehiculo);
        return ResponseEntity.ok(logisticaService.registrarMantenimiento(mantenimiento));
    }

    @PutMapping("/mantenimientos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<com.galaga.sac.model.Mantenimiento> actualizarMantenimiento(@PathVariable Long id, @RequestBody com.galaga.sac.model.Mantenimiento mantenimiento) {
        return ResponseEntity.ok(logisticaService.actualizarMantenimiento(id, mantenimiento));
    }

    @DeleteMapping("/mantenimientos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarMantenimiento(@PathVariable Long id) {
        logisticaService.eliminarMantenimiento(id);
        return ResponseEntity.noContent().build();
    }

    // --- Operadores ---
    @GetMapping("/operadores")
    public ResponseEntity<List<Operador>> listarOperadores() {
        return ResponseEntity.ok(logisticaService.listarOperadores());
    }

    @PostMapping("/operadores")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Operador> crearOperador(@RequestBody Operador operador) {
        return ResponseEntity.ok(logisticaService.guardarOperador(operador));
    }

    @PutMapping("/operadores/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Operador> actualizarOperador(@PathVariable Long id, @RequestBody Operador operador) {
        return ResponseEntity.ok(logisticaService.actualizarOperador(id, operador));
    }

    @DeleteMapping("/operadores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarOperador(@PathVariable Long id) {
        logisticaService.eliminarOperador(id);
        return ResponseEntity.noContent().build();
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
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Ruta> planificarRuta(@RequestBody Ruta ruta) {
        return ResponseEntity.ok(logisticaService.planificarRuta(ruta));
    }

    @PostMapping("/rutas/{id}/iniciar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Ruta> iniciarTransito(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.iniciarTransito(id));
    }

    @PostMapping("/rutas/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Ruta> cancelarRuta(@PathVariable Long id) {
        return ResponseEntity.ok(logisticaService.cancelarRuta(id));
    }

    @PutMapping("/rutas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<Ruta> actualizarRuta(@PathVariable Long id, @RequestBody Ruta ruta) {
        return ResponseEntity.ok(logisticaService.actualizarRuta(id, ruta));
    }

    @DeleteMapping("/rutas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarRuta(@PathVariable Long id) {
        logisticaService.eliminarRuta(id);
        return ResponseEntity.noContent().build();
    }

    // --- Material Electoral ---
    @PostMapping("/material")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<MaterialElectoral> crearMaterial(@RequestBody MaterialElectoral material) {
        return ResponseEntity.ok(logisticaService.guardarMaterial(material));
    }

    @GetMapping("/material/ruta/{idRuta}")
    public ResponseEntity<List<MaterialElectoral>> listarMaterialesPorRuta(@PathVariable Long idRuta) {
        return ResponseEntity.ok(logisticaService.listarMaterialesPorRuta(idRuta));
    }

    @PutMapping("/material/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINADOR')")
    public ResponseEntity<MaterialElectoral> actualizarMaterial(@PathVariable Long id, @RequestBody MaterialElectoral material) {
        return ResponseEntity.ok(logisticaService.actualizarMaterial(id, material));
    }

    @DeleteMapping("/material/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarMaterial(@PathVariable Long id) {
        logisticaService.eliminarMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
