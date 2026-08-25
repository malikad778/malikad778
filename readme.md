<div align="center">

<h1>Adnan Haider</h1>

<p><b>Backend Engineer</b> &nbsp;·&nbsp; Laravel &nbsp;·&nbsp; PHP 8.3 &nbsp;·&nbsp; Multi&#8209;tenant SaaS &nbsp;·&nbsp; Event&#8209;driven systems</p>

<p>I build the parts that have to keep working at 3am: queue pipelines, webhook ingestion,<br/>tenant isolation, and the tooling that stops bad migrations from reaching production.</p>

<a href="https://codebyadnan.tech"><img src="https://img.shields.io/badge/Portfolio-codebyadnan.tech-1f6feb?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=0d1117" alt="Portfolio"/></a>
<a href="https://www.linkedin.com/in/adnan-haider/"><img src="https://img.shields.io/badge/LinkedIn-Connect-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0d1117" alt="LinkedIn"/></a>
<a href="https://regretindex.me"><img src="https://img.shields.io/badge/SaaS-The%20Regret%20Index-8957e5?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0d1117" alt="The Regret Index"/></a>
<a href="mailto:adnanhaider0347@gmail.com"><img src="https://img.shields.io/badge/Email-Say%20hi-ea4335?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0d1117" alt="Email"/></a>

</div>

<br/>

## Currently building

### Proposal SaaS &nbsp;<sub>multi&#8209;tenant rebuild of a delivered client platform</sub>

