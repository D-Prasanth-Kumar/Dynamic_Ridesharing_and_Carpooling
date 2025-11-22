package com.project.ridesharing.service;

import com.project.ridesharing.dto.LoginRequest;
import com.project.ridesharing.dto.LoginResponse;
import com.project.ridesharing.dto.RegisterRequest;
import com.project.ridesharing.dto.RegisterResponse;

public interface UserService {
    RegisterResponse registerUser(RegisterRequest request);

    LoginResponse loginUser(LoginRequest request);

    String verifyOtp(String email, String otp);

    String resendOtp(String email);
}
