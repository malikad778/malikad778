<div align="center">

<h1>Adnan Haider</h1>

<p>
<code>BACKEND ENGINEER</code> &nbsp;·&nbsp; <code>LARAVEL</code> &nbsp;·&nbsp; <code>PHP 8.3</code> &nbsp;·&nbsp; <code>MULTI&#8209;TENANT SAAS</code> &nbsp;·&nbsp; <code>EVENT&#8209;DRIVEN SYSTEMS</code>
</p>

<p>
I build the parts that have to keep working at 3am: queue pipelines, webhook ingestion,<br/>
tenant isolation, and the static analysis tooling that stops a bad migration<br/>
from ever reaching production.
</p>

<a href="https://codebyadnan.tech"><img src="https://img.shields.io/badge/codebyadnan.tech-0D1117?style=for-the-badge&logo=googlechrome&logoColor=1F6FEB" alt="Portfolio"/></a>
<a href="https://www.linkedin.com/in/adnan-haider/"><img src="https://img.shields.io/badge/LinkedIn-0D1117?style=for-the-badge&logo=linkedin&logoColor=0A66C2" alt="LinkedIn"/></a>
<a href="https://regretindex.me"><img src="https://img.shields.io/badge/The%20Regret%20Index-0D1117?style=for-the-badge&logo=vercel&logoColor=8957E5" alt="The Regret Index"/></a>
<a href="mailto:adnanhaider0347@gmail.com"><img src="https://img.shields.io/badge/Email-0D1117?style=for-the-badge&logo=gmail&logoColor=EA4335" alt="Email"/></a>

</div>

<br/>

<img src="https://img.shields.io/badge/CURRENTLY%20BUILDING-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

## Proposal SaaS

**Multi&#8209;tenant rebuild of a delivered client platform.**

