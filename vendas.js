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
  isSecure:         true,
  webIntegrationId: 'KLa3Cs8iTjbVJdMCz5h1-RKU0KQw2Zaj',
};

/* ---------- IDs dos Objetos na Sheet (gerados via Qlik MCP) ---------- */
const OBJ = {
  // Filtros (listbox)
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
};

/* ---------- Expressões dos KPIs (campos do modelo de dados) ---------- */
const KPI_DEFS = [
  {
    id:         'obj-kpi-receita',
    expression: "Sum({<StatusVenda={'>0'}>} ValorTotal)",
    fallback:   "Sum(ValorTotal)",
    format:     'currency',
  },
  {
    id:         'obj-kpi-ticket',
    expression: "Avg({<StatusVenda={'>0'}>} ValorTotal)",
    fallback:   "Avg(ValorTotal)",
    format:     'currency',
  },
  {
    id:         'obj-kpi-clientes',
    expression: "Count(DISTINCT IdCliente)",
    fallback:   "Count(DISTINCT IdCliente)",
    format:     'integer',
  },
  {
    id:         'obj-kpi-vendas',
    expression: "Count(IdVenda)",
    fallback:   "Count(IdVenda)",
    format:     'integer',
  },
  {
    id:         'obj-kpi-reccliente',
    expression: "Sum(ValorTotal) / Count(DISTINCT IdCliente)",
    fallback:   "Sum(ValorTotal) / Count(DISTINCT IdCliente)",
    format:     'currency',
  },
];

/* ---------- UI: Sidebar & Navegação ---------- */
(function initUI() {
  const sidebar     = document.getElementById('sidebar');
  const burger      = document.getElementById('burgerBtn');
  const mainContent = document.querySelector('.main-content');
  const navItems    = document.querySelectorAll('.nav-item');
  const pages       = document.querySelectorAll('.page');
  const btnReset    = document.getElementById('btnReset');

  burger.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
    }
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.page;
      pages.forEach(p => p.classList.remove('active'));
      const el = document.getElementById('page-' + target);
      if (el) el.classList.add('active');
      document.querySelector('.page-title').textContent =
        item.querySelector('.nav-label').textContent + ' — Vendas';
    });
  });

  btnReset.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('qlik:clearSelections'));
  });
})();

/* ---------- Helpers ---------- */
function formatValue(val, type) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  if (type === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0
    }).format(val);
  }
  return new Intl.NumberFormat('pt-BR').format(Math.round(val));
}

/* ---------- Qlik Sense Cloud — Capability API ----------
   IMPORTANTE: No Qlik Cloud o webIntegrationId DEVE ser passado dentro do
   bloco config['js/qlik'] do require.config — não como propriedade de topo.
   Ref: https://qlik.dev/tutorials/build-a-simple-mashup-using-capability-apis
   -------------------------------------------------------------------- */
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

require(['js/qlik'], function (qlik) {

  qlik.setOnError(function (error) {
    console.error('[Qlik Mashup] Erro:', error.message || JSON.stringify(error));
  });

  /* ---- Abre o App ---- */
  const app = qlik.openApp(CONFIG.appId, {
    host:             CONFIG.host,
    prefix:           CONFIG.prefix,
    isSecure:         CONFIG.isSecure,
    webIntegrationId: CONFIG.webIntegrationId,
  });

  /* ---- Filtros (listbox) no Topbar ---- */
  app.getObject('filter-ano',       OBJ.filterAno);
  app.getObject('filter-mes',       OBJ.filterMes);
  app.getObject('filter-trimestre', OBJ.filterTrimestre);

  /* ---- Gráficos da sheet ---- */
  app.getObject('obj-barchart',   OBJ.barChart);
  app.getObject('obj-linechart',  OBJ.lineChart);
  app.getObject('obj-piechart',   OBJ.pieChart);
  app.getObject('obj-combochart', OBJ.comboChart);

  /* ---- Tabela ---- */
  app.getObject('obj-table', OBJ.table);

  /* ---- KPIs via createCube (independente dos objetos da sheet) ----
     Cria cubos de sessão diretamente no mashup para garantir que os
     valores sejam calculados com as expressões corretas e atualizados
     em tempo real conforme seleções do usuário.
  ------------------------------------------------------------------- */
  KPI_DEFS.forEach(function (kpi) {
    const el = document.getElementById(kpi.id);
    if (!el) return;

    el.textContent = '…';

    app.createCube({
      qMeasures: [{
        qDef: {
          qDef: kpi.expression,
          qLabel: 'valor',
        }
      }],
      qInitialDataFetch: [{ qTop: 0, qLeft: 0, qHeight: 1, qWidth: 1 }]
    }, function (reply) {
      try {
        const pages = reply.qHyperCube.qDataPages;
        if (pages && pages[0] && pages[0].qMatrix && pages[0].qMatrix[0]) {
          const cell = pages[0].qMatrix[0][0];
          el.textContent = formatValue(cell.qNum, kpi.format);
        } else {
          el.textContent = '—';
        }
      } catch (e) {
        el.textContent = '—';
        console.warn('[KPI ' + kpi.id + '] Erro ao ler cubo:', e);
      }
    });
  });

  /* ---- Reset Filtros ---- */
  document.addEventListener('qlik:clearSelections', function () {
    app.clearAll();
  });

});
