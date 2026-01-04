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

import java.security.SecureRandom;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    private final boolean otpEmailEnabled;

    public UserServiceImpl(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();

        this.otpEmailEnabled = Boolean.parseBoolean(
                System.getenv().getOrDefault("OTP_EMAIL_ENABLED", "true")
        );
    }

    @Override
    public RegisterResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
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

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpVerified(false);

        User savedUser = userRepository.save(user);

        try {
            if (otpEmailEnabled) {
                emailService.sendOtpEmail(savedUser.getEmail(), otp);
            } else {
                throw new RuntimeException("OTP email disabled");
            }
        } catch (Exception e) {
            System.out.println("⚠️ OTP EMAIL FAILED OR DISABLED: " + e.getMessage());
            System.out.println("✅ AUTO-VERIFYING USER (NON-PROD MODE)");

            savedUser.setOtpVerified(true);
            savedUser.setOtp(null);
            userRepository.save(savedUser);
        }

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
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (user.isBlocked()) {
            throw new RuntimeException("Your account has been suspended. Contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        if (!user.isOtpVerified()) {
            throw new RuntimeException("Please verify OTP before logging in.");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }

    @Override
    public String verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isOtpVerified()) {
            return "User already verified.";
        }

        if (!otp.equals(user.getOtp())) {
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

        if (user.isOtpVerified()) {
            throw new RuntimeException("User already verified.");
        }

        String newOtp = generateOtp();
        user.setOtp(newOtp);
        userRepository.save(user);

        try {
            if (otpEmailEnabled) {
                emailService.sendOtpEmail(user.getEmail(), newOtp);
            } else {
                throw new RuntimeException("OTP email disabled");
            }
        } catch (Exception e) {
            System.out.println("⚠️ OTP RESEND SKIPPED: " + e.getMessage());
        }

        return "OTP processed.";
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