A visual proposal builder (GrapesJS canvas, ~900&#8209;line server renderer, headless&#8209;Chrome PDF export, cryptographic sealing, in&#8209;browser signature capture) being turned from a single&#8209;customer install into a real product.

The interesting problem is not the editor. It is that tenancy has to be a security boundary, not a `where` clause someone can forget.

```php
// Company = security boundary. Team = visibility filter, layered on top.
// Collapsing these two axes into one is how you ship a cross-customer data leak.

Company                  // tenant, billing entity, hard isolation
  └── Team               // grouping inside a company, visibility only
        └── User         // 1 company, 0..n teams
                         // company role: Owner | Admin | Member
                         // team role:    team_admin | member
```

Five invariants I had to defend with tests rather than comments:

| Invariant | Why it exists |
|:--|:--|
| **Scope narrows, never swaps** | `CompanyScope` is never removed, only filtered further. Team visibility built by *replacing* the company scope is the classic leak. |
| **Fails open by design** | No filter applies when no tenant resolves, so console commands and migrations work. Safe only because `users.company_id` is `NOT NULL`. |
| **Roles are per company** | Spatie's `team_foreign_key` points at `company_id`. Pointing it at `teams.id` leaks roles across tenants. |
| **Authorisation self&#8209;scopes** | `User::can()` binds to the user's own company. Otherwise every check inside a job or command silently returns `false`. |
| **Two locale axes** | `users.locale` is the sender's UI. `proposals.locale` is the signed document. A German agency sends an English proposal to a UK buyer. |

<img src="https://img.shields.io/badge/153%20tests%20·%20413%20assertions-0D1117?style=flat-square&logo=phpunit&logoColor=3FB950" alt=""/>
<img src="https://img.shields.io/badge/composer%20audit%20clean-0D1117?style=flat-square&logo=composer&logoColor=3FB950" alt=""/>
<img src="https://img.shields.io/badge/Laravel%2012-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt=""/>
<img src="https://img.shields.io/badge/PHP%208.2-0D1117?style=flat-square&logo=php&logoColor=777BB4" alt=""/>
<img src="https://img.shields.io/badge/Browsershot%205-0D1117?style=flat-square&logo=googlechrome&logoColor=8B949E" alt=""/>
<img src="https://img.shields.io/badge/MySQL%208-0D1117?style=flat-square&logo=mysql&logoColor=4479A1" alt=""/>
<img src="https://img.shields.io/badge/GrapesJS-0D1117?style=flat-square&logo=javascript&logoColor=F7DF1E" alt=""/>
<img src="https://img.shields.io/badge/25%20locales-0D1117?style=flat-square&logo=translate&logoColor=8957E5" alt=""/>

<br/><br/>

<img src="https://img.shields.io/badge/SHIPPED%20AND%20RUNNING-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

## Meta Lead Ads &rarr; WhatsApp dispatch engine

**Webhook ingestion with zero&#8209;drop delivery.**

* **Acknowledge first, work later.** Non&#8209;blocking ingestion returns `200` in milliseconds, so Meta never marks the webhook unhealthy and starts throttling the campaign.
* **Two independent integrity gates.** `X-Hub-Signature-256` verified with `hash_equals()`, then a unique index on `meta_leadgen_id` makes a replay a no&#8209;op at the database level rather than in application code.
* **Redis workers under Supervisor** with time&#8209;bounded exponential backoff and rate&#8209;limit middleware, so a downstream outage degrades throughput instead of dropping leads.
* **E.164 normalisation** with calling&#8209;code resolution, plus a Filament 3 control panel for campaign mapping and live delivery telemetry.

<img src="https://img.shields.io/badge/Meta%20Graph%20API-0D1117?style=flat-square&logo=meta&logoColor=0081FB" alt=""/>
<img src="https://img.shields.io/badge/WhatsApp%20Cloud%20API-0D1117?style=flat-square&logo=whatsapp&logoColor=25D366" alt=""/>
<img src="https://img.shields.io/badge/Laravel%2011-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt=""/>
<img src="https://img.shields.io/badge/Filament%203-0D1117?style=flat-square&logo=filament&logoColor=F59E0B" alt=""/>
<img src="https://img.shields.io/badge/Redis%20%2B%20Supervisor-0D1117?style=flat-square&logo=redis&logoColor=DC382D" alt=""/>
<img src="https://img.shields.io/badge/HMAC%20SHA--256-0D1117?style=flat-square&logo=letsencrypt&logoColor=8957E5" alt=""/>

<br/>

## [The Regret Index](https://regretindex.me)

**Solo founder. Architecture and infrastructure.**

A longitudinal decision&#8209;archiving platform. Log a choice, revisit it later, find out whether your instincts actually calibrate.

* OpenAI embeddings pipeline for similarity search across unstructured decision records
* MCP server, so LLM clients can query the corpus directly instead of scraping it
* Stripe subscriptions with idempotent webhook fulfilment and manual capture
* Cloud Run containers, Upstash Redis, Cloudflare R2 object storage

<img src="https://img.shields.io/badge/Google%20Cloud%20for%20Startups-0D1117?style=flat-square&logo=googlecloud&logoColor=3FB950" alt=""/>
<img src="https://img.shields.io/badge/MongoDB%20for%20Startups-0D1117?style=flat-square&logo=mongodb&logoColor=3FB950" alt=""/>
<img src="https://img.shields.io/badge/Next.js-0D1117?style=flat-square&logo=nextdotjs&logoColor=FFFFFF" alt=""/>
<img src="https://img.shields.io/badge/Stripe-0D1117?style=flat-square&logo=stripe&logoColor=635BFF" alt=""/>
<img src="https://img.shields.io/badge/Cloud%20Run-0D1117?style=flat-square&logo=googlecloud&logoColor=4285F4" alt=""/>
<img src="https://img.shields.io/badge/Cloudflare%20R2-0D1117?style=flat-square&logo=cloudflare&logoColor=F38020" alt=""/>

<br/><br/>

<img src="https://img.shields.io/badge/OPEN%20SOURCE%20·%2083%20STARS-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

Small, sharp PHP tooling. Every one of these exists because I hit the problem on a real project first and could not find something that solved it properly.

<table>
<tr>
<td width="50%" valign="top">

### [nexus-inventory](https://github.com/malikad778/nexus-inventory) <img src="https://img.shields.io/github/stars/malikad778/nexus-inventory?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Multi&#8209;channel stock synchronisation for Laravel. Keeps Shopify, WooCommerce, Amazon and Etsy in agreement through real&#8209;time webhooks and queued reconciliation, including the awkward part where two channels sell the last unit at the same moment.

`Laravel 10-12` `Webhooks` `Job queues`

</td>
<td width="50%" valign="top">

### [php-sentinel](https://github.com/malikad778/php-sentinel) <img src="https://img.shields.io/github/stars/malikad778/php-sentinel?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Passive API contract monitoring for PHP 8.3+. Uses probabilistic inference to learn the shape of upstream JSON, then flags drift (a field that vanished, a type that quietly changed) without you hand&#8209;writing a single schema.

`PHP 8.3+` `Schema drift` `MIT`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [Laravel-migration-guard](https://github.com/malikad778/Laravel-migration-guard) <img src="https://img.shields.io/github/stars/malikad778/Laravel-migration-guard?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Static analysis that reads your migrations in CI and refuses the ones that take a table lock or drop a column with data behind it. Zero config. The `strong_migrations` equivalent for Laravel.

`AST parser` `CI gate` `Zero config`

</td>
<td width="50%" valign="top">

### [wp-hook-check](https://github.com/malikad778/wp-hook-check) <img src="https://img.shields.io/github/stars/malikad778/wp-hook-check?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Finds orphaned listeners, unheard hooks and misspelled action names in WordPress source without ever bootstrapping WordPress. Fast enough to run on every commit.

`PHP CLI` `WordPress` `Static analysis`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [notification-center](https://github.com/malikad778/notification-center) <img src="https://img.shields.io/github/stars/malikad778/notification-center?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Multi&#8209;channel dispatch for Laravel 12 with parallel workers and circuit&#8209;breaker routing. When a provider starts timing out it trips, reroutes, and stops burning worker time on a dead endpoint.

`Laravel 12` `Circuit breaker` `Telemetry`

</td>
<td width="50%" valign="top">

### [blade-access](https://github.com/malikad778/blade-access) <img src="https://img.shields.io/github/stars/malikad778/blade-access?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

73 WCAG 2.1 AA rules for Blade and Livewire, aimed at European Accessibility Act deadlines. Ships a baseline file, so you can adopt it on a legacy codebase without a red build on day one. No runtime dependency.

`WCAG 2.1 AA` `Baseline` `CI`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [ai-mcp](https://github.com/malikad778/ai-mcp) <img src="https://img.shields.io/github/stars/malikad778/ai-mcp?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

Makes a WordPress site legible to AI agents. Semantic chunking, FAQ extraction, media and author indexing, plus `llms.txt` and an MCP manifest, all exposed over REST.

`MCP` `WordPress` `REST`

</td>
<td width="50%" valign="top">

### [woocommerce-otp-auth-engine](https://github.com/malikad778/woocommerce-otp-auth-engine) <img src="https://img.shields.io/github/stars/malikad778/woocommerce-otp-auth-engine?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" align="right" alt=""/>

OTP registration gating that runs *before* the user row is written, so bots never create the account at all. Includes SMS pumping and AIT fraud defence, which is the part most OTP plugins leave you exposed on.

`WooCommerce` `Fraud defence` `Multisite`

</td>
</tr>
</table>

<br/>

<img src="https://img.shields.io/badge/STACK-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

<table>
<tr><td valign="middle"><code>CORE</code></td><td>
<img src="https://img.shields.io/badge/PHP%208.2%20%2F%208.3%20%2F%208.4-0D1117?style=flat-square&logo=php&logoColor=777BB4" alt=""/>
<img src="https://img.shields.io/badge/Laravel%2011%20%2F%2012-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt=""/>
<img src="https://img.shields.io/badge/Filament%203-0D1117?style=flat-square&logo=filament&logoColor=F59E0B" alt=""/>
<img src="https://img.shields.io/badge/Livewire-0D1117?style=flat-square&logo=livewire&logoColor=FB70A9" alt=""/>
<img src="https://img.shields.io/badge/WordPress-0D1117?style=flat-square&logo=wordpress&logoColor=FFFFFF" alt=""/>
<img src="https://img.shields.io/badge/TypeScript-0D1117?style=flat-square&logo=typescript&logoColor=3178C6" alt=""/>
</td></tr>
<tr><td valign="middle"><code>DATA</code></td><td>
<img src="https://img.shields.io/badge/MySQL%208-0D1117?style=flat-square&logo=mysql&logoColor=4479A1" alt=""/>
<img src="https://img.shields.io/badge/PostgreSQL-0D1117?style=flat-square&logo=postgresql&logoColor=4169E1" alt=""/>
<img src="https://img.shields.io/badge/MongoDB%20Atlas-0D1117?style=flat-square&logo=mongodb&logoColor=47A248" alt=""/>
<img src="https://img.shields.io/badge/Redis-0D1117?style=flat-square&logo=redis&logoColor=DC382D" alt=""/>
<img src="https://img.shields.io/badge/Horizon-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt=""/>
<img src="https://img.shields.io/badge/Upstash-0D1117?style=flat-square&logo=upstash&logoColor=00E9A3" alt=""/>
</td></tr>
<tr><td valign="middle"><code>INFRA</code></td><td>
<img src="https://img.shields.io/badge/Docker-0D1117?style=flat-square&logo=docker&logoColor=2496ED" alt=""/>
<img src="https://img.shields.io/badge/Cloud%20Run-0D1117?style=flat-square&logo=googlecloud&logoColor=4285F4" alt=""/>
<img src="https://img.shields.io/badge/Cloudflare%20R2-0D1117?style=flat-square&logo=cloudflare&logoColor=F38020" alt=""/>
<img src="https://img.shields.io/badge/Nginx-0D1117?style=flat-square&logo=nginx&logoColor=009639" alt=""/>
<img src="https://img.shields.io/badge/Linux-0D1117?style=flat-square&logo=linux&logoColor=FCC624" alt=""/>
<img src="https://img.shields.io/badge/GitHub%20Actions-0D1117?style=flat-square&logo=githubactions&logoColor=2088FF" alt=""/>
</td></tr>
<tr><td valign="middle"><code>FRONT</code></td><td>
<img src="https://img.shields.io/badge/Next.js%2014%20%2F%2015-0D1117?style=flat-square&logo=nextdotjs&logoColor=FFFFFF" alt=""/>
<img src="https://img.shields.io/badge/React-0D1117?style=flat-square&logo=react&logoColor=61DAFB" alt=""/>
<img src="https://img.shields.io/badge/Tailwind-0D1117?style=flat-square&logo=tailwindcss&logoColor=06B6D4" alt=""/>
<img src="https://img.shields.io/badge/Alpine.js-0D1117?style=flat-square&logo=alpinedotjs&logoColor=8BC0D0" alt=""/>
<img src="https://img.shields.io/badge/Vite-0D1117?style=flat-square&logo=vite&logoColor=646CFF" alt=""/>
</td></tr>
<tr><td valign="middle"><code>APIS</code></td><td>
<img src="https://img.shields.io/badge/Meta%20Graph-0D1117?style=flat-square&logo=meta&logoColor=0081FB" alt=""/>
<img src="https://img.shields.io/badge/WhatsApp%20Cloud-0D1117?style=flat-square&logo=whatsapp&logoColor=25D366" alt=""/>
<img src="https://img.shields.io/badge/Stripe%20%2B%20Connect-0D1117?style=flat-square&logo=stripe&logoColor=635BFF" alt=""/>
<img src="https://img.shields.io/badge/OpenAI-0D1117?style=flat-square&logo=openai&logoColor=FFFFFF" alt=""/>
<img src="https://img.shields.io/badge/MCP-0D1117?style=flat-square&logo=anthropic&logoColor=8957E5" alt=""/>
</td></tr>
<tr><td valign="middle"><code>TEST</code></td><td>
<img src="https://img.shields.io/badge/PHPUnit%2011-0D1117?style=flat-square&logo=phpunit&logoColor=3FB950" alt=""/>
<img src="https://img.shields.io/badge/Pint-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt=""/>
<img src="https://img.shields.io/badge/nikic%2Fphp--parser-0D1117?style=flat-square&logo=php&logoColor=777BB4" alt=""/>
<img src="https://img.shields.io/badge/Mockery-0D1117?style=flat-square&logo=php&logoColor=777BB4" alt=""/>
</td></tr>
</table>

<br/>

<img src="https://img.shields.io/badge/THE%20CODE%20ITSELF-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

<div align="center">

<img src="https://img.shields.io/badge/778-CONTRIBUTIONS%2C%2012%20MONTHS-0D1117?style=for-the-badge&labelColor=1F6FEB" alt=""/>
<img src="https://img.shields.io/badge/83-STARS%20ON%20PACKAGES-0D1117?style=for-the-badge&labelColor=D29922" alt=""/>
<img src="https://img.shields.io/badge/13-PUBLIC%20REPOS%2C%20NO%20FORKS-0D1117?style=for-the-badge&labelColor=8957E5" alt=""/>

<br/><br/>

<sub>LANGUAGE SPLIT ACROSS THE EIGHT PACKAGES, BY SOURCE BYTES</sub>

<br/>

<img src="https://img.shields.io/badge/PHP%20%C2%B7%2087.1%25-777BB4?style=flat-square" alt="PHP 87.1 percent"/><img src="https://img.shields.io/badge/6.6-FF2D20?style=flat-square" alt="Blade 6.6 percent"/><img src="https://img.shields.io/badge/3.5-1F6FEB?style=flat-square" alt="JavaScript 3.5 percent"/><img src="https://img.shields.io/badge/2.8-8957E5?style=flat-square" alt="CSS and HTML 2.8 percent"/>

<br/>

<sub>
<img src="https://img.shields.io/badge/-777BB4?style=flat-square" height="10" alt=""/> PHP 87.1% &nbsp;
<img src="https://img.shields.io/badge/-FF2D20?style=flat-square" height="10" alt=""/> Blade 6.6% &nbsp;
<img src="https://img.shields.io/badge/-1F6FEB?style=flat-square" height="10" alt=""/> JavaScript 3.5% &nbsp;
<img src="https://img.shields.io/badge/-8957E5?style=flat-square" height="10" alt=""/> CSS / HTML 2.8%
</sub>

</div>

<br/>

Measured over the eight package repositories rather than every repo on the account, because the portfolio site's vendored assets would otherwise drown the signal. That volume is library work, not commit&#8209;streak padding: the five starred packages account for most of it, and they run inside other people's CI.

<br/>

<img src="https://img.shields.io/badge/HOW%20I%20WORK-8B949E?style=flat-square&labelColor=0D1117&color=0D1117" alt=""/>

**Write the test that fails when the invariant breaks**, not the one that passes today. A green suite that never disagrees with you is decoration. The valuable tests in a multi&#8209;tenant system are the ones that go red the moment someone collapses two axes into one.

**Fail loudly at the boundary, gracefully in the middle.** Reject a malformed payload at ingestion, where the error is cheap and the context is complete. Do not let it become a half&#8209;written row three services deep, discovered a week later by a customer.

**Record the deviation and the reason.** Plans are wrong in places. The useful artefact six months later is not the plan, it is knowing exactly why the code diverged from it and what would have to change for the original approach to work.

**The comment explains why, the code explains what.** If a block needs a comment to describe what it does, the fix is to rewrite the block. Save the comments for the constraint you cannot see from the syntax.

<br/>

<div align="center">

<img src="https://img.shields.io/badge/OPEN%20TO%20BACKEND%20AND%20PLATFORM%20WORK-0D1117?style=flat-square&labelColor=3FB950" alt=""/>

<sub>Laravel, PHP, multi&#8209;tenant SaaS, integration&#8209;heavy systems. Based in Pakistan, working remotely.</sub>

<br/><br/>

<a href="mailto:adnanhaider0347@gmail.com"><b>adnanhaider0347@gmail.com</b></a>
&nbsp;·&nbsp;
<a href="https://codebyadnan.tech"><b>codebyadnan.tech</b></a>
&nbsp;·&nbsp;
<a href="https://www.linkedin.com/in/adnan-haider/"><b>LinkedIn</b></a>

</div>
