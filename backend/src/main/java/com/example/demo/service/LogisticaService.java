package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class LogisticaService {

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private OperadorRepository operadorRepository;

    @Autowired
    private RutaRepository rutaRepository;

    @Autowired
    private MaterialElectoralRepository materialElectoralRepository;

    // --- Conductores ---
    public List<Conductor> listarConductores() {
        return conductorRepository.findAll();
    }

    public List<Conductor> listarConductoresDisponibles() {
        return conductorRepository.findByEstado("Disponible");
    }

    public Conductor guardarConductor(Conductor conductor) {
        return conductorRepository.save(conductor);
    }

    public Conductor obtenerConductor(Long id) {
        return conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado con ID: " + id));
    }

    // --- Vehículos ---
    public List<Vehiculo> listarVehiculos() {
        return vehiculoRepository.findAll();
    }

    public List<Vehiculo> listarVehiculosDisponibles() {
        return vehiculoRepository.findByEstado("Disponible");
    }

    public Vehiculo guardarVehiculo(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo obtenerVehiculo(Long id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con ID: " + id));
    }

    // --- Operadores ---
    public List<Operador> listarOperadores() {
        return operadorRepository.findAll();
    }

    public Operador guardarOperador(Operador operador) {
        return operadorRepository.save(operador);
    }

    // --- Rutas ---
    public List<Ruta> listarRutas() {
        return rutaRepository.findAll();
    }

    public Ruta obtenerRuta(Long id) {
        return rutaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada con ID: " + id));
    }

    @Transactional
    public Ruta planificarRuta(Ruta ruta) {
        Conductor conductor = conductorRepository.findById(ruta.getConductor().getIdConductor())
                .orElseThrow(() -> new RuntimeException("Conductor no registrado"));
        
        Vehiculo vehiculo = vehiculoRepository.findById(ruta.getVehiculo().getIdVehiculo())
                .orElseThrow(() -> new RuntimeException("Vehículo no registrado"));

        if (!"Disponible".equalsIgnoreCase(conductor.getEstado())) {
            throw new RuntimeException("El conductor " + conductor.getNombre() + " no está disponible (Estado: " + conductor.getEstado() + ")");
        }

        if (!"Disponible".equalsIgnoreCase(vehiculo.getEstado())) {
            throw new RuntimeException("El vehículo con placa " + vehiculo.getPlaca() + " no está disponible (Estado: " + vehiculo.getEstado() + ")");
        }

        // Marcar recursos como ocupados
        conductor.setEstado("Ocupado");
        vehiculo.setEstado("Ocupado");
        
        conductorRepository.save(conductor);
        vehiculoRepository.save(vehiculo);

        ruta.setEstado("Planificada");
        return rutaRepository.save(ruta);
    }

    @Transactional
    public Ruta iniciarTransito(Long idRuta) {
        Ruta ruta = obtenerRuta(idRuta);
        if (!"Planificada".equalsIgnoreCase(ruta.getEstado())) {
            throw new RuntimeException("La ruta debe estar en estado Planificada para iniciar tránsito");
        }
        ruta.setEstado("En Tránsito");
        return rutaRepository.save(ruta);
    }

    @Transactional
    public Ruta liberarRecursosRuta(Ruta ruta, String nuevoEstadoRuta) {
        Conductor conductor = ruta.getConductor();
        Vehiculo vehiculo = ruta.getVehiculo();

        if (conductor != null) {
            conductor.setEstado("Disponible");
            conductorRepository.save(conductor);
        }
        if (vehiculo != null) {
            vehiculo.setEstado("Disponible");
            vehiculoRepository.save(vehiculo);
        }

        ruta.setEstado(nuevoEstadoRuta);
        return rutaRepository.save(ruta);
    }

    // --- Material Electoral ---
    public MaterialElectoral guardarMaterial(MaterialElectoral material) {
        return materialElectoralRepository.save(material);
    }

    public List<MaterialElectoral> listarMaterialesPorRuta(Long idRuta) {
        return materialElectoralRepository.findByRutaIdRuta(idRuta);
    }
}
