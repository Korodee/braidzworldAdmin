import { getCurrentUser, login, logout } from "@/services/authService";
import { LoginData } from "@/types/authTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginData) => login(data.email, data.password),
    });
}

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
    });
}

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            logout();
            return undefined;
        },
    });
}

