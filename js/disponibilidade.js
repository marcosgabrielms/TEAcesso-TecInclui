export function urlHttps(valor) {
  try {
    const url = new URL(valor);
    return url.protocol === 'https:' && !url.username && !url.password ? url : null;
  } catch { return null; }
}

export function dataValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T12:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

// A validação automática só verifica o cadastro; a confirmação é responsabilidade editorial.
export function contatoConfirmado(canal) {
  return Boolean(canal?.confirmado === true && typeof canal.valor === 'string'
    && /^55\d{10,11}$/.test(canal.valor) && urlHttps(canal.fonte) && dataValida(canal.verificadoEm));
}

export function urlPublicaSegura(valor) {
  const url = urlHttps(valor);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  // Compartilhar um endereço local não permite que outra família abra o arquivo.
  if (!host.includes('.') || host.includes(':') || /^\d+(\.\d+){3}$/.test(host)
    || /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host)
    || /(^|\.)example\.(com|net|org)$/.test(host)) return null;
  return url.href;
}

export function linkCompartilhamento(config) {
  const url = config.disponivel === true && urlPublicaSegura(config.urlPublica);
  if (!url) return null;
  return `https://wa.me/?text=${encodeURIComponent(`${config.titulo} — TEAcesso\n${url}`)}`;
}

export async function carregarPdf(config, base = document.baseURI) {
  if (config.disponivel !== true || typeof config.arquivo !== 'string') return null;
  // Aceita apenas arquivos dentro da pasta reservada, sem travessia de diretórios.
  if (!/^assets\/cartilhas\/[a-zA-Z0-9_-]+\.pdf$/.test(config.arquivo)) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(new URL(config.arquivo, base), { signal: controller.signal });
    if (!response.ok) return null;
    const blob = await response.blob();
    // Evita baixar a página HTML de erro como se fosse uma cartilha.
    if (await blob.slice(0, 5).text() !== '%PDF-') return null;
    return new Blob([blob], { type: 'application/pdf' });
  } catch { return null; }
  finally { clearTimeout(timeout); }
}
