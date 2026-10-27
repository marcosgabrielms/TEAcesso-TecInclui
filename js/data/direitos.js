// Referências gerais consultadas em 26/10/2026. Não validam fluxos locais.
export const direitos = [
  {
    id: 'passe-livre', titulo: 'Passe Livre Intermunicipal',
    resumo: 'Tema de transporte presente na base original. Regras, alcance e órgão responsável ainda precisam de validação.',
    passos: [
      ['Identifique o trajeto', 'Anote a origem e o destino para perguntar qual regra se aplica ao deslocamento.'],
      ['Confirme o programa e seus critérios', 'A base não comprova gratuidade nem direito a acompanhante. Peça essas informações ao órgão responsável.'],
      ['Confira o procedimento oficial', 'Antes de solicitar, confirme o canal, a documentação e a forma de acompanhamento.']
    ],
    documentos: 'Lista não validada. Confirme os documentos exigidos.',
    onde: 'Órgão e canal de solicitação não confirmados.', fonte: null
  },
  {
    id: 'bpc', titulo: 'BPC — Benefício de Prestação Continuada',
    resumo: 'Benefício assistencial com critérios próprios. Para a pessoa com deficiência, a concessão depende da verificação dos requisitos e de avaliação.',
    passos: [
      ['Conheça os critérios', 'Consulte a orientação do MDS. O diagnóstico de TEA, sozinho, não garante o benefício.'],
      ['Peça orientação sobre sua situação', 'Confirme as exigências de cadastro, renda e avaliação pelos canais oficiais.'],
      ['Verifique como fazer o pedido', 'Consulte a fonte oficial antes de iniciar. O atendimento local ainda não foi validado pelo projeto.']
    ],
    documentos: 'Consulte a lista atual na fonte oficial; não há lista local validada.',
    onde: 'Consulte os canais indicados pelo MDS.',
    fonte: { titulo: 'MDS — informações sobre o BPC', url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/beneficios-assistenciais/beneficio-assistencial-ao-idoso-e-a-pessoa-com-deficiencia-bpc' }
  },
  {
    id: 'estacionamento', titulo: 'Vaga de estacionamento especial',
    resumo: 'Tema de mobilidade da base original. Os critérios e a emissão de credencial em Teresina não estão validados neste MVP.',
    passos: [
      ['Confirme a aplicação das regras', 'Pergunte ao órgão responsável quais condições são exigidas para a credencial.'],
      ['Confira a documentação', 'Não use a lista antiga como exigência oficial. Confirme os documentos e o canal de solicitação.'],
      ['Esclareça o uso e a validade', 'Peça orientação sobre utilização, renovação e acompanhamento do pedido.']
    ],
    documentos: 'Requisitos documentais não confirmados.',
    onde: 'Órgão e canal de emissão não confirmados.', fonte: null
  },
  {
    id: 'laudo', titulo: 'Laudo e diagnóstico de TEA',
    resumo: 'O acompanhamento deve considerar as necessidades individuais. Use este roteiro para conversar com a equipe de saúde.',
    passos: [
      ['Converse com um profissional de saúde', 'Leve dúvidas sobre avaliação e acompanhamento. O portal não realiza diagnóstico.'],
      ['Pergunte sobre o caminho de atendimento', 'Confirme com a equipe o fluxo da rede local. Não há garantia de vagas ou avaliação nas instituições listadas.'],
      ['Esclareça a finalidade dos documentos', 'Pergunte ao profissional sobre os registros da avaliação e ao órgão solicitante sobre suas exigências.']
    ],
    documentos: 'Exigências locais ainda não verificadas.',
    onde: 'Fluxo de encaminhamento em Teresina a validar.',
    fonte: { titulo: 'Ministério da Saúde — Autismo', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/autismo' }
  }
];
