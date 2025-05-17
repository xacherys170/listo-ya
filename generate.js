const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { user, days } = JSON.parse(event.body);

    if (!user || !days || days < 1) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Usuario o días inválidos' }) };
    }

    // Generar licencia (simple random string)
    const licencia = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Fecha de expiración en milisegundos
    const fechaExpira = new Date();
    fechaExpira.setDate(fechaExpira.getDate() + days);

    const { data, error } = await supabase.from('licencias').insert([
      {
        usuario: user,
        licencia,
        fecha_expira: fechaExpira.toISOString()
      }
    ]);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ license: licencia, expiresAt: fechaExpira.toISOString() }),
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
