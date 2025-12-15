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
    private final EmailService emailService;

    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public RegisterResponse registerUser(RegisterRequest request) {
        if(userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = Role.valueOf(request.getRole().toUpperCase());
        user.setRole(role);

        String otp = String.valueOf((int)((Math.random() * 900000) + 100000));
        user.setOtp(otp);
        user.setOtpVerified(false);

        User savedUser = userRepository.save(user);

        emailService.sendOtpEmail(savedUser.getEmail(), otp);

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

        if (user.isBlocked()) {
            throw new RuntimeException("Your account has been suspended. Contact support.");
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Username or Password");
        }

        if(!user.isOtpVerified()) {
            throw new RuntimeException("Please verify OTP before logging in.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }

    @Override
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setOtpVerified(true);
        user.setOtp(null);
        userRepository.save(user);

        return "OTP verified successfully!";
    }

    @Override
    public String resendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.isOtpVerified()) {
            throw new RuntimeException("User is already verified. No need to resend OTP.");
        }

        String newOtp = String.valueOf((int)((Math.random() * 900000) + 100000));
        user.setOtp(newOtp);

        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), newOtp);

        return "OTP sent to your email.";
    }
}
