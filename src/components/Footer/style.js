import styled from 'styled-components';

// Container do footer
export const FooterContainer = styled.footer`
  background-color: rgb(227, 228, 222);
  padding: 60px 20px 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

// Seção da esquerda
export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 45%;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
  }
`;

export const InstagramLink = styled.a`
  text-decoration: none;
  color: #e959a8;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #C13584;
  }

  @media (max-width: 768px) {
    p {
      text-align: left;
      padding-left: 20px;
    } // centraliza horizontalmente o conteúdo
  }
`;

// Seção da direita
export const RightSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 45%;
  gap: 50px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 30px;
  }
`;

export const LocationInfo = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    text-align: left;
    font-size: 1.4rem;
  }

  p {
    text-align: left;
    font-size: 1.0rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;

    h2 {
      text-align: left;
      padding-left: 20px;
    }

    p {
      text-align: left;
      padding-left: 20px;
    }
  }
`;

export const ContactInfo = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    text-align: left;
    font-size: 1.4rem;
  }

  p {
    text-align: left;
    font-size: 1.0rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;

    h2 {
      text-align: left;
      padding-left: 20px;
    }

    p {
      text-align: left;
      padding-left: 20px;
    }
  }
`;

export const Desenvolvido = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    text-align: left;
    font-size: 1.4rem;
  }

  p {
    text-align: left;
    font-size: 1.0rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;

    h2 {
      text-align: left;
      padding-left: 20px;
    }

    p {
      text-align: left;
      padding-left: 20px;
    }
}

  }
`;

export const PrimaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin-bottom: 20px;
  margin-left: 80px;

  h2 {
    font-size: 2rem;
    font-family: 'Sansita', sans-serif;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 1.0rem;
    font-family: 'Merriweather', serif;
    color: black;
    margin-top: 35px;
    margin-bottom: 10px;
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    align-items: center;
    text-align: center;

    h2 {
      font-size: 2.0rem; /* diminuído para celular */
    }

    p {
      font-size: 1rem;
    }
  }
`;

export const LogoImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: 130px;
  border-radius: 12px;

  @media (max-width: 768px) {
    max-width: 200px; /* aumentado no celular */
  }
`;

export const MediaQueryFooter = styled.div`
  @media (max-width: 480px) {
    ${FooterContainer} {
      padding: 30px 10px;
    }

    ${PrimaryInfo} {
      width: 100%;
      margin-left: 0;
      margin-bottom: 20px;
    }

    ${LocationInfo}, ${ContactInfo}, ${Desenvolvido} {
      width: 100%;
      text-align: center;

      h2, p {
        text-align: center;
        font-size: 0.9rem;
      }
    }
  }
`;
