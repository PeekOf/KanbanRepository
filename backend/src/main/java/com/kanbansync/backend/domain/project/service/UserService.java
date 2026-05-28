package com.kanbansync.backend.domain.project.service;

import com.kanbansync.backend.domain.project.model.*;
import com.kanbansync.backend.domain.project.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Buscar usuario por Email (útil para login)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Guardar un nuevo usuario (aquí luego añadiremos el cifrado de contraseña)
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Buscar por ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}