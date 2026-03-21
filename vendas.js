/* ============================================================
   vendas.js — Mashup Dashboard de Vendas · Qlik Sense Cloud
   Tenant : cloudcapacity-nvchile.us.qlikcloud.com
   App ID : 34122366-7c20-4c27-84da-64b0f4d121b6
   Sheet  : 3e778149-fcd8-41f2-898e-af0671f025b0
   ============================================================ */

'use strict';

/* ---------- Configuração ---------- */
const CONFIG = {
  host:             'cloudcapacity-nvchile.us.qlikcloud.com',
  prefix:           '/',
  appId:            '34122366-7c20-4c27-84da-64b0f4d121b6',
   port: 443,
  isSecure:         true,
  webIntegrationId: 'KLa3Cs8iTjbVJdMCz5h1-RKU0KQw2Zaj',
};

/* ---------- Objetos ---------- */
const OBJ = {
  // Filtros
  filterAno:        '52d11366-55e4-4ef3-8c04-023c32cdd925',
  filterMes:        '89d79e38-8955-48b5-ad58-3698e7dc9b5b',
  filterTrimestre:  'b342118c-1425-4cf0-9fd8-af074d657af8',

  // Gráficos
  barChart:         '7161abf1-9744-4a54-9c70-9d34f66f8890',
  lineChart:        '43eb4630-b938-494d-a1d0-f53e7c7ff461',
  pieChart:         '53ed03b2-b825-43dd-8a94-8b6b7ac104d6',
  comboChart:       'a263c2ab-e30e-4a55-a6b3-90add0541f11',

  // Tabela
  table:            'a1702b7e-bd0e-4b35-be27-a741a189cda7',

  // KPIs
  kpiReceita:       '8daf11d3-818b-47b0-b114-9037c8fa3a58',
  kpiTicket:        '682493a7-d9b4-49b5-9271-b334c52e5109',
  kpiClientes:      '84a7ba71-9111-460c-8447-17769a9e0cae',
  kpiVendas:        '93ed5be3-2fc1-4e24-9a3f-d177c6c1fee3',
  kpiRecCliente:    '3a90d495-3932-4181-afd7-2d1a9aab7c88',
};

/* ---------- UI ---------- */
(function initUI() {
  const sidebar     = document.getElementById('sidebar');
  const burger      = document.getElementById('burgerBtn');
  const mainContent = document.querySelector('.main-content');
  const navItems    = document.querySelectorAll('.nav-item');
  const pages       = document.querySelectorAll('.page');
  const btnReset    = document.getElementById('btnReset');

  if (burger) {
    burger.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 900;
      if (isMobile) {
        sidebar?.classList.toggle('open');
      } else {
        sidebar?.classList.toggle('collapsed');
        mainContent?.classList.toggle('expanded');
      }
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const target = item.dataset.page;
      pages.forEach(p => p.classList.remove('active'));

      const el = document.getElementById('page-' + target);
      if (el) el.classList.add('active');

      const title = item.querySelector('.nav-label')?.textContent;
      const titleEl = document.querySelector('.page-title');
      if (title && titleEl) {
        titleEl.textContent = title + ' — Vendas';
      }
    });
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('qlik:clearSelections'));
    });
  }
})();

/* ---------- Qlik ---------- */
require.config( {
    baseUrl: ( CONFIG.isSecure ? "https://" : "http://" ) + CONFIG.host + (CONFIG.port ? ":" + CONFIG.port : "") + CONFIG.prefix + "resources",
    webIntegrationId: CONFIG.webIntegrationId
} );	

require(['js/qlik'], function (qlik) {

  qlik.setOnError(function (error) {
    console.error('[Qlik Error]', error);
  });

  const app = qlik.openApp(CONFIG.appId, CONFIG);

  /* ---------- Filtros ---------- */
  app.getObject('filter-ano',       OBJ.filterAno);
  app.getObject('filter-mes',       OBJ.filterMes);
  app.getObject('filter-trimestre', OBJ.filterTrimestre);

  /* ---------- Gráficos ---------- */
  app.getObject('obj-barchart',   OBJ.barChart);
  app.getObject('obj-linechart',  OBJ.lineChart);
  app.getObject('obj-piechart',   OBJ.pieChart);
  app.getObject('obj-combochart', OBJ.comboChart);

  /* ---------- Tabela ---------- */
  app.getObject('obj-table', OBJ.table);

  /* ---------- KPIs ---------- */
  app.getObject('obj-kpi-receita',    OBJ.kpiReceita);
  app.getObject('obj-kpi-ticket',     OBJ.kpiTicket);
  app.getObject('obj-kpi-clientes',   OBJ.kpiClientes);
  app.getObject('obj-kpi-vendas',     OBJ.kpiVendas);
  app.getObject('obj-kpi-reccliente', OBJ.kpiRecCliente);

  /* ---------- Reset ---------- */
  document.addEventListener('qlik:clearSelections', function () {
    app.clearAll();
  });

});
