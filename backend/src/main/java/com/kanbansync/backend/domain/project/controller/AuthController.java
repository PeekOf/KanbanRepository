package com.kanbansync.backend.domain.project.controller;

import com.kanbansync.backend.domain.project.dto.*;
import com.kanbansync.backend.domain.project.service.*;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) { 
        try {
            // Ejecutamos el registro
            authService.register(request); 
            
            // Devolvemos un JSON con el mensaje de éxito
            return ResponseEntity.ok(Map.of(
                "message", "¡Usuario registrado con éxito! Ya puedes iniciar sesión."
            ));
        } catch (RuntimeException e) {
            // Envolvemos el error en un JSON para que Angular no falle al leerlo
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Si el login es correcto, devolvemos el token/respuesta original de tu servicio
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            // Cambiamos el texto plano por un objeto JSON estructurado con la clave "error"
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo."
            ));
        }
    }
}