A visual proposal builder (GrapesJS canvas, ~900&#8209;line server renderer, headless&#8209;Chrome PDF export, cryptographic sealing, in&#8209;browser signature capture) being turned from a single&#8209;customer install into a real multi&#8209;tenant product.

The interesting problem is not the editor. It is that **tenancy has to be a security boundary, not a `where` clause someone can forget.**

```php
// Company = security boundary.  Team = visibility filter, layered on top.
// Collapsing these two axes into one is how you ship a cross-customer data leak.

Company                       // tenant, billing entity, hard isolation
  └── Team                    // grouping inside a company, visibility only
        └── User              // 1 company, 0..n teams
                              // company role: Owner | Admin | Member
                              // team role:    team_admin | member
```

Decisions I had to defend with tests rather than comments:

| Invariant | Why it exists |
|:--|:--|
| `CompanyScope` never gets removed, only narrowed | Team visibility implemented by *swapping* the company scope is the classic leak |
| Scope fails **open** when no tenant resolves | Console commands and migrations need it. Safe only because `users.company_id` is `NOT NULL` |
| Spatie's `team_foreign_key` points at `company_id` | Pointing it at `teams.id` leaks roles across tenants |
| `User::can()` self&#8209;scopes to its own company | Otherwise every check inside a job or command silently returns `false` |
| Two locale axes, not one | `users.locale` is the sender's UI. `proposals.locale` is the signed document. A German agency sends an English proposal to a UK buyer |

<sub>Laravel 12 · PHP 8.2 · Browsershot 5 · Spatie Permission · MySQL 8 · 153 tests / 413 assertions green · `composer audit` clean · 25 locale formatting table hand&#8209;written so self&#8209;hosters without `ext-intl` still get correct prices</sub>

<br/>

### Meta Lead Ads → WhatsApp dispatch engine &nbsp;<sub>zero&#8209;drop delivery</sub>

Webhook ingestion and notification routing from Meta Lead Ads into WhatsApp Cloud API and Wasender sessions.

* **Acknowledge first, work later.** Non&#8209;blocking ingestion returns `200` in milliseconds so Meta never marks the webhook unhealthy and starts throttling.
* **Two independent integrity gates.** `X-Hub-Signature-256` verified with `hash_equals()`, then a unique index on `meta_leadgen_id` makes replays a no&#8209;op at the database level rather than in application code.
* **Redis workers under Supervisor** with time&#8209;bounded exponential backoff and rate&#8209;limit middleware, so a downstream outage degrades throughput instead of dropping leads.
* **E.164 normalisation** with calling&#8209;code resolution, plus a Filament 3 control panel for campaign mapping and delivery telemetry.

<br/>

### [The Regret Index](https://regretindex.me) &nbsp;<sub>solo founder, architecture and infra</sub>

A longitudinal decision&#8209;archiving platform: log a choice, revisit it later, find out whether your instincts calibrate.

* OpenAI embeddings pipeline for similarity search across unstructured decision records
* MCP server so LLM clients can query the corpus directly
* Stripe subscriptions with idempotent webhook fulfilment and manual capture
* Cloud Run + Upstash Redis + Cloudflare R2

<sub>Backed by Google Cloud for Startups and MongoDB for Startups.</sub>

<br/>

## Open source

Small, sharp PHP tooling. Each one exists because I hit the problem on a real project first.

<table>
<tr>
<td width="50%" valign="top">

#### [php-sentinel](https://github.com/malikad778/php-sentinel)
Passive API contract monitoring for PHP 8.3+. Learns the shape of upstream JSON responses and flags drift (a field that vanished, a type that changed) without you writing a single schema by hand.

<img src="https://img.shields.io/badge/PHP-8.3+-777BB4?style=flat-square&logo=php&logoColor=white"/> <img src="https://img.shields.io/badge/MIT-3fb950?style=flat-square"/>

</td>
<td width="50%" valign="top">

#### [Laravel-migration-guard](https://github.com/malikad778/Laravel-migration-guard)
AST parser that reads your migrations in CI and refuses the ones that take a table lock or drop a column with data behind it. Catches the deploy that would have caused the incident.

<img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white"/> <img src="https://img.shields.io/badge/Static%20analysis-1f6feb?style=flat-square"/>

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [nexus-inventory](https://github.com/malikad778/nexus-inventory)
Multi&#8209;channel stock synchronisation for Laravel. Keeps Shopify, WooCommerce, Amazon and Etsy in agreement through webhooks and queued reconciliation, including the awkward part where two channels sell the last unit at once.

<img src="https://img.shields.io/badge/Laravel-10--12-FF2D20?style=flat-square&logo=laravel&logoColor=white"/> <img src="https://img.shields.io/badge/Queues-DC382D?style=flat-square&logo=redis&logoColor=white"/>

</td>
<td width="50%" valign="top">

#### [notification-center](https://github.com/malikad778/notification-center)
Multi&#8209;channel dispatch for Laravel 12 with circuit&#8209;breaker failover. When a provider starts timing out it trips, reroutes, and stops burning worker time on a dead endpoint.

<img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel&logoColor=white"/> <img src="https://img.shields.io/badge/Event--driven-8957e5?style=flat-square"/>

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [laravel-blade-ally](https://github.com/malikad778/laravel-blade-ally)
WCAG 2.1 AA linter for Blade and Livewire, aimed at European Accessibility Act deadlines. Pure static inspection, so it costs nothing at runtime.

<img src="https://img.shields.io/badge/Blade-FF2D20?style=flat-square&logo=laravel&logoColor=white"/> <img src="https://img.shields.io/badge/WCAG%202.1%20AA-3fb950?style=flat-square"/>

</td>
<td width="50%" valign="top">

#### [wp-hook-check](https://github.com/malikad778/wp-hook-check)
Finds orphaned listeners and misspelled hook names in WordPress source without bootstrapping WordPress. Fast enough to run on every commit.

<img src="https://img.shields.io/badge/PHP%20CLI-777BB4?style=flat-square&logo=php&logoColor=white"/> <img src="https://img.shields.io/badge/WordPress-21759B?style=flat-square&logo=wordpress&logoColor=white"/>

</td>
</tr>
</table>

<br/>

## Stack

<table>
<tr>
<td valign="middle"><b>Core</b></td>
<td><img src="https://skillicons.dev/icons?i=php,laravel,mysql,redis,ts,nextjs" height="42"/></td>
</tr>
<tr>
<td valign="middle"><b>Infra</b></td>
<td><img src="https://skillicons.dev/icons?i=docker,gcp,cloudflare,nginx,linux,githubactions" height="42"/></td>
</tr>
<tr>
<td valign="middle"><b>Also</b></td>
<td><img src="https://skillicons.dev/icons?i=mongodb,tailwind,react,vite,git,bash" height="42"/></td>
</tr>
</table>

**Day to day:** Laravel 11/12 internals, Filament 3, Livewire, queue workers and Horizon, `nikic/php-parser` for the AST tooling, PHPUnit, Pint.
**Integrations I know the sharp edges of:** Meta Graph API, WhatsApp Cloud API, Stripe (including Connect), OpenAI, Model Context Protocol.

<br/>

## The code itself

<div align="center">

<img height="165" src="https://github-readme-stats.vercel.app/api?username=malikad778&show_icons=true&count_private=true&include_all_commits=true&hide_border=true&bg_color=0d1117&title_color=1f6feb&text_color=c9d1d9&icon_color=8957e5&ring_color=1f6feb" alt="GitHub stats"/>
<img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=malikad778&layout=compact&langs_count=8&hide_border=true&bg_color=0d1117&title_color=1f6feb&text_color=c9d1d9" alt="Top languages"/>

<br/><br/>

<img src="https://streak-stats.demolab.com?user=malikad778&hide_border=true&background=0d1117&stroke=21262d&ring=1f6feb&fire=8957e5&currStreakLabel=c9d1d9&sideLabels=8b949e&dates=6e7681&currStreakNum=c9d1d9&sideNums=c9d1d9" alt="Contribution streak"/>

<br/><br/>

<img src="https://github-readme-activity-graph.vercel.app/graph?username=malikad778&theme=github-compact&bg_color=0d1117&color=c9d1d9&line=1f6feb&point=8957e5&area=true&area_color=1f6feb&hide_border=true&custom_title=Commit%20activity" alt="Commit activity" width="100%"/>

</div>

<br/>

## How I work

* **Write the test that fails when the invariant breaks**, not the one that passes today. A green suite that never disagrees with you is decoration.
* **Record the deviation and the reason.** Plans are wrong in places; the useful artefact is knowing *why* the code diverged from them.
* **Fail loudly at the boundary, gracefully in the middle.** Reject a bad payload at ingestion. Do not let it become a half&#8209;written row three services deep.
* **The comment explains why, the code explains what.** If the code needs a comment to say what it does, rewrite the code.

<br/>

<div align="center">

<sub>Open to backend and platform work: Laravel, PHP, multi&#8209;tenant SaaS, integration&#8209;heavy systems.</sub>

<br/>

<a href="mailto:adnanhaider0347@gmail.com"><b>adnanhaider0347@gmail.com</b></a> &nbsp;·&nbsp; <a href="https://codebyadnan.tech"><b>codebyadnan.tech</b></a> &nbsp;·&nbsp; <a href="https://www.linkedin.com/in/adnan-haider/"><b>LinkedIn</b></a>

</div>
