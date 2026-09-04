export const OPCOES_GENERO = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'nao_binario', label: 'Não binário' },
  { value: 'outro', label: 'Outro' },
  { value: 'prefiro_nao_informar', label: 'Prefiro não informar' },
];

export const getTratamento = (genero) => {
  if (genero === 'masculino') return 'Dr.';
  if (genero === 'feminino') return 'Dra.';
  return '';
};

export const getNomeComTitulo = (genero, nome) => {
  const tratamento = getTratamento(genero);
  return tratamento ? `${tratamento} ${nome}` : nome;
};

const ROTULOS_PROFISSAO = {
  dentista:       { masculino: 'Dentista',       feminino: 'Dentista' },
  nutricionista:  { masculino: 'Nutricionista',  feminino: 'Nutricionista' },
  fisioterapeuta: { masculino: 'Fisioterapeuta', feminino: 'Fisioterapeuta' },
  fonoaudiologo:  { masculino: 'Fonoaudiólogo',  feminino: 'Fonoaudióloga' },
  psicologo:      { masculino: 'Psicólogo',      feminino: 'Psicóloga' },
};

// tipoProfissional guarda o slug da categoria (ex: "psicologo") ou, para médicos,
// a especialidade já escrita por extenso (ex: "Cardiologista") — nesse caso não há
// rótulo para mapear e o valor original é exibido.
export const getRotuloProfissao = (tipoProfissional, genero) => {
  if (!tipoProfissional) return '';
  const opcoes = ROTULOS_PROFISSAO[String(tipoProfissional).toLowerCase().trim()];
  if (!opcoes) return tipoProfissional;
  return genero === 'feminino' ? opcoes.feminino : opcoes.masculino;
};
