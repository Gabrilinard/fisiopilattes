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
  font-family: 'Sansita', sans-serif;

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
  font-family: 'Sansita', sans-serif;
  margin-top: 20px; // Ajuste de espaçamento

  @media (max-width: 768px) {
    font-size: 2.6rem;
  }
`;

// Footer (Rodapé)
export const Footer = styled.footer`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px 0;
  font-family: 'Nunito Sans', sans-serif;
  margin-top: 40px;  // Ajuste do espaçamento para o footer

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

