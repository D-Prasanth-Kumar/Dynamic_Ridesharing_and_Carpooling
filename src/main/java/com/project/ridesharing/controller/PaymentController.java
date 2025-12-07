package com.project.ridesharing.controller;

import com.project.ridesharing.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Double> data) {
        try {
            Double amount = data.get("amount");
            String orderId = paymentService.createOrder(amount);
            return ResponseEntity.ok(Map.of("orderId", orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }
}