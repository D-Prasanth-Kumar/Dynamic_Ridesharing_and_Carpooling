package com.project.ridesharing.service;

import com.project.ridesharing.dto.LoginRequest;
import com.project.ridesharing.dto.LoginResponse;
import com.project.ridesharing.dto.RegisterRequest;
import com.project.ridesharing.dto.RegisterResponse;
import com.project.ridesharing.model.Role;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.UserRepository;
import com.project.ridesharing.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public RegisterResponse registerUser(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if(request.getEmail() != null && !request.getEmail().isBlank()) {

        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = Role.valueOf(request.getRole().toUpperCase());
        user.setRole(role);

        User savedUser = userRepository.save(user);

        RegisterResponse response = new RegisterResponse();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setRole(savedUser.getRole().name());

        return response;
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("invalid Username or Password"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Username or Password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }
}
