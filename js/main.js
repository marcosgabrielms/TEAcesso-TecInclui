import { direitos } from './data/direitos.js';
import { servicos } from './data/servicos.js';

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
  <article class="service-card"><span class="eyebrow purple">${escapeHtml(servico.tipo)}</span><h2>${escapeHtml(servico.nome)}</h2><p>${escapeHtml(servico.servico)}</p>
  <dl><dt>Endereço ou referência</dt><dd>${escapeHtml(servico.endereco)}</dd><dt>Contato</dt><dd>${escapeHtml(servico.contato)}</dd></dl></article>`).join('');

document.querySelector('#contatos-lista').innerHTML = servicos.map((servico) => `
  <article class="contact-card"><span class="eyebrow purple">${escapeHtml(servico.tipo)}</span><h2>${escapeHtml(servico.nome)}</h2><p><strong>Contato:</strong> ${escapeHtml(servico.contato)}</p><p><strong>Endereço:</strong> ${escapeHtml(servico.endereco)}</p></article>`).join('');

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
