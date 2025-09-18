let grafico; // variável global para atualizar o gráfico

async function contarRegistrosPorNome(nome) {
  const url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${encodeURIComponent(nome)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao acessar a API do IBGE");
    }

    const dados = await response.json();

    if (!dados[0] || !dados[0].res) {
      document.getElementById("resultado").innerHTML = `<p>Nenhum dado encontrado para o nome <b>${nome}</b>.</p>`;
      return;
    }

    // Mostra dados em lista
    let html = `<h2>Resultados para "${nome}"</h2><ul>`;
    dados[0].res.forEach(periodo => {
      html += `<li><b>Período:</b> ${periodo.periodo} - <b>Frequência:</b> ${periodo.frequencia}</li>`;
    });
    html += "</ul>";

    // Soma total de frequências
    const totalRegistros = dados[0].res.reduce((total, periodo) => total + periodo.frequencia, 0);
    html += `<p><b>Total acumulado:</b> ${totalRegistros}</p>`;

    document.getElementById("resultado").innerHTML = html;

    // Dados para o gráfico
    const labels = dados[0].res.map(p => p.periodo);
    const valores = dados[0].res.map(p => p.frequencia);

    if (grafico) {
      grafico.destroy(); // destruir gráfico antigo antes de recriar
    }

    const ctx = document.getElementById("grafico").getContext("2d");
    grafico = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `Ocorrências do nome "${nome}"`,
          data: valores,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#2980b9"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Evolução do nome por período (décadas)"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  } catch (error) {
    document.getElementById("resultado").innerHTML = `<p style="color:red;">Erro: ${error.message}</p>`;
  }
}

function buscarNome() {
  const nome = document.getElementById("nomeInput").value.trim();
  if (nome) {
    contarRegistrosPorNome(nome);
  } else {
    alert("Digite um nome para pesquisar!");
  }
}
