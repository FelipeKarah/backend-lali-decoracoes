// test-simple.js
const axios = require('axios')

const BACKEND_URL = 'http://localhost:8080/api'
const MP_TOKEN =
  'TEST-7046610459567246-051607-43029a2cbad8010c1c937915f6952e3f-312544317'

async function test() {
  console.log('=== TESTE CARTÃO ===\n')

  // Gerar token do cartão
  const tokenRes = await axios.post(
    'https://api.mercadopago.com/v1/card_tokens',
    {
      card_number: '5031433215406351',
      cardholder: { name: 'APROVADO' },
      expiration_month: 11,
      expiration_year: 2030,
      security_code: '123',
    },
    { headers: { Authorization: `Bearer ${MP_TOKEN}` } },
  )

  const token = tokenRes.data.id
  console.log('Token:', token)

  // Pagamento via backend
  const paymentRes = await axios.post(`${BACKEND_URL}/payments/card`, {
    token: token,
    issuer_id: '24',
    payment_method_id: 'master',
    transaction_amount: 10.0,
    installments: 1,
    description: 'Teste Lali',
    external_reference: `TEST-${Date.now()}`,
    payer_email: 'cliente@teste.com',
  })

  console.log('Pagamento:', paymentRes.data)

  console.log('\n=== TESTE PIX ===\n')

  const pixRes = await axios.post(`${BACKEND_URL}/payments/pix`, {
    transaction_amount: 50.0,
    description: 'Teste PIX Lali',
    external_reference: `PIX-${Date.now()}`,
    payer_email: 'cliente@pix.com',
  })

  console.log('PIX:', pixRes.data)
}

test().catch(console.error.data)
