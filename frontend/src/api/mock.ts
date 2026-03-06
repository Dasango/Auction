import api from "./axios";

export const setupMocks = () => {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    
    if (!useMock) return;

    console.log("🚀 Auth Mocking Enabled");

    // Intercept requests and return mock responses
    api.interceptors.request.use(async (config) => {
        if (config.url === "/auth/login") {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock successful login
            config.adapter = async () => {
                return {
                    data: "mock-jwt-token",
                    status: 200,
                    statusText: "OK",
                    headers: {},
                    config
                };
            };
        }

        if (config.url === "/auth/signup") {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            config.adapter = async () => {
                return {
                    data: { message: "User created successfully" },
                    status: 201,
                    statusText: "Created",
                    headers: {},
                    config
                };
            };
        }

        return config;
    });
};
