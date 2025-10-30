import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";

export const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await apiRequest.get("/api/user");
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          // Not authenticated, return null
          return null;
        }
        throw error; // Re-throw other errors
      }
    },
    retry: false, // Don't retry on 401s
  });

  return { user: data, isLoading, error };
};
