package com.project.ridesharing.config;

import com.project.ridesharing.model.Role;
import com.project.ridesharing.model.User;
import com.project.ridesharing.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository) {
        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = new User();
                admin.setName("Super Admin");
                admin.setUsername("admin");
                admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
                admin.setEmail("admin@sharewheels.com");
                admin.setPhone("0000000000");
                admin.setRole(Role.ADMIN);
                admin.setOtpVerified(true);

                userRepository.save(admin);
                System.out.println("✅ DEFAULT ADMIN USER CREATED");
            }
        };
    }
}