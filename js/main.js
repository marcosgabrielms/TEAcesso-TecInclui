import { direitos } from './data/direitos.js';
import { servicos } from './data/servicos.js';
import { cartilha } from './data/cartilhas.js';
import { contatoConfirmado, carregarPdf, linkCompartilhamento } from './disponibilidade.js';

// Todo conteúdo dos cards vem de arquivos locais. Escape também protege futuras edições.
const escapeHtml = (valor) => String(valor).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const externo = (url, titulo) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(titulo)} (nova aba)</a>`;

document.querySelector('#direitos-lista').innerHTML = direitos.map((direito) => `
  <article class="guide-card">
    <header><span class="badge">Procedimentos a validar</span><h2>${escapeHtml(direito.titulo)}</h2><p>${escapeHtml(direito.resumo)}</p></header>
    <div class="guide-body"><h3>Roteiro para buscar orientação</h3><ol class="guide-steps">${direito.passos.map(([titulo, descricao]) => `<li><div><h3>${escapeHtml(titulo)}</h3><p>${escapeHtml(descricao)}</p></div></li>`).join('')}</ol>
    <div class="guide-meta"><div class="info-box"><h3>Documentos</h3><p>${escapeHtml(direito.documentos)}</p></div><div class="info-box"><h3>Onde se informar</h3><p>${escapeHtml(direito.onde)}</p></div></div>
    <p class="source">${direito.fonte ? `${externo(direito.fonte.url, direito.fonte.titulo)}. Referência geral consultada em 26/10/2026; não confirma o fluxo local.` : 'Sem fonte oficial validada para este procedimento local.'}</p></div>
  </article>`).join('');

document.querySelector('#servicos-lista').innerHTML = servicos.map((servico) => `
  <article class="service-card"><span class="eyebrow purple">${escapeHtml(servico.tipo)}</span><h2>${escapeHtml(servico.nome)}</h2><span class="badge">Informações não verificadas</span><p>${escapeHtml(servico.observacao)}</p>
  <dl><dt>Endereço e horário</dt><dd>Não confirmados. Aguardando validação.</dd><dt>Agendamento e documentos</dt><dd>Fluxo de atendimento não confirmado.</dd></dl></article>`).join('');

function canalMarkup(canal, tipo) {
  if (!contatoConfirmado(canal)) return `<p class="small">${tipo === 'telefone' ? 'Telefone' : 'WhatsApp'}: aguardando confirmação.</p>`;
  const href = tipo === 'telefone' ? `tel:+${canal.valor}` : `https://wa.me/${canal.valor}`;
  const texto = tipo === 'telefone' ? `Ligar: +${canal.valor}` : 'Abrir WhatsApp (nova aba)';
  return `<div><a class="button secondary" href="${href}" ${tipo === 'whatsapp' ? 'target="_blank" rel="noopener noreferrer"' : ''}>${texto}</a><p class="source">Confirmado em ${escapeHtml(canal.verificadoEm)} · ${externo(canal.fonte, 'Fonte do contato')}</p></div>`;
}

const confirmados = servicos.filter((s) => contatoConfirmado(s.telefone) || contatoConfirmado(s.whatsapp)).length;
document.querySelector('#contatos-resumo').textContent = confirmados
  ? `${confirmados} instituição(ões) com pelo menos um canal confirmado. Confira a fonte e a data de cada contato.`
  : 'Ainda não há contatos confirmados neste MVP. Telefones e números de WhatsApp da base original foram omitidos para evitar ligações ou mensagens para canais incorretos.';
document.querySelector('#contatos-lista').innerHTML = servicos.map((servico) => `
  <article class="contact-card"><span class="eyebrow purple">${escapeHtml(servico.tipo)}</span><h2>${escapeHtml(servico.nome)}</h2><p>Disponibilidade dos canais de atendimento:</p><div class="contact-actions">${canalMarkup(servico.telefone, 'telefone')}${canalMarkup(servico.whatsapp, 'whatsapp')}</div></article>`).join('');

const menu = document.querySelector('#menu-principal');
const menuButton = document.querySelector('.menu-toggle');
function fecharMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.hidden = false;
document.documentElement.classList.add('js');
menuButton.addEventListener('click', () => {
  const aberto = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('is-open', aberto);
  menuButton.setAttribute('aria-expanded', String(aberto));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    fecharMenu();
    menuButton.focus();
  }
});
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    fecharMenu();
    // Também restaura o foco quando o link aponta à página já aberta.
    document.querySelector('[data-page]:not([hidden]) h1').focus();
  }
});
window.matchMedia('(min-width: 961px)').addEventListener('change', () => {
  const focoNoMenu = menu.contains(document.activeElement);
  fecharMenu();
  if (focoNoMenu && window.innerWidth < 961) menuButton.focus();
});

