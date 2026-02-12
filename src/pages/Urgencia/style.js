import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  color: #d32f2f; /* Vermelho para urgência */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UrgenciaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const UrgenciaCard = styled.div`
  background-color: white;
  border-left: 5px solid #d32f2f;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoGroup = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const InfoLabel = styled.span`
  display: block;
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

export const InfoValue = styled.span`
  display: block;
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 12px;
`;

export const DescriptionBox = styled.div`
  background-color: #fff3e0;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  border: 1px solid #ffe0b2;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

export const AcceptButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
  background-color: #2e7d32;
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export const DenyButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
  background-color: #c62828;
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export const EditButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
  background-color: #1976d2;
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export const AttachmentLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #1976d2;
  text-decoration: none;
  margin-top: 5px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;
