# Urna Eletrônica - Grêmio Estudantil 2026
EE PEI Rosa Maria de Souza

Site estático (HTML/JS) + banco Supabase. Dois tablets:

| Página | Quem usa | Função |
|---|---|---|
| `urna.html` | Tablet do aluno | Urna. Fica travada até o mesário liberar. Trava de novo após cada voto. |
| `mesario.html` | Tablet do professor | Botão **Liberar urna** (um voto por liberação). |
| `admin.html` | Professor | Cadastrar chapas, abrir/encerrar a votação, relatório (imprimir/PDF/CSV). |

## Passo a passo (uma vez)

1. **Criar o login do professor**: Supabase > projeto `urna-gremio-2026` > Authentication > Users > *Add user* (e-mail + senha, marque *Auto confirm*).
   Em Authentication > Sign In / Providers, **desligue "Allow new users to sign up"**.
2. **Autorizar o e-mail do professor como administrador**, no SQL Editor do Supabase (só e-mails nessa tabela entram no painel):
   `insert into admins(email) values ('email@do.professor');`
3. **Sons reais**: coloque `sounds/tecla.mp3` e `sounds/confirma.mp3` (veja `sounds/LEIAME.txt`). Sem eles, usa som sintetizado.
4. **GitHub Pages**: suba a pasta no GitHub > Settings > Pages > Deploy from branch (`main`, pasta `/root`, ou mova o conteúdo desta pasta para a raiz do repositório).

## No dia da eleição

1. Admin: cadastrar chapas (mesmo número de dígitos, ex.: 11, 22, 33) e **Abrir votação**.
2. Tablet do mesário em `mesario.html`, tablet da urna em `urna.html` (toque na tela para ativar o som e a tela cheia).
3. Para cada aluno: conferir o nome na lista, tocar **LIBERAR URNA**, o aluno vota.
4. No fim: Admin > Votação > **Encerrar** > aba **Relatório**.

Antes da eleição real, faça votos de teste e use **Zerar tudo (testes)**.

## Segurança

- A urna só grava voto com liberação ativa (vale 1 voto, expira em 10 min).
- Voto secreto: tabela de votos sem data/hora e sem identificação.
- Só o administrador autenticado libera, abre, encerra e vê o resultado, e só depois de encerrar.
- Relatório confere liberações x votos e traz código SHA-256.
- Limite: não há identificação do eleitor; o controle de "um voto por aluno" é do mesário.
