'use strict';

/* ---------- CONFIG ---------- */
const CONFIG = {
  host: 'cloudcapacity-nvchile.us.qlikcloud.com',
  prefix: '/',
  port: 443,
  isSecure: true,
  appId: '34122366-7c20-4c27-84da-64b0f4d121b6',
  webIntegrationId: 'KLa3'
};

/* ---------- REQUIRE CONFIG ---------- */
require.config({
  baseUrl: (CONFIG.isSecure ? "https://" : "http://") +
           CONFIG.host +
           CONFIG.prefix +
           "resources"
});

/* ---------- AUTENTICAÇÃO ---------- */
fetch(`https://${CONFIG.host}/api/v1/csrf-token`, {
  method: "GET",
  headers: {
    "qlik-web-integration-id": CONFIG.webIntegrationId
  },
  credentials: "include"
})
.then(() => {
  startQlik();
})
.catch(err => {
  console.error("Erro na autenticação:", err);
});

/* ---------- START APP ---------- */
function startQlik() {

  require(['js/qlik'], function (qlik) {

    qlik.setOnError(err => console.error('[Qlik Error]', err));

    const app = qlik.openApp(CONFIG.appId, CONFIG);

    /* ---------- FILTRO INICIAL ---------- */
    const valorInicial = "2025";

    app.field("Ano").selectMatch(valorInicial)
    .then(loadObjects)
    .catch(err => {
      console.warn("Filtro falhou, carregando sem seleção:", err);
      loadObjects();
    });

    /* ---------- LOAD OBJECTS ---------- */
    function loadObjects() {

      // FILTROS
      app.getObject("filter-ano", "52d11366-55e4-4ef3-8c04-023c32cdd925");
      app.getObject("filter-mes", "89d79e38-8955-48b5-ad58-3698e7dc9b5b");
      app.getObject("filter-trimestre", "b342118c-1425-4cf0-9fd8-af074d657af8");

      // KPIs
      app.getObject("obj-kpi-receita", "8daf11d3-818b-47b0-b114-9037c8fa3a58");
      app.getObject("obj-kpi-ticket", "682493a7-d9b4-49b5-9271-b334c52e5109");
      app.getObject("obj-kpi-clientes", "84a7ba71-9111-460c-8447-17769a9e0cae");
      app.getObject("obj-kpi-vendas", "93ed5be3-2fc1-4e24-9a3f-d177c6c1fee3");
      app.getObject("obj-kpi-reccliente", "3a90d495-3932-4181-afd7-2d1a9aab7c88");

      // GRÁFICOS
      app.getObject("obj-barchart", "7161abf1-9744-4a54-9c70-9d34f66f8890");
      app.getObject("obj-linechart", "43eb4630-b938-494d-a1d0-f53e7c7ff461");
      app.getObject("obj-piechart", "53ed03b2-b825-43dd-8a94-8b6b7ac104d6");
      app.getObject("obj-combochart", "a263c2ab-e30e-4a55-a6b3-90add0541f11");

      // TABELA
      app.getObject("obj-table", "a1702b7e-bd0e-4b35-be27-a741a189cda7");
    }

    /* ---------- RESET ---------- */
    document.getElementById('btnReset')?.addEventListener('click', () => {
      app.clearAll();
    });

  });
}
