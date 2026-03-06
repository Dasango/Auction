import api from "@/api/axios";

const login = async (data: {username: string, password: string}) : Promise<string> => {
    const response = await api.post("/auth/login", data);
    return response.data;
}

const signup = async (data: any) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
}

export { login, signup }