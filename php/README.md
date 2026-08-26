# Integração PHP + MySQL

A aplicação React tenta carregar os dados reais por meio destes endpoints:

| Recurso | Endpoint | Métodos |
|---|---|---|
| Autores | `php/api/autores.php` | `GET`, `POST`, `PUT`, `DELETE` |
| Livros | `php/api/livros.php` | `GET`, `POST`, `PUT`, `DELETE` |

## Instalação local

1. Execute `database.sql` no MySQL.
2. Ajuste `php/config/database.php` ou defina `DB_HOST`, `DB_NAME`, `DB_USER` e `DB_PASS` como variáveis de ambiente.
3. Sirva a pasta do projeto por Apache, Nginx + PHP-FPM ou pelo servidor embutido do PHP.

Exemplo com PHP instalado:

```bash
php -S localhost:8000 -t .
```

Nesse cenário, altere temporariamente `API_BASE` em `client/src/pages/Home.tsx` para `/php/api` quando o frontend estiver sendo servido no mesmo host. Se o frontend estiver no Vite em outra porta, configure o proxy do servidor web ou sirva o build junto com a pasta PHP para evitar diferenças de origem.

## Segurança

Os endpoints usam PDO com prepared statements e validam os campos recebidos. Em produção, remova as credenciais padrão, restrinja `Access-Control-Allow-Origin` ao domínio da aplicação, habilite HTTPS e mantenha o arquivo de configuração fora da pasta pública sempre que a infraestrutura permitir.
