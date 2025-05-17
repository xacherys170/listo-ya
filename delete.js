const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { id } = JSON.parse(event.body);
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'ID requerido' }) };
  }

  const { error } = await supabase.from('licencias').delete().eq('id', id);

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Licencia eliminada' }),
  };
};
