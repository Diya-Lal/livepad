import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { loginUser, registerUser, logoutUser } from '../api/auth.api';
import type { LoginInput, RegisterInput } from '@livepad/shared';

export function useLogin() {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken);
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerUser(input),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken);
      navigate('/dashboard');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login');
    },
  });
}
