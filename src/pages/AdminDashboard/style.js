import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Container = styled.div`
  padding: 20px;
  text-align: center;
  background-color: rgb(227, 228, 222);
  flex-grow: 1;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* Adiciona rolagem horizontal */
  margin-top: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: rgb(227, 228, 222);
  min-width: 600px; /* Impede que a tabela encolha demais */

  @media (max-width: 768px) {
    min-width: 100%; /* Ajusta a largura para telas pequenas */
    table-layout: auto; /* Ajusta automaticamente o tamanho das colunas */
  }
`;

export const Th = styled.th`
  border: 1px solid black;
  padding: 10px;
  text-align: left;
  white-space: nowrap; /* Impede a quebra de linha nas células do cabeçalho */
  background-color: #f1f1f1;
  position: sticky;
  top: 0;
  z-index: 1; /* Garante que o cabeçalho fique sobre o conteúdo */
`;

export const Td = styled.td`
  border: 1px solid black;
  padding: 10px;
  text-align: left;
  white-space: nowrap; /* Impede a quebra de linha nas células */
  background-color: #fff;

  &:first-child { /* Alvo da primeira coluna */
    position: sticky;
    left: 0;
    background-color: #fff; /* Para garantir que o fundo da célula seja visível */
    z-index: 2; /* Garante que o nome sobreponha outras células */
  }
`;

export const Button = styled.button`
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
`;

export const Button_2 = styled.button`
  padding: 12px 20px;
  background-color: #4caf50;
  color: #fff;
  margin-top: 40px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 25%; /* Largura padrão para telas grandes */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    width: 95%;
  }
`;


export const DaysWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Exibe os dias em 2 por linha */
  gap: 10px;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Em telas menores, coloca um dia por linha */
  }
`;

export const Day = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer; /* Adiciona a mãozinha ao passar o mouse */

  &:hover {
    background-color: #e0e0e0; /* Torna a cor mais clara ao passar o mouse */
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h3`
  margin-bottom: 20px;
`;

export const Input = styled.input`
  margin-bottom: 12px;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Select = styled.select`
  margin-bottom: 12px;
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

export const DivInputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;
