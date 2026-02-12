import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const agendarService = {
  getProfissionais: () => axios.get(`${API_URL}/profissionais`),
  
  getProfissionalById: (id) => axios.get(`${API_URL}/usuarios/solicitarDados/${id}`),
  
  getReservasProfissional: (profissionalId) => 
    axios.get(`${API_URL}/reservas?profissional_id=${profissionalId}`),
  
  getReservasUsuario: (userId) => 
    axios.get(`${API_URL}/reservas/${userId}`),
    
  getReservasUsuarioProfissional: (userId, profissionalId) => 
    axios.get(`${API_URL}/reservas?usuario_id=${userId}&profissional_id=${profissionalId}`),
  
  createReserva: (data) => axios.post(`${API_URL}/reservas`, data),
  
  createEmergencia: (formData) => axios.post(`${API_URL}/reservas`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  updateReservaStatus: (id, status) => 
    axios.patch(`${API_URL}/reservas/${id}`, { status }),
    
  solicitarFalta: (id, data) => 
    axios.put(`${API_URL}/reservas/solicitar/${id}`, data),
    
  editReserva: (id, data) => 
    axios.patch(`${API_URL}/reservas/editar/${id}`, data),
    
  deleteReserva: (id) => 
    axios.delete(`${API_URL}/reservas/${id}`),
};
