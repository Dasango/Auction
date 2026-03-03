package com.decky.gateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

        public static final List<String> openApiEndpoints = List.of(
                        "/auth/signup",
                        "/auth/login");

        public Predicate<ServerHttpRequest> isSecured = request -> {
                if (request.getMethod().name().equals("OPTIONS")) {
                        return false;
                }
                return openApiEndpoints
                                .stream()
                                .noneMatch(uri -> request.getURI().getPath().contains(uri));
        };
}
