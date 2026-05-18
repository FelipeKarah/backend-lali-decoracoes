// test-pix-only.js
const axios = require('axios')

const BACKEND_URL = 'http://localhost:8080/api'

async function testPix() {
  console.log('=== TESTE PIX ===\n')

  const payload = {
    transaction_amount: 15.0,
    description: 'Compra na Lali Moda',
    external_reference: `PIX-${Date.now()}`,
    payer_email: 'cliente@lali.com.br',
  }

  console.log('Payload:', payload)

  try {
    const response = await axios.post(`${BACKEND_URL}/payments/pix`, payload)
    console.log('\n✅ PIX gerado com sucesso!')
    console.log('ID:', response.data.id)
    console.log('Status:', response.data.status)
    console.log('QR Code gerado:', response.data.qr_code ? 'Sim ✓' : 'Não')
    console.log(
      'QR Code Base64:',
      response.data.qr_code_base64 ? 'Sim ✓' : 'Não',
    )
  } catch (error) {
    console.error('\n❌ Erro:', error.response?.data || error.message)
  }
}

testPix()
