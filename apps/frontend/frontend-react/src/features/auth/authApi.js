import { apiRequest } from '../../components/api/httpClient';

const roleToEndpoint = {
  client: '/auth/login/client',
  driver: '/auth/login/deliveryman',
  owner: '/auth/login/restaurant',
};

const roleToRegisterEndpoint = {
  client: '/auth/register/client',
  driver: '/auth/register/deliveryman',
  owner: '/auth/register/restaurant',
};

const roleToBackendRole = {
  client: 'client',
  driver: 'deliveryman',
  owner: 'restaurant',
};

export async function login({ email, password, role }) {
  const endpoint = roleToEndpoint[role];
  if (!endpoint) {
    throw new Error('Role non supporte.');
  }

  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return {
    token: response.token,
    role,
    backendRole: roleToBackendRole[role],
  };
}

export async function register({ role, payload }) {
  const endpoint = roleToRegisterEndpoint[role];
  if (!endpoint) {
    throw new Error('Role non supporte.');
  }

  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    token: response.token,
    role,
    backendRole: roleToBackendRole[role],
  };
}
