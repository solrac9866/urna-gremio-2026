const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const ESCOLA = 'EE PEI Rosa Maria de Souza';
const ELEICAO = 'Grêmio Estudantil 2026';

async function rpc(fn, args) {
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Permite entrar so com o usuario (ex.: escolarosa); o e-mail interno completa o dominio.
function usuarioParaEmail(v) {
  v = v.trim().toLowerCase();
  return v.includes('@') ? v : v + '@urna.rosa';
}

function montarLogin(el, onOk) {
  el.hidden = false;
  el.innerHTML = `
    <form class="card login" id="formLogin">
      <h1>${esc(ESCOLA)}</h1>
      <p class="muted">${esc(ELEICAO)} &middot; acesso do professor</p>
      <label>Usuário <input type="text" id="lgEmail" autocomplete="username" autocapitalize="none" required></label>
      <label>Senha <input type="password" id="lgSenha" autocomplete="current-password" required></label>
      <p class="erro" id="lgErro" hidden></p>
      <button class="btn verde" type="submit">Entrar</button>
    </form>`;
  const erro = el.querySelector('#lgErro');
  el.querySelector('#formLogin').onsubmit = async e => {
    e.preventDefault();
    erro.hidden = true;
    const { error } = await db.auth.signInWithPassword({
      email: usuarioParaEmail(el.querySelector('#lgEmail').value),
      password: el.querySelector('#lgSenha').value,
    });
    if (error) { erro.textContent = 'E-mail ou senha incorretos.'; erro.hidden = false; return; }
    let ok = false;
    try { ok = await rpc('is_admin'); } catch { /* segue como nao autorizado */ }
    if (!ok) {
      await db.auth.signOut();
      erro.textContent = 'Este usuário não tem permissão de administrador.';
      erro.hidden = false;
      return;
    }
    el.hidden = true;
    onOk();
  };
}

async function exigirAdmin(loginEl, onOk) {
  const { data } = await db.auth.getSession();
  if (data.session) {
    try { if (await rpc('is_admin')) return onOk(); } catch { /* cai no login */ }
  }
  montarLogin(loginEl, onOk);
}

async function sair() {
  await db.auth.signOut();
  location.reload();
}