const titulos = { inicio: 'Início', 'primeiros-passos': 'Primeiros passos', direitos: 'Direitos', servicos: 'Serviços', contatos: 'Contatos', cartilhas: 'Cartilhas', 'nao-encontrada': 'Página não encontrada' };
function navegar(moverFoco = true) {
  if (location.hash === '#conteudo') {
    document.querySelector('#conteudo').focus();
    return;
  }
  const caminho = location.hash.slice(1) || 'inicio';
  const partes = caminho.split('/');
  let pagina = partes[0];
  const etapa = partes[1] || 'terapias';
  if (!Object.hasOwn(titulos, pagina) || (pagina === 'primeiros-passos' ? partes.length > 2 || !['terapias', 'escola', 'direitos'].includes(etapa) : partes.length > 1)) pagina = 'nao-encontrada';
  document.querySelectorAll('[data-page]').forEach((element) => { element.hidden = element.dataset.page !== pagina; });
  document.querySelectorAll('[data-step]').forEach((element) => { element.hidden = element.dataset.step !== etapa; });
  document.querySelectorAll('[data-step-link]').forEach((element) => {
    if (element.dataset.stepLink === etapa) element.setAttribute('aria-current', 'step');
    else element.removeAttribute('aria-current');
  });
  menu.querySelectorAll('a').forEach((link) => {
    if (link.hash.slice(1).split('/')[0] === pagina) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${titulos[pagina]}${pagina === 'primeiros-passos' ? ` — etapa ${['terapias', 'escola', 'direitos'].indexOf(etapa) + 1}` : ''} · TEAcesso`;
  fecharMenu();
  if (moverFoco) {
    const visivel = document.querySelector('[data-page]:not([hidden])');
    const alvo = pagina === 'primeiros-passos' ? visivel.querySelector('[data-step]:not([hidden]) h2') : visivel.querySelector('h1');
    alvo.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
// O atalho de acessibilidade não altera a rota atual.
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#conteudo').focus();
  document.querySelector('#conteudo').scrollIntoView();
});
window.addEventListener('hashchange', () => navegar());
navegar(false);

async function prepararCartilha() {
  const bloco = document.querySelector('.booklet-card');
  bloco.querySelector('h2').textContent = cartilha.titulo;
  const pdf = await carregarPdf(cartilha);
  if (!pdf) {
    document.querySelector('#cartilha-status').textContent = 'A cartilha está em preparação. O download e o compartilhamento ficarão disponíveis quando o PDF revisado for publicado.';
    return;
  }
  bloco.querySelector('.badge').textContent = 'PDF disponível';
  bloco.querySelector('h2 + p').textContent = 'Cartilha revisada, disponível em PDF para consulta.';
  bloco.querySelector('.booklet-cover small').textContent = 'MATERIAL DE APOIO';
  const url = URL.createObjectURL(pdf);
  const acoes = document.querySelector('#cartilha-acoes');
  acoes.replaceChildren();
  const download = document.createElement('a');
  download.className = 'button primary';
  download.href = url;
  download.download = cartilha.arquivo.split('/').pop();
  download.textContent = 'Baixar PDF';
  acoes.append(download);
  const compartilhamento = linkCompartilhamento(cartilha);
  if (compartilhamento) {
    const compartilhar = document.createElement('a');
    compartilhar.className = 'button secondary';
    compartilhar.href = compartilhamento;
    compartilhar.target = '_blank';
    compartilhar.rel = 'noopener noreferrer';
    compartilhar.textContent = 'Compartilhar por WhatsApp (nova aba)';
    acoes.append(compartilhar);
  } else {
    const indisponivel = document.createElement('button');
    indisponivel.className = 'button secondary';
    indisponivel.disabled = true;
    indisponivel.textContent = 'Compartilhar por WhatsApp';
    acoes.append(indisponivel);
  }
  document.querySelector('#cartilha-status').textContent = compartilhamento
    ? 'O compartilhamento abre o WhatsApp com o link público da cartilha. Você escolhe o destinatário e confirma o envio.'
    : 'PDF disponível. O compartilhamento aguarda um endereço público confirmado; links do Live Server não funcionam em outros dispositivos.';
  // A URL do Blob vive com o documento e é liberada automaticamente ao fechá-lo.
}
prepararCartilha();
