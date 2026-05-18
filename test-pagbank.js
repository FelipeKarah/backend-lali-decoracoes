// Teste todas as possíveis URLs
async function testEndpoints() {
  const checkoutCode = 'EC3968B1808033C77498AF88B13EFC0C';
  const email = 'felipekarah@hotmail.com';
  const token = '07A6819E5ED8488C81768B91BE5D8DFB';
  
  const endpoints = [
    // Possibilidade 1: Consulta de transação por checkout code
    {
      url: `https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/${checkoutCode}`,
      name: 'Transação por checkout code'
    },
    // Possibilidade 2: Consulta do checkout em si
    {
      url: `https://ws.sandbox.pagseguro.uol.com.br/v2/checkout/${checkoutCode}`,
      name: 'Consulta do checkout'
    },
    // Possibilidade 3: Notificações (pós-pagamento)
    {
      url: `https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/notifications/${checkoutCode}`,
      name: 'Notificações'
    }
  ];
  
  console.log('🧪 Testando endpoints do PagBank...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, {
        params: { email, token },
        headers: {},
        timeout: 5000
      });
      
      console.log(`✅ ${endpoint.name}:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Primeiros 200 chars: ${response.data.substring(0, 200)}...\n`);
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}:`);
      console.log(`   Erro: ${error.response?.status || error.code}`);
      console.log(`   Mensagem: ${error.message}\n`);
    }
  }
}

testEndpoints();