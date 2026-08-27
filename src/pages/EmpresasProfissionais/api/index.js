import client from '../../../api/client';

export const getProfissionaisByCategoria = (categoria) => client.get(`/profissionais/${categoria}`);
export const getStatusAusencia = (id) => client.get(`/usuarios/${id}/status-ausencia`);
