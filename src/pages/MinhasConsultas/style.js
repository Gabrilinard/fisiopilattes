import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: rgb(227, 228, 222);
`;

export const ConsultasContainer = styled.div`
  flex: 1;
  padding: 40px 20px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Figtree', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ConsultaCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ConsultaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

export const StatusBadge = styled.span`
  background-color: ${props => props.color || '#6c757d'};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  font-family: 'Figtree', sans-serif;
`;

export const ConsultaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const ConsultaInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ConsultaLabel = styled.span`
  font-weight: bold;
  color: #666;
  font-size: 0.95rem;
  font-family: 'Figtree', sans-serif;
  min-width: fit-content;
`;

export const ConsultaValue = styled.span`
  color: #333;
  font-size: 1rem;
  font-family: 'Figtree', sans-serif;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.2rem;
  font-family: 'Figtree', sans-serif;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

export const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Figtree', sans-serif;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const CancelButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Figtree', sans-serif;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c82333;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ccc;
`;

export const DrawerTitle = styled.h2`
  margin: 0;
  color: #333;
  font-family: 'Figtree', sans-serif;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FormLabel = styled.label`
  font-weight: bold;
  color: #666;
  font-size: 0.95rem;
  font-family: 'Figtree', sans-serif;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Figtree', sans-serif;
  box-sizing: border-box;
`;

export const DatePickerWrapper = styled.div`
  width: 100%;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: 'Figtree', sans-serif;
    box-sizing: border-box;
  }
`;

