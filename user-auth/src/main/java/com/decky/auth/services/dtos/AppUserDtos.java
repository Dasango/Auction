package com.decky.auth.services.dtos;


import com.decky.auth.persistence.models.AppUser;
import com.decky.auth.persistence.models.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class AppUserDtos {

    public record Response(
            Long id,
            String name,
            Set<Role> roles
    ){
        public static Response fromEntity(AppUser user) {
            return new Response(
                    user.getId(),
                    user.getUsername(),
                    user.getRoles()
            );
        }
    }

    public record SignUpRequest(
            @NotBlank(message = "El nombre de usuario es obligatorio")
            @Size(min = 4, max = 20, message = "El nombre de usuario debe tener entre 4 y 20 caracteres")
            String username,

            @NotBlank(message = "La contraseña es obligatoria")
            @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres")
            String password
    ) {}
}
