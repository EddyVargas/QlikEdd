/* ============================================================
   vendas.js — Mashup Dashboard de Vendas · Qlik Sense Cloud
   App ID : 34122366-7c20-4c27-84da-64b0f4d121b6
   Sheet  : 3e778149-fcd8-41f2-898e-af0671f025b0
   ============================================================ */

'use strict';

/* ---------- Configuração do Tenant ---------- */
const CONFIG = {
  host:   'cloudcapacity-nvchile.us.qlikcloud.com',
  prefix: '/',
  appId:  '34122366-7c20-4c27-84da-64b0f4d121b6',
  isSecure: true,
};

/* ---------- IDs dos Objetos (gerados via Qlik MCP) ---------- */
const OBJ = {
  // Filtros (listbox)
  filterAno:        '52d11366-55e4-4ef3-8c04-023c32cdd925',
  filterMes:        '89d79e38-8955-48b5-ad58-3698e7dc9b5b',
  filterTrimestre:  'b342118c-1425-4cf0-9fd8-af074d657af8',

  // KPIs
  kpiReceita:       '8daf11d3-818b-47b0-b114-9037c8fa3a58',
  kpiTicket:        '682493a7-d9b4-49b5-9271-b334c52e5109',
  kpiClientes:      '84a7ba71-9111-460c-8447-17769a9e0cae',
  kpiVendas:        '93ed5be3-2fc1-4e24-9a3f-d177c6c1fee3',

  // Gráficos
  barChart:         '7161abf1-9744-4a54-9c70-9d34f66f8890',
  lineChart:        '43eb4630-b938-494d-a1d0-f53e7c7ff461',
  pieChart:         '53ed03b2-b825-43dd-8a94-8b6b7ac104d6',
  comboChart:       'a263c2ab-e30e-4a55-a6b3-90add0541f11',

  // Tabela
  table:            'a1702b7e-bd0e-4b35-be27-a741a189cda7',
};

/* ---------- UI: Sidebar & Navegação ---------- */
(function initUI() {
  const sidebar    = document.getElementById('sidebar');
  const burger     = document.getElementById('burgerBtn');
  const mainContent = document.querySelector('.main-content');
  const navItems   = document.querySelectorAll('.nav-item');
  const pages      = document.querySelectorAll('.page');
  const btnReset   = document.getElementById('btnReset');

  // Toggle sidebar
  burger.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    }
  });

  // Navegação entre páginas
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.page;
      pages.forEach(p => p.classList.remove('active'));
      const targetPage = document.getElementById('page-' + target);
      if (targetPage) targetPage.classList.add('active');
      document.querySelector('.page-title').textContent =
        item.querySelector('.nav-label').textContent + ' — Vendas';
    });
  });

  // Botão reset — dispara evento customizado capturado depois da conexão Qlik
  btnReset.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('qlik:clearSelections'));
  });
})();

/* ---------- Qlik Mashup API ---------- */
require.config({
  baseUrl: `https://${CONFIG.host}${CONFIG.prefix}resources`,
  webIntegrationId: undefined, // Adicione o Web Integration ID aqui se necessário
});

require(['js/qlik'], function(qlik) {

  /* -- Configuração de conexão -- */
  qlik.setOnError(function(error) {
    console.error('[Qlik Mashup] Erro:', error);
  });

  const app = qlik.openApp(CONFIG.appId, {
    host:     CONFIG.host,
    prefix:   CONFIG.prefix,
    isSecure: CONFIG.isSecure,
  });

  /* ---- Filtros no Topbar ---- */
  app.getObject('filter-ano',       OBJ.filterAno);
  app.getObject('filter-mes',       OBJ.filterMes);
  app.getObject('filter-trimestre', OBJ.filterTrimestre);

  /* ---- KPIs ---- */
  app.getObject('obj-kpi-receita',    OBJ.kpiReceita);
  app.getObject('obj-kpi-ticket',     OBJ.kpiTicket);
  app.getObject('obj-kpi-clientes',   OBJ.kpiClientes);
  app.getObject('obj-kpi-vendas',     OBJ.kpiVendas);

  /* ---- Gráficos ---- */
  app.getObject('obj-barchart',   OBJ.barChart);
  app.getObject('obj-linechart',  OBJ.lineChart);
  app.getObject('obj-piechart',   OBJ.pieChart);
  app.getObject('obj-combochart', OBJ.comboChart);

  /* ---- Tabela ---- */
  app.getObject('obj-table', OBJ.table);

  /* ---- Reset Filtros ---- */
  document.addEventListener('qlik:clearSelections', function() {
    app.clearAll();
  });

  /* ---- Indicador de loading ---- */
  app.global.isPersonalMode(function(reply) {
    console.log('[Qlik Mashup] Conectado. Personal mode:', reply.qReturn);
  });

});
