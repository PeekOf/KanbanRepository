package com.kanbansync.backend.domain.project.service;

import com.kanbansync.backend.domain.project.dto.*;
import com.kanbansync.backend.domain.project.model.KanbanColumn;
import com.kanbansync.backend.domain.project.model.Project;
import com.kanbansync.backend.domain.project.model.User;
import com.kanbansync.backend.domain.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ProjectRepository projectRepository;
    private final KanbanColumnRepository kanbanColumnRepository;

    // Método para REGISTRAR un nuevo usuario
    public AuthResponse register(AuthRequest request) {
        // Comprobamos si el usuario ya existe para no duplicarlo
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El usuario ya existe");
        }

        // Creamos el nuevo usuario y encriptamos su contraseña
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Guardamos en base de datos
        User savedUser =userRepository.save(user);

        Project defaultProject = Project.builder()
            .name("Mi Primer Tablero")
            .description("Tablero creado automáticamente")
            .user(savedUser)
            .build();
        Project savedProject = projectRepository.save(defaultProject);

        String[] defaultTitles = {"Por hacer", "En proceso", "Terminado"};
    
        for (int i = 0; i < defaultTitles.length; i++) {
            KanbanColumn column = KanbanColumn.builder()
                    .title(defaultTitles[i])
                    .position(i) // 0 para Por hacer, 1 para En proceso, 2 para Terminado
                    .project(savedProject)
                    .build();
            kanbanColumnRepository.save(column);
        }


        // Generamos el token VIP para que ya entre logueado
        String jwtToken = jwtService.generateToken(user.getEmail());
        return new AuthResponse(jwtToken);
    }

    // Método para INICIAR SESIÓN
    public AuthResponse login(AuthRequest request) {
        try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        } catch (Exception e) {
            System.out.println("❌ Error autenticando: " + e.getMessage());
            throw e;
        }
        // El AuthenticationManager comprueba automáticamente si la contraseña es correcta.
        // Si está mal, lanzará un error y no pasará de esta línea.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Si la contraseña era correcta, buscamos al usuario y le damos un token nuevo
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String jwtToken = jwtService.generateToken(user.getEmail());
        return new AuthResponse(jwtToken);
    }
}