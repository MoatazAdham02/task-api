const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { createClient } = require('@supabase/supabase-js');

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

function getAuthHeaderToken(req) {
  const header = req.get('authorization') || req.get('Authorization');
  if (!header || typeof header !== 'string') {
    return null;
  }

  const match = /^Bearer\s+(\S+)$/.exec(header);
  if (!match) {
    return null;
  }

  return match[1];
}

async function requireAuth(req, res, next) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials are not configured' });
  }

  const token = getAuthHeaderToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function signup(req, res) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials are not configured' });
  }

  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(data);
}

async function login(req, res) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase credentials are not configured' });
  }

  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  return res.status(200).json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    user: data.user
  });
}

async function logout(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials are not configured' });
  }

  const token = getAuthHeaderToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  return res.status(204).send();
}

module.exports = {
  requireAuth,
  signup,
  login,
  logout,
  getAuthHeaderToken,
  getSupabaseClient
};
