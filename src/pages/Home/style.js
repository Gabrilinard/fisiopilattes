import styled from 'styled-components';

// Container principal
export const Container = styled.div`
  background-color: rgb(227, 228, 222);
  display: flex;
  flex-direction: column;
  min-height: 100vh;  // Garante que o container ocupe a altura total da tela
  padding: 0 20px;
  justify-content: space-between;  // Espaça os elementos, garantindo que o footer fique na parte inferior

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

export const RedirectMessage = styled.div`
    position: fixed;  // Fixa a mensagem na tela
    top: 50%;  // Coloca a mensagem no meio da tela verticalmente
    left: 50%;  // Coloca a mensagem no meio da tela horizontalmente
    transform: translate(-50%, -50%);  // Ajusta para garantir que a mensagem esteja completamente centralizada
    background-color: #d3d3d3;  // Cor de fundo amarela
    color: black;  // Cor do texto mais escura para contraste
    padding: 45px 80px;  // Espaçamento interno maior para tornar a mensagem mais destacada
    text-align: center;  // Alinha o texto no centro
    font-size: 18px;  // Tamanho de fonte maior para maior legibilidade
    font-weight: bold;  // Deixa o texto em negrito
    border-radius: 8px;  // Bordas arredondadas para suavizar a aparência
    margin-bottom: 20px;  // Espaço abaixo da mensagem
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  // Sombra suave para destacar a mensagem
    animation: fadeIn 1s ease-in-out;  // Animação de transição para a mensagem aparecer suavemente

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;


export const Container_texto = styled.div`
  background-color: rgb(227, 228, 222);
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  justify-content: center;
  align-items: center; 

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

export const AgendarButton = styled.button`
  background-color: green;
  color: white;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin: 20px auto;
  display: block;
  
  &:hover {
    background-color: darkgreen;
  }
`;

export const MessageContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 9999;
`;

// Título da seção de produtos
export const SectionTitle = styled.h2`
  text-align: center;
  margin-top: 30px;
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
  font-family: 'Figtree', sans-serif;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }
`;

export const WelcomeText = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: black;
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 80%;
  margin-top: 20px; // Espaçamento ajustado
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
    width: 380px;
    margin-top: 15px;
  }
`;

// Texto sobreposto à imagem
export const OverlayText = styled.div`
  color: black;
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  font-family: 'Figtree', sans-serif;
  margin: 0;
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }
`;

export const WelcomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const WelcomeLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

export const Footer = styled.footer`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px 0;
  font-family: 'Figtree', sans-serif;
  margin-top: 40px;  // Ajuste do espaçamento para o footer

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const EmpresasSection = styled.section`
  padding: 20px 20px 40px 20px;
  background-color: rgb(227, 228, 222);
  margin-top: 0px;

  @media (max-width: 768px) {
    padding: 15px 10px 30px 10px;
  }
`;

export const EmpresasTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
  font-family: 'Figtree', sans-serif;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }
`;

export const EmpresasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const EmpresaCard = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const EmpresaNome = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  font-family: 'Figtree', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const EmpresaInfo = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const VerMaisButton = styled.button`
  display: block;
  margin: 30px auto;
  padding: 12px 30px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 0.9rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  position: sticky;
  top: 80px;
  background-color: rgb(227, 228, 222);
  padding: 15px 0;
  z-index: 100;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    top: 70px;
    padding: 10px 0;
    margin-bottom: 15px;
  }
`;

export const TabButton = styled.button`
  padding: 12px 30px;
  background-color: ${props => props.active ? '#4caf50' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 2px solid ${props => props.active ? '#4caf50' : '#ccc'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#f0f0f0'};
    border-color: ${props => props.active ? '#45a049' : '#999'};
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

export const InscreverButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 20px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4caf50;
  }

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
`;

