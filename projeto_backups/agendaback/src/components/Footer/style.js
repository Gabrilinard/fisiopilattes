import styled from 'styled-components';

// Container do footer
export const FooterContainer = styled.footer`
  background-color: rgb(227, 228, 222);
  padding: 60px 0 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 20px;
  padding-right: 20px;
  flex-wrap: wrap;
`;

// Seção da esquerda
export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 45%;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
`;

export const PrimaryInfo = styled.div`
  width: 50%;
  margin-bottom: 20px;
  margin-left: 80px;

  h1 {
    font-size: 2.5rem;
    font-family: 'Sansita', sans-serif;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 1.1rem;
    font-family: 'Merriweather', serif;
    color: black;
    margin-top: 35px;
    margin-bottom: 10px;
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1rem;
    }
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
    gap: 30px;
  }
`;

export const LocationInfo = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    font-family: 'Sansita', sans-serif;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 1.1rem;
    font-family: 'Merriweather', serif;
    color: black;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
  }
`;

export const ContactInfo = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    font-family: 'Sansita', sans-serif;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 1.1rem;
    font-family: 'Merriweather', serif;
    color: black;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export const Desenvolvido = styled.div`
  width: 50%;
  margin-bottom: 20px;

  h2 {
    font-size: 1.0rem;
    font-family: 'Sansita', sans-serif;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
    text-align: left;
  }

  p {
    font-size: 1.1rem;
    font-family: 'Merriweather', serif;
    color: black;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: left;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

// Responsividade para telas menores
export const MediaQueryFooter = styled.div`
  @media (max-width: 768px) {
    ${FooterContainer} {
      flex-direction: column;
      align-items: center;
    }

    ${RightSection} {
      width: 100%;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    ${LeftSection} {
      text-align: center;
      margin-bottom: 30px;
    }
  }

  @media (max-width: 480px) {
    ${FooterContainer} {
      padding: 30px 10px;
    }

    ${PrimaryInfo} {
      width: 100%;
      margin-left: 0;
      margin-bottom: 20px;
    }

    ${LocationInfo}, ${ContactInfo} {
      width: 100%;
    }

    ${LocationInfo} p, ${ContactInfo} p {
      font-size: 0.9rem;
    }
  }
`;