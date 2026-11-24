import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
const supabaseSecret =
  secretKeys.default ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const deviceApiKey = Deno.env.get("DEVICE_API_KEY");

const supabase = createClient(supabaseUrl, supabaseSecret ?? "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

function response(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!supabaseSecret || !deviceApiKey) {
    return response({ error: "Configuração da API incompleta." }, 500);
  }

  if (req.method === "POST") {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== deviceApiKey) {
      return response({ error: "Chave de acesso inválida." }, 401);
    }

    try {
      const body = await req.json();
      const { device_id, distance_cm, level_percent } = body;

      if (
        typeof device_id !== "string" ||
        device_id.trim() === "" ||
        typeof distance_cm !== "number" ||
        !Number.isFinite(distance_cm) ||
        distance_cm < 0 ||
        typeof level_percent !== "number" ||
        !Number.isFinite(level_percent) ||
        level_percent < 0 ||
        level_percent > 100
      ) {
        return response({ error: "Dados da leitura inválidos." }, 400);
      }

      const { data, error } = await supabase
        .from("leituras")
        .insert({
          device_id: device_id.trim(),
          distance_cm,
          level_percent,
          alerta: level_percent < 20,
        })
        .select()
        .single();

      if (error) {
        return response(
          { error: "Não foi possível salvar a leitura." },
          500,
        );
      }

      return response(
        { message: "Leitura armazenada com sucesso!", leitura: data },
        201,
      );
    } catch {
      return response(
        { error: "Não foi possível processar o JSON enviado." },
        400,
      );
    }
  }

  if (req.method === "GET") {
    const url = new URL(req.url);
    const latest = url.searchParams.get("latest");

    let query = supabase
      .from("leituras")
      .select(
        "id, device_id, distance_cm, level_percent, alerta, created_at",
      )
      .order("created_at", { ascending: false });

    if (latest === "true") {
      const { data, error } = await query.limit(1).maybeSingle();

      if (error) {
        return response({ error: "Erro ao consultar a leitura." }, 500);
      }

      return response({ leitura: data });
    }

    const limit = Number(url.searchParams.get("limit") ?? "50");

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return response(
        { error: "O limite deve ser entre 1 e 100." },
        400,
      );
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      return response({ error: "Erro ao consultar o histórico." }, 500);
    }

    return response({ total: data.length, leituras: data });
  }

  return response({ error: "Método não permitido." }, 405);
});
