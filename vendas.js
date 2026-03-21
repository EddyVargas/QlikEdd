/* ============================================================
   vendas.js — Mashup Dashboard de Vendas · Qlik Sense Cloud
   Tenant : cloudcapacity-nvchile.us.qlikcloud.com
   App ID : 34122366-7c20-4c27-84da-64b0f4d121b6
   Sheet  : 3e778149-fcd8-41f2-898e-af0671f025b0

   PRÉ-REQUISITO: A origem deste arquivo DEVE estar na allowlist
   do Web Integration ID no Qlik Management Console:
   https://cloudcapacity-nvchile.us.qlikcloud.com/console/web-integrations
   ============================================================ */

'use strict';

/* ---------- Configuração ---------- */
var CONFIG = {
  host:             'https://cloudcapacity-nvchile.us.qlikcloud.com',
  prefix:           '/',
  appId:            '34122366-7c20-4c27-84da-64b0f4d121b6',
  isSecure:         true,
  webIntegrationId: 'KLa3Cs8iTjbVJdMCz5h1-RKU0KQw2Zaj',
};

/* ---------- IDs dos Objetos da Sheet ---------- */
var OBJ = {
  // Filtros
  filterAno:        '52d11366-55e4-4ef3-8c04-023c32cdd925',
  filterMes:        '89d79e38-8955-48b5-ad58-3698e7dc9b5b',
  filterTrimestre:  'b342118c-1425-4cf0-9fd8-af074d657af8',
  // KPIs
  kpiReceita:       '8daf11d3-818b-47b0-b114-9037c8fa3a58',
  kpiTicket:        '682493a7-d9b4-49b5-9271-b334c52e5109',
  kpiClientes:      '84a7ba71-9111-460c-8447-17769a9e0cae',
  kpiVendas:        '93ed5be3-2fc1-4e24-9a3f-d177c6c1fee3',
  kpiRecCliente:    '3a90d495-3932-4181-afd7-2d1a9aab7c88',
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
  var sidebar     = document.getElementById('sidebar');
  var burger      = document.getElementById('burgerBtn');
  var mainContent = document.querySelector('.main-content');
  var navItems    = document.querySelectorAll('.nav-item');
  var pages       = document.querySelectorAll('.page');
  var btnReset    = document.getElementById('btnReset');

  burger.addEventListener('click', function () {
    if (window.innerWidth <= 900) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    }
  });

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');
      pages.forEach(function (p) { p.classList.remove('active'); });
      var el = document.getElementById('page-' + item.dataset.page);
      if (el) el.classList.add('active');
      document.querySelector('.page-title').textContent =
        item.querySelector('.nav-label').textContent + ' — Vendas';
    });
  });

  btnReset.addEventListener('click', function () {
    document.dispatchEvent(new CustomEvent('qlik:clearSelections'));
  });
})();

/* ---------- Autenticação Qlik Cloud ----------
   O Qlik Cloud usa cookie de sessão (SameSite=None; Secure).
   A origem do mashup DEVE estar na allowlist do Web Integration ID.
   O require.config recebe o webIntegrationId dentro de config['js/qlik'].
   ------------------------------------------------------------ */
require.config({
  baseUrl: 'https://' + CONFIG.host + '/resources',
  config: {
    'js/qlik': {
      host:             CONFIG.host,
      prefix:           CONFIG.prefix,
      isSecure:         CONFIG.isSecure,
      webIntegrationId: CONFIG.webIntegrationId,
    }
  }
});

/* ---------- Verifica sessão antes de carregar objetos ----------
   Se o usuário não estiver autenticado no tenant, redireciona
   para o login do Qlik Cloud e retorna ao mashup após o login.
   ------------------------------------------------------------ */
fetch('https://' + CONFIG.host + '/api/v1/users/me', {
  credentials: 'include',
  headers: { 'qlik-web-integration-id': CONFIG.webIntegrationId }
})
.then(function (res) {
  if (res.status === 401) {
    /* Não autenticado — redireciona para login do Qlik Cloud */
    var returnTo = encodeURIComponent(window.location.href);
    window.location.href =
      'https://' + CONFIG.host +
      '/login?returnto=' + returnTo +
      '&qlik-web-integration-id=' + CONFIG.webIntegrationId;
    return;
  }
  /* Autenticado — carrega a Capability API */
  carregarQlik();
})
.catch(function (err) {
  console.error('[Auth] Falha ao verificar sessão:', err);
  carregarQlik(); /* Tenta carregar mesmo assim */
});

/* ---------- Carrega objetos Qlik ---------- */
function carregarQlik() {
  require(['js/qlik'], function (qlik) {

    qlik.setOnError(function (error) {
      console.error('[Qlik] Erro:', error.message || JSON.stringify(error));
    });

    var app = qlik.openApp(CONFIG.appId, {
      host:             CONFIG.host,
      prefix:           CONFIG.prefix,
      isSecure:         CONFIG.isSecure,
      webIntegrationId: CONFIG.webIntegrationId,
    });

    /* Filtros */
    app.getObject('filter-ano',       OBJ.filterAno);
    app.getObject('filter-mes',       OBJ.filterMes);
    app.getObject('filter-trimestre', OBJ.filterTrimestre);

    /* KPIs */
    app.getObject('obj-kpi-receita',    OBJ.kpiReceita);
    app.getObject('obj-kpi-ticket',     OBJ.kpiTicket);
    app.getObject('obj-kpi-clientes',   OBJ.kpiClientes);
    app.getObject('obj-kpi-vendas',     OBJ.kpiVendas);
    app.getObject('obj-kpi-reccliente', OBJ.kpiRecCliente);

    /* Gráficos */
    app.getObject('obj-barchart',   OBJ.barChart);
    app.getObject('obj-linechart',  OBJ.lineChart);
    app.getObject('obj-piechart',   OBJ.pieChart);
    app.getObject('obj-combochart', OBJ.comboChart);

    /* Tabela */
    app.getObject('obj-table', OBJ.table);

    /* Reset Filtros */
    document.addEventListener('qlik:clearSelections', function () {
      app.clearAll();
    });

  });
}
