import { AlertTriangle, MapPin, MonitorPlay, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { OPCOES_GENERO, getRotuloProfissao } from '../../../utils/titulo';
import { ESPECIALIDADES_MEDICAS } from '../../Registrar/utils/constantes';
import { excluirConta, excluirPerfilProfissional, updateInformacoes } from '../api';

const StickyFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 260px;
  right: 0;
  background: white;
  border-top: 1px solid #F0EFE9;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  z-index: 50;
  font-family: Figtree, sans-serif;
  @media (max-width: 768px) {
    left: 0;
    padding: 12px 16px;
    & > button { flex: 1; }
  }
`;

const TwoColGrid = styled.div`
  flex: 1;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
  align-items: flex-start;
  padding-bottom: 90px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 16px 90px;
  }
`;

const CARD = { background: 'white', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' };
const inputS = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #E0DFD9',
  borderRadius: '8px', fontSize: '14px', fontFamily: 'Figtree, sans-serif',
  outline: 'none', color: '#1a1a1a', background: 'white', boxSizing: 'border-box',
};
const labelS = { fontSize: '13px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '6px' };

const PUBLICOS = ['Crianças', 'Adolescentes', 'Adultos', 'Idosos', 'Gestantes'];

const parsePublico = (raw) => {
  if (!raw) return [];
  const txt = raw.toLowerCase();
  if (txt.includes('todos')) return [...PUBLICOS];
  return PUBLICOS.filter(p => txt.includes(p.toLowerCase()));
};

const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0,
    background: checked ? '#1B4D3E' : '#D1D5DB', cursor: 'pointer',
    position: 'relative', transition: 'background 0.2s',
  }}>
    <div style={{
      position: 'absolute', top: '3px',
      left: checked ? '23px' : '3px',
      width: '18px', height: '18px', borderRadius: '50%',
      background: 'white', transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
    }} />
  </div>
);

const MOD_ICONS = {
  presencial: Users,
  online: MonitorPlay,
  domiciliar: MapPin,
};

const ModalIcon = ({ type, active }) => {
  const Icon = MOD_ICONS[type] || Users;
  return (
    <div style={{
      width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
      background: active ? '#1B4D3E' : '#E8E8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? 'white' : '#888',
    }}>
      <Icon size={17} />
    </div>
  );
};

const EditarInformacoes = ({
  editTipoProfissional,
  editNumeroConselho,
  editDescricao, setEditDescricao,
  editPublicoAtendido, setEditPublicoAtendido,
  editModalidade, setEditModalidade,
  editValorConsulta, setEditValorConsulta,
  editValorPresencial, editValorOnline, editValorDomiciliar,
  diasSemana, editDiasAtendimento, editHorariosAtendimento,
  handleEditDiaChange, handleEditHorarioChange, handleEditRemoveHorario, handleEditAddHorario,
  handleEditarInformacoes,
  user,
}) => {
  const { success, error: showError } = useNotification();
  const { logout, updateUser: updateAuthUser, setViewMode } = useAuth();
  const navigate = useNavigate();

  // Exclusão de conta: 'escolher' pede pra decidir entre remover só o lado
  // profissional ou a conta inteira; 'confirmar' pede a confirmação final.
  const [excluirEtapa, setExcluirEtapa] = useState(null);
  const [excluirOpcao, setExcluirOpcao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const tipoProfissionalAtual = editTipoProfissional || user?.tipoProfissional || '';
  const isMedico = ESPECIALIDADES_MEDICAS.includes(tipoProfissionalAtual);

  // ── Local state ───────────────────────────────────────────
  const [nomeCompleto, setNomeCompleto] = useState(`${user?.nome || ''} ${user?.sobrenome || ''}`.trim());
  const [especialidade, setEspecialidade] = useState(tipoProfissionalAtual);
  const [registro, setRegistro] = useState(user?.registroProfissional || '');
  const [genero, setGenero] = useState(user?.genero || '');
  const [sobre, setSobre] = useState(editDescricao || '');
  const [aceitarEmergentes, setAceitarEmergentes] = useState(true);
  
  const [publicoSel, setPublicoSel] = useState(() => parsePublico(editPublicoAtendido));

  const [modalidades, setModalidades] = useState(() => {
    const mods = String(editModalidade || '').split(',').map(s => s.trim());
    return {
      presencial: { active: mods.includes('presencial'), valor: editValorPresencial || '', duracao: '30' },
      online:     { active: mods.includes('online'),     valor: editValorOnline || '',     duracao: '30' },
      domiciliar: { active: mods.includes('domiciliar'), valor: editValorDomiciliar || '', duracao: '60' },
    };
  });

  // Formações (local only)
  const [formacoes, setFormacoes] = useState([
    { id: 1, titulo: '', instituicao: '', periodo: '', editing: false },
  ]);

  useEffect(() => { if (editTipoProfissional) setEspecialidade(editTipoProfissional); }, [editTipoProfissional]);
  useEffect(() => { setSobre(editDescricao || ''); }, [editDescricao]);

  const togglePublico = (p) =>
    setPublicoSel(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const toggleMod = (key) =>
    setModalidades(prev => ({ ...prev, [key]: { ...prev[key], active: !prev[key].active } }));

  const setModValor = (key, val) =>
    setModalidades(prev => ({ ...prev, [key]: { ...prev[key], valor: val } }));

  const handleSalvar = async () => {
    const activeMods = Object.entries(modalidades).filter(([, v]) => v.active).map(([k]) => k);
    const modalStr = activeMods.join(',');
    const valorPresencial = modalidades.presencial.active ? modalidades.presencial.valor : '';
    const valorOnline = modalidades.online.active ? modalidades.online.valor : '';
    const valorDomiciliar = modalidades.domiciliar.active ? modalidades.domiciliar.valor : '';
    const valorStr = valorPresencial || valorOnline || valorDomiciliar || editValorConsulta || '';

    setEditDescricao(sobre);
    setEditPublicoAtendido(publicoSel.join(','));
    setEditModalidade(modalStr);
    setEditValorConsulta(valorStr);

    try {
      await updateInformacoes(user?.id, {
        ...(isMedico ? { tipoProfissional: especialidade } : {}),
        genero: genero || null,
        descricao: sobre,
        publicoAtendido: publicoSel.join(','),
        modalidade: modalStr,
        valorConsulta: valorStr,
        valorPresencial, valorOnline, valorDomiciliar,
        diasAtendimento: editDiasAtendimento,
        horariosAtendimento: editHorariosAtendimento,
      });
      success('Informações salvas com sucesso!');
    } catch (e) { showError(e?.response?.data?.error || 'Erro ao salvar informações.'); }
  };

  const handleDescartar = () => {
    setSobre(editDescricao || '');
    setNomeCompleto(`${user?.nome || ''} ${user?.sobrenome || ''}`.trim());
    setEspecialidade(user?.tipoProfissional || '');
    setRegistro(user?.registroProfissional || '');
    setGenero(user?.genero || '');
    setPublicoSel(editPublicoAtendido ? editPublicoAtendido.split(',').map(s => s.trim()).filter(Boolean) : []);
  };

  const iniciarExclusao = () => { setExcluirEtapa('escolher'); setExcluirOpcao(null); };
  const cancelarExclusao = () => { setExcluirEtapa(null); setExcluirOpcao(null); };
  const escolherOpcaoExclusao = (opcao) => { setExcluirOpcao(opcao); setExcluirEtapa('confirmar'); };

  const confirmarExclusao = async () => {
    if (!user?.id) { showError('Erro ao identificar usuário.'); return; }
    setExcluindo(true);
    try {
      if (excluirOpcao === 'profissional') {
        await excluirPerfilProfissional(user.id);
        updateAuthUser({ tipoUsuario: 'paciente', tipoProfissional: null });
        setViewMode('paciente');
        success('Perfil profissional removido. Sua conta agora é uma conta de paciente.');
        navigate('/Conta');
      } else {
        await excluirConta(user.id);
        logout();
        navigate('/');
      }
    } catch (e) {
      showError(e?.response?.data?.error || 'Erro ao excluir conta.');
      setExcluindo(false);
    }
  };

  const addFormacao = () => setFormacoes(prev => [...prev, { id: Date.now(), titulo: '', instituicao: '', periodo: '', editing: true }]);
  const removeFormacao = (id) => setFormacoes(prev => prev.filter(f => f.id !== id));
  const updateFormacao = (id, field, val) => setFormacoes(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  const toggleEditFormacao = (id) => setFormacoes(prev => prev.map(f => f.id === id ? { ...f, editing: !f.editing } : f));

  const initials = nomeCompleto.trim().split(' ').filter(Boolean).reduce((acc, w, i, arr) => i === 0 || i === arr.length - 1 ? acc + w[0].toUpperCase() : acc, '');
  const MOD_LABELS = { presencial: 'Presencial', online: 'Online', domiciliar: 'Visita domiciliar' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Figtree, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>Informações do perfil</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: '6px 0 24px', maxWidth: '480px' }}>
          Atualize seus dados públicos, modalidades e valores. O que estiver aqui é o que pacientes veem.
        </p>
      </div>

      {/* Two-column body */}
      <TwoColGrid>
        {/* ── Left: Perfil público ── */}
        <div style={CARD}>
          <div style={{ padding: '22px 26px 0', borderBottom: '1px solid #F0EFE9', paddingBottom: '18px' }}>
            <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1a1a1a' }}>Perfil público</h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#888' }}>Como você aparece no perfil para pacientes.</p>
          </div>
          <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FCDBB5', color: '#7A4100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>
                {initials || '?'}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#1a1a1a' }}>{nomeCompleto || 'Profissional'}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>{especialidade || 'Especialidade'}</p>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label style={labelS}>Nome completo</label>
              <input type="text" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} style={inputS} placeholder="Seu nome" />
            </div>

            {/* Especialidade + Registro */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelS}>Especialidade</label>
                {isMedico ? (
                  <select value={especialidade} onChange={e => setEspecialidade(e.target.value)} style={{ ...inputS, cursor: 'pointer' }}>
                    <option value="">Selecione...</option>
                    {ESPECIALIDADES_MEDICAS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: '10px 14px', background: '#F7F7F4', border: '1.5px solid #E0DFD9', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a' }}>
                    {getRotuloProfissao(tipoProfissionalAtual, genero) || 'Não informado'}
                  </div>
                )}
              </div>
              <div>
                <label style={labelS}>Número do conselho</label>
                {editNumeroConselho ? (
                  <div style={{ padding: '10px 14px', background: '#F7F7F4', border: '1.5px solid #E0DFD9', borderRadius: '8px', fontSize: '14px', color: '#1a1a1a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#1B4D3E', fontSize: '13px' }}>✓</span>
                    {editNumeroConselho}
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#aaa', fontWeight: '400' }}>cadastrado no registro</span>
                  </div>
                ) : (
                  <div style={{ padding: '10px 14px', background: '#F7F7F4', border: '1.5px solid #E0DFD9', borderRadius: '8px', fontSize: '13px', color: '#aaa' }}>
                    Não informado no cadastro
                  </div>
                )}
              </div>
            </div>

            {/* Gênero */}
            <div>
              <label style={labelS}>Gênero</label>
              <select value={genero} onChange={e => setGenero(e.target.value)} style={{ ...inputS, cursor: 'pointer' }}>
                <option value="">Selecione...</option>
                {OPCOES_GENERO.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Sobre você */}
            <div>
              <label style={labelS}>Sobre você</label>
              <textarea
                value={sobre}
                onChange={e => setSobre(e.target.value)}
                placeholder="Descreva sua experiência e abordagem..."
                rows={4}
                style={{ ...inputS, resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            {/* Público atendido */}
            <div>
              <label style={labelS}>Público atendido</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PUBLICOS.map(p => {
                  const active = publicoSel.includes(p);
                  return (
                    <button key={p} onClick={() => togglePublico(p)} style={{
                      padding: '9px 18px', borderRadius: '20px', border: '1.5px solid',
                      borderColor: active ? '#1B4D3E' : '#E0DFD9',
                      background: active ? '#1B4D3E' : 'white',
                      color: active ? 'white' : '#555',
                      fontSize: '14px', fontWeight: active ? '600' : '400',
                      cursor: 'pointer', fontFamily: 'Figtree, sans-serif',
                      transition: 'all 0.15s',
                    }}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Modalidades & valores */}
          <div style={CARD}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F0EFE9' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Modalidades & valores</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#888' }}>Configure presencial, online e preços.</p>
            </div>
            <div style={{ padding: '10px 0' }}>
              {Object.entries(modalidades).map(([key, mod]) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', borderBottom: '1px solid #F7F7F4',
                  opacity: mod.active ? 1 : 0.55,
                }}>
                  <ModalIcon type={key} active={mod.active} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>{MOD_LABELS[key]}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                      {mod.valor === 'A negociar' ? (
                        <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>A negociar</span>
                      ) : (
                        <>
                          <span style={{ fontSize: '12px', color: '#888' }}>R$</span>
                          <input
                            type="number" min="0"
                            value={mod.valor}
                            onChange={e => setModValor(key, e.target.value)}
                            placeholder="—"
                            style={{ width: '64px', padding: '3px 6px', border: '1px solid #E0DFD9', borderRadius: '5px', fontSize: '12px', fontFamily: 'Figtree, sans-serif', background: 'white' }}
                          />
                        </>
                      )}
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#888', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={mod.valor === 'A negociar'}
                          onChange={e => setModValor(key, e.target.checked ? 'A negociar' : '')}
                          style={{ cursor: 'pointer' }}
                        />
                        negociar
                      </label>
                      <span style={{ fontSize: '12px', color: '#888' }}>· {mod.duracao}min</span>
                    </div>
                  </div>
                  <Toggle checked={mod.active} onChange={() => toggleMod(key)} />
                </div>
              ))}

              {/* Aceitar emergentes */}
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 20px', margin: '6px 10px 0',
                background: aceitarEmergentes ? '#FFFBEB' : '#F7F7F4',
                borderRadius: '10px', border: `1.5px solid ${aceitarEmergentes ? '#FDE68A' : '#E0DFD9'}`,
                cursor: 'pointer',
              }}>
                <input type="checkbox" checked={aceitarEmergentes} onChange={e => setAceitarEmergentes(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#E8611A', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: aceitarEmergentes ? '#E8611A' : '#555' }}>
                    Aceitar consultas urgentes
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>
                    Receba notificação para casos urgentes (até 1h de janela)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Formação & certificações */}
          <div style={CARD}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F0EFE9' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Formação & certificações</h2>
            </div>
            <div style={{ padding: '8px 0' }}>
              {formacoes.map(f => (
                <div key={f.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F7F7F4' }}>
                  {f.editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="text" placeholder="Ex: Medicina, Residência..." value={f.titulo} onChange={e => updateFormacao(f.id, 'titulo', e.target.value)} style={{ ...inputS, padding: '7px 10px', fontSize: '13px' }} />
                      <input type="text" placeholder="Instituição" value={f.instituicao} onChange={e => updateFormacao(f.id, 'instituicao', e.target.value)} style={{ ...inputS, padding: '7px 10px', fontSize: '13px' }} />
                      <input type="text" placeholder="Período (ex: 2008-2014)" value={f.periodo} onChange={e => updateFormacao(f.id, 'periodo', e.target.value)} style={{ ...inputS, padding: '7px 10px', fontSize: '13px' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => toggleEditFormacao(f.id)} style={{ padding: '6px 14px', background: '#1B4D3E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}>Salvar</button>
                        <button onClick={() => removeFormacao(f.id)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #FECACA', color: '#EF4444', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}>Remover</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#E8F5EF', color: '#1B4D3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>○</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>{f.titulo || 'Sem título'}</p>
                        {f.instituicao && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>{f.instituicao}</p>}
                        {f.periodo && <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#aaa' }}>{f.periodo}</p>}
                      </div>
                      <button onClick={() => toggleEditFormacao(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '14px', padding: '2px 4px', flexShrink: 0 }}>✏</button>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addFormacao} style={{ width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#1B4D3E', cursor: 'pointer', fontFamily: 'Figtree, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                + Adicionar formação
              </button>
            </div>
          </div>

          {/* Zona de risco */}
          <div style={{ ...CARD, border: '1.5px solid #FECACA' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F0EFE9' }}>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#991B1B' }}>Excluir conta</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#888' }}>Essa ação é permanente e não pode ser desfeita.</p>
            </div>
            <div style={{ padding: '18px 20px' }}>
              {excluirEtapa === null && (
                <button
                  onClick={iniciarExclusao}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'none', border: '1.5px solid #FECACA', color: '#C53030', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}
                >
                  <Trash2 size={14} /> Excluir conta
                </button>
              )}

              {excluirEtapa === 'escolher' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>O que você quer excluir?</p>
                  <button
                    onClick={() => escolherOpcaoExclusao('profissional')}
                    style={{ textAlign: 'left', padding: '12px 14px', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}
                  >
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#9A3412' }}>Excluir apenas o perfil profissional</p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9A3412' }}>Sua agenda e dados de profissional somem, mas você continua com sua conta como paciente.</p>
                  </button>
                  <button
                    onClick={() => escolherOpcaoExclusao('completa')}
                    style={{ textAlign: 'left', padding: '12px 14px', background: '#FFF5F5', border: '1.5px solid #F5C6C6', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}
                  >
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#991B1B' }}>Excluir a conta inteira</p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#991B1B' }}>Apaga tudo: login, consultas, formulários e anexos, como paciente e como profissional.</p>
                  </button>
                  <button
                    onClick={cancelarExclusao}
                    style={{ alignSelf: 'flex-start', padding: '6px 4px', background: 'none', border: 'none', color: '#888', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {excluirEtapa === 'confirmar' && (
                <div style={{ background: '#FFF5F5', border: '1.5px solid #F5C6C6', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#C53030" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#8B2C2C', lineHeight: '1.5' }}>
                      {excluirOpcao === 'profissional'
                        ? 'Tem certeza? Sua agenda, candidatos a vagas e dados profissionais serão apagados permanentemente. Sua conta continua existindo como paciente.'
                        : 'Tem certeza? Todos os seus dados (consultas, formulários, notificações e anexos) serão apagados permanentemente. Essa ação não pode ser desfeita.'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button
                        onClick={confirmarExclusao}
                        disabled={excluindo}
                        style={{ padding: '7px 14px', background: '#C53030', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: excluindo ? 'default' : 'pointer', fontFamily: 'Figtree, sans-serif', opacity: excluindo ? 0.6 : 1 }}
                      >
                        {excluindo ? 'Excluindo...' : excluirOpcao === 'profissional' ? 'Sim, excluir perfil profissional' : 'Sim, excluir minha conta'}
                      </button>
                      <button
                        onClick={cancelarExclusao}
                        disabled={excluindo}
                        style={{ padding: '7px 14px', background: 'none', border: '1.5px solid #E0DFD9', color: '#555', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </TwoColGrid>

      {/* ── Sticky footer ── */}
      <StickyFooter>
        <button onClick={handleDescartar} style={{ padding: '10px 22px', background: 'none', border: '1.5px solid #E0DFD9', borderRadius: '8px', fontSize: '14px', color: '#555', cursor: 'pointer', fontFamily: 'Figtree, sans-serif', fontWeight: '500' }}>
          Descartar mudanças
        </button>
        <button onClick={handleSalvar} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 26px', background: '#1B4D3E', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'Figtree, sans-serif' }}>
          ✓ Salvar tudo
        </button>
      </StickyFooter>
    </div>
  );
};

export default EditarInformacoes;
