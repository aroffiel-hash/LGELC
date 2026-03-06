// api/registro.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { torneoSlug, snapshot } = req.body; // snapshot = { rows, config, meta }

    if (!snapshot || !snapshot.rows) {
      return res.status(400).json({ error: 'Snapshot inválido' });
    }

    const { error } = await supabase
      .from('registros')
      .insert({
        torneo_slug: torneoSlug || null,
        snapshot
      });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al guardar en Supabase' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error inesperado' });
  }
}
