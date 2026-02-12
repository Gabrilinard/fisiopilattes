import {
    InfoDescription,
    InfoLabel,
    InfoProfissionalContainer,
    InfoSection,
    InfoTitle,
    InfoValue,
    ModalidadeTag,
} from '../../style';

const ProfessionalInfo = ({ profissionalInfo }) => {
  if (!profissionalInfo) return null;

  return (
    <InfoSection>
      <InfoProfissionalContainer>
        <InfoTitle>
          {profissionalInfo.nome} {profissionalInfo.sobrenome}
        </InfoTitle>
        {profissionalInfo.descricao && (
          <InfoDescription>{profissionalInfo.descricao}</InfoDescription>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {profissionalInfo.publicoAtendido && (
            <div>
              <InfoLabel>Público Atendido</InfoLabel>
              <InfoValue>
                {Array.isArray(profissionalInfo.publicoAtendido)
                  ? profissionalInfo.publicoAtendido.join(', ')
                  : profissionalInfo.publicoAtendido}
              </InfoValue>
            </div>
          )}

          {profissionalInfo.modalidade && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <InfoLabel>Modalidade</InfoLabel>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(Array.isArray(profissionalInfo.modalidade)
                  ? profissionalInfo.modalidade
                  : [profissionalInfo.modalidade]
                ).map((mod, index) => (
                  <ModalidadeTag key={index}>{mod}</ModalidadeTag>
                ))}
              </div>
            </div>
          )}

          {profissionalInfo.valorConsulta && (
            <div>
              <InfoLabel>Valor da Consulta</InfoLabel>
              <InfoValue>R$ {profissionalInfo.valorConsulta}</InfoValue>
            </div>
          )}
        </div>
      </InfoProfissionalContainer>
    </InfoSection>
  );
};

export default ProfessionalInfo;
