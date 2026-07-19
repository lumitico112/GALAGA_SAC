package com.galaga.sac.service;

import com.galaga.sac.exception.BusinessRuleException;
import com.galaga.sac.exception.ResourceNotFoundException;
import com.galaga.sac.model.*;
import com.galaga.sac.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private void notificarActualizacionRutas() {
        messagingTemplate.convertAndSend("/topic/rutas", rutaRepository.findAll());
    }

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
                .orElseThrow(() -> new ResourceNotFoundException("Conductor no encontrado con ID: " + id));
    }

    @Transactional
    public Conductor actualizarConductor(Long id, Conductor conductorData) {
        Conductor conductor = obtenerConductor(id);
        conductor.setNombre(conductorData.getNombre());
        conductor.setLicencia(conductorData.getLicencia());
        conductor.setTelefono(conductorData.getTelefono());
        conductor.setEstado(conductorData.getEstado());
        return conductorRepository.save(conductor);
    }

    public void eliminarConductor(Long id) {
        Conductor conductor = obtenerConductor(id);
        if ("Ocupado".equalsIgnoreCase(conductor.getEstado())) {
            throw new BusinessRuleException("No se puede eliminar un conductor que está en una ruta activa");
        }
        conductorRepository.delete(conductor);
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
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no encontrado con ID: " + id));
    }

    @Transactional
    public Vehiculo actualizarVehiculo(Long id, Vehiculo vehiculoData) {
        Vehiculo vehiculo = obtenerVehiculo(id);
        vehiculo.setPlaca(vehiculoData.getPlaca());
        vehiculo.setTipo(vehiculoData.getTipo());
        vehiculo.setCapacidad(vehiculoData.getCapacidad());
        vehiculo.setEstado(vehiculoData.getEstado());
        vehiculo.setGps(vehiculoData.getGps());
        return vehiculoRepository.save(vehiculo);
    }

    public void eliminarVehiculo(Long id) {
        Vehiculo vehiculo = obtenerVehiculo(id);
        if ("Ocupado".equalsIgnoreCase(vehiculo.getEstado())) {
            throw new BusinessRuleException("No se puede eliminar un vehículo que está en una ruta activa");
        }
        vehiculoRepository.delete(vehiculo);
    }

    // --- Mantenimientos ---
    @Autowired
    private com.galaga.sac.repository.MantenimientoRepository mantenimientoRepository;

    public List<com.galaga.sac.model.Mantenimiento> listarMantenimientosPorVehiculo(Long idVehiculo) {
        return mantenimientoRepository.findByVehiculoIdVehiculo(idVehiculo);
    }

    @Transactional
    public com.galaga.sac.model.Mantenimiento registrarMantenimiento(com.galaga.sac.model.Mantenimiento mantenimiento) {
        Vehiculo vehiculo = obtenerVehiculo(mantenimiento.getVehiculo().getIdVehiculo());
        vehiculo.setEstado("En Mantenimiento");
        vehiculoRepository.save(vehiculo);
        return mantenimientoRepository.save(mantenimiento);
    }

    public com.galaga.sac.model.Mantenimiento obtenerMantenimiento(Long id) {
        return mantenimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mantenimiento no encontrado con ID: " + id));
    }

    @Transactional
    public com.galaga.sac.model.Mantenimiento actualizarMantenimiento(Long id, com.galaga.sac.model.Mantenimiento data) {
        com.galaga.sac.model.Mantenimiento mant = obtenerMantenimiento(id);
        mant.setTipo(data.getTipo());
        mant.setFecha(data.getFecha());
        mant.setDescripcion(data.getDescripcion());
        mant.setCosto(data.getCosto());
        mant.setEstado(data.getEstado());
        return mantenimientoRepository.save(mant);
    }

    public void eliminarMantenimiento(Long id) {
        mantenimientoRepository.deleteById(id);
    }

    // --- Operadores ---
    public List<Operador> listarOperadores() {
        return operadorRepository.findAll();
    }

    public Operador guardarOperador(Operador operador) {
        return operadorRepository.save(operador);
    }

    public Operador obtenerOperador(Long id) {
        return operadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Operador no encontrado con ID: " + id));
    }

    @Transactional
    public Operador actualizarOperador(Long id, Operador operadorData) {
        Operador operador = obtenerOperador(id);
        operador.setNombre(operadorData.getNombre());
        operador.setTelefono(operadorData.getTelefono());
        return operadorRepository.save(operador);
    }

    public void eliminarOperador(Long id) {
        operadorRepository.deleteById(id);
    }

    // --- Rutas ---
    public List<Ruta> listarRutas() {
        return rutaRepository.findAll();
    }

    public Ruta obtenerRuta(Long id) {
        return rutaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada con ID: " + id));
    }

    @Transactional
    public Ruta planificarRuta(Ruta ruta) {
        Conductor conductor = conductorRepository.findById(ruta.getConductor().getIdConductor())
                .orElseThrow(() -> new ResourceNotFoundException("Conductor no registrado"));
        
        Vehiculo vehiculo = vehiculoRepository.findById(ruta.getVehiculo().getIdVehiculo())
                .orElseThrow(() -> new ResourceNotFoundException("Vehículo no registrado"));

        if (!"Disponible".equalsIgnoreCase(conductor.getEstado())) {
            throw new BusinessRuleException("El conductor " + conductor.getNombre() + " no está disponible (Estado: " + conductor.getEstado() + ")");
        }

        if (!"Disponible".equalsIgnoreCase(vehiculo.getEstado())) {
            throw new BusinessRuleException("El vehículo con placa " + vehiculo.getPlaca() + " no está disponible (Estado: " + vehiculo.getEstado() + ")");
        }

        // Marcar recursos como ocupados
        conductor.setEstado("Ocupado");
        vehiculo.setEstado("Ocupado");
        
        conductorRepository.save(conductor);
        vehiculoRepository.save(vehiculo);

        ruta.setEstado("Planificada");
        Ruta saved = rutaRepository.save(ruta);
        notificarActualizacionRutas();
        return saved;
    }

    @Transactional
    public Ruta iniciarTransito(Long idRuta) {
        Ruta ruta = obtenerRuta(idRuta);
        if (!"Planificada".equalsIgnoreCase(ruta.getEstado())) {
            throw new BusinessRuleException("La ruta debe estar en estado Planificada para iniciar tránsito");
        }
        ruta.setEstado("En Tránsito");
        Ruta saved = rutaRepository.save(ruta);
        notificarActualizacionRutas();
        return saved;
    }

    @Transactional
    public Ruta cancelarRuta(Long idRuta) {
        Ruta ruta = obtenerRuta(idRuta);
        if ("Entregado".equalsIgnoreCase(ruta.getEstado())) {
            throw new BusinessRuleException("No se puede cancelar una ruta que ya fue entregada");
        }
        return liberarRecursosRuta(ruta, "Cancelada");
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
        Ruta saved = rutaRepository.save(ruta);
        notificarActualizacionRutas();
        return saved;
    }

    @Transactional
    public Ruta actualizarRuta(Long id, Ruta rutaData) {
        Ruta ruta = obtenerRuta(id);
        ruta.setOrigen(rutaData.getOrigen());
        ruta.setDestino(rutaData.getDestino());
        return rutaRepository.save(ruta);
    }

    public void eliminarRuta(Long id) {
        rutaRepository.deleteById(id);
    }

    // --- Material Electoral ---
    public MaterialElectoral guardarMaterial(MaterialElectoral material) {
        return materialElectoralRepository.save(material);
    }

    public List<MaterialElectoral> listarMaterialesPorRuta(Long idRuta) {
        return materialElectoralRepository.findByRutaIdRuta(idRuta);
    }

    public MaterialElectoral obtenerMaterial(Long id) {
        return materialElectoralRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material no encontrado con ID: " + id));
    }

    @Transactional
    public MaterialElectoral actualizarMaterial(Long id, MaterialElectoral data) {
        MaterialElectoral material = obtenerMaterial(id);
        material.setDescripcion(data.getDescripcion());
        material.setCantidad(data.getCantidad());
        material.setPeso(data.getPeso());
        return materialElectoralRepository.save(material);
    }

    public void eliminarMaterial(Long id) {
        materialElectoralRepository.deleteById(id);
    }
}
