<div align="center">

# Adnan Haider

### Backend Engineer &nbsp;·&nbsp; Laravel &nbsp;·&nbsp; PHP 8.3 &nbsp;·&nbsp; Multi&#8209;tenant SaaS

Six years of PHP, most of it on the unglamorous half. The queue that has to drain.
The webhook that cannot return a 502. The migration that would have taken a table
lock at 4pm on a Friday.

I write the boring, load&#8209;bearing code, and the static analysis that keeps other
people from breaking it.

<a href="https://codebyadnan.tech"><img src="https://img.shields.io/badge/codebyadnan.tech-0D1117?style=for-the-badge&logo=googlechrome&logoColor=1F6FEB" alt="Portfolio"/></a> <a href="https://www.linkedin.com/in/adnan-haider/"><img src="https://img.shields.io/badge/LinkedIn-0D1117?style=for-the-badge&logo=linkedin&logoColor=0A66C2" alt="LinkedIn"/></a> <a href="https://regretindex.me"><img src="https://img.shields.io/badge/The%20Regret%20Index-0D1117?style=for-the-badge&logo=vercel&logoColor=8957E5" alt="The Regret Index"/></a> <a href="mailto:adnanhaider0347@gmail.com"><img src="https://img.shields.io/badge/Email-0D1117?style=for-the-badge&logo=gmail&logoColor=EA4335" alt="Email"/></a>

</div>

---

# Proposal SaaS

### Turning a delivered single&#8209;tenant product into a real multi&#8209;tenant one

I shipped this for one client: GrapesJS canvas, a ~900&#8209;line server renderer, headless&#8209;Chrome PDF export, cryptographic sealing, in&#8209;browser signature capture. It works. Now I am pulling the single&#8209;tenant assumptions out of it one at a time, which is turning out to be harder than building it was.

The editor was never the hard part. Tenancy is. Every B2B leak postmortem I have read comes down to the same thing: someone treated isolation as a query filter instead of a boundary the query cannot escape.

```mermaid
flowchart TD
    C["Company<br/><i>tenant · billing entity</i>"]
    T["Team<br/><i>grouping inside a company</i>"]
    U["User<br/><i>1 company · 0..n teams</i>"]
    R1["Owner · Admin · Member"]
    R2["team_admin · member"]

    C -->|"SECURITY BOUNDARY<br/>never removed"| T
    T -->|"VISIBILITY FILTER<br/>layered on top"| U
    U -.company role.-> R1
    U -.team role.-> R2

    classDef sec fill:#132E5C,stroke:#1F6FEB,stroke-width:2px,color:#F0F6FC
    classDef vis fill:#2A1B4D,stroke:#8957E5,stroke-width:2px,color:#F0F6FC
    classDef ent fill:#161B22,stroke:#30363D,color:#C9D1D9
    classDef role fill:#0D1117,stroke:#21262D,color:#8B949E
    class C sec
    class T vis
    class U ent
    class R1,R2 role
```

> [!IMPORTANT]
> `CompanyScope` applies **no filter at all** when no tenant resolves. That sounds like the bug. It is deliberate, so console commands and migrations still work, and it is safe for exactly one reason: `users.company_id` is `NOT NULL`. An authenticated user can never resolve to null and see everything. Make that column nullable and the whole design becomes a data leak.

### Five invariants I defend with tests, not comments

| Invariant | What breaks without it |
|:--|:--|
| **Scope narrows, never swaps** | Team visibility built by *replacing* the company scope instead of layering on it. This is the classic leak. |
| **Fails open, deliberately** | Console commands and migrations stop working. Safe only while `users.company_id` stays `NOT NULL`. |
| **Roles are per company** | Spatie's `team_foreign_key` points at `company_id`. Point it at `teams.id` and roles leak across tenants. |
| **Authorisation self&#8209;scopes** | `User::can()` binds to the user's own company. Otherwise every check inside a job or command silently returns `false`. |
| **Two locale axes** | `users.locale` is the sender's UI. `proposals.locale` is the signed document. A German agency sends an English proposal to a UK buyer. |

This one already bit me twice, in `defaultTeam()` and again in `provisionRoles()`:

```diff
- // Looks harmless. Returns an empty collection when another tenant is current,
- // which produces users with no team and no visibility. No error, no warning.
- $company->teams()->get();

+ // Team carries CompanyScope, so any walk of a company's children has to run
+ // inside that company's context, even when you already hold the model.
+ CompanyContext::for($company->id, fn () => $company->teams()->get());
```

<img src="https://img.shields.io/badge/153%20tests-413%20assertions-0D1117?style=flat-square&labelColor=1B7F3B&logo=phpunit&logoColor=white" alt="153 tests, 413 assertions"/> <img src="https://img.shields.io/badge/composer%20audit-0%20advisories-0D1117?style=flat-square&labelColor=1B7F3B&logo=composer&logoColor=white" alt="composer audit clean"/> <img src="https://img.shields.io/badge/Laravel-12-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt="Laravel 12"/> <img src="https://img.shields.io/badge/PHP-8.2-0D1117?style=flat-square&logo=php&logoColor=777BB4" alt="PHP 8.2"/> <img src="https://img.shields.io/badge/Browsershot-5-0D1117?style=flat-square&logo=googlechrome&logoColor=8B949E" alt="Browsershot 5"/> <img src="https://img.shields.io/badge/MySQL-8-0D1117?style=flat-square&logo=mysql&logoColor=4479A1" alt="MySQL 8"/> <img src="https://img.shields.io/badge/Locales-25-0D1117?style=flat-square&logo=googletranslate&logoColor=8957E5" alt="25 locales"/>

<details>
<summary><b>The actual phase tracker</b> &nbsp;<i>(where this sits today)</i></summary>

<br/>

Phase 1 is not done until an isolation suite proves Company A cannot reach Company B's proposals, templates, settings, media, smart content, email templates, users or teams through *any* route. Nothing downstream starts before that gate passes.

- [x] `1a` Tenancy schema migrations
- [x] `1b` Models, `BelongsToCompany`, visibility scopes, factories
- [x] `1c` Global&#8209;singleton fixes (cache keys, unique constraints)
- [x] `1d` Roles, permissions, policies
- [ ] `1i` Internationalisation, dual&#8209;axis &nbsp;<sup>code done, ~110 admin strings left</sup>
- [ ] `1e` Public sign&#8209;up, registration links, invitations &nbsp;<sup>**in progress**</sup>
- [ ] `1f` Per&#8209;tenant credentials plus SSRF guard
- [ ] `1g` Cross&#8209;tenant isolation suite &nbsp;<sup>**Phase 1 gate**</sup>
- [ ] `1.5` Decoupling from the upstream billing system
- [ ] `2` Billing, plan limits, reminders
- [ ] `3` Approvals and multi&#8209;signer

**Debt I have written down rather than pretended away:** the PDF endpoint regenerates with headless Chrome on every download. Sealed proposals are immutable, so that is pure waste, and it becomes the dominant hosting cost the moment a free tier exists. It gets cached before launch, not after.

**Translation policy:** formatting works for all 25 locales, but reviewed strings ship for `en` and `de` only. A proposal is a quasi&#8209;legal document somebody signs. A mistranslated accept, decline or expiry clause is a dispute, not a typo, so machine translation does not go near the client&#8209;facing axis.

</details>

---

# Meta Lead Ads to WhatsApp

### Webhook ingestion that does not drop leads

Meta does not care about your queue depth. Return slowly enough, often enough, and it marks the endpoint unhealthy and throttles the campaign. So nothing does real work on the request thread.

```mermaid
sequenceDiagram
    autonumber
    participant M as Meta Lead Ads
    participant W as Webhook endpoint
    participant D as MySQL
    participant Q as Redis · Supervisor
    participant A as WhatsApp Cloud API

    M->>W: POST lead payload
    W->>W: verify X-Hub-Signature-256<br/>via hash_equals()
    W->>D: INSERT (unique meta_leadgen_id)
    Note over D: replay collides here,<br/>not in application code
    W-->>M: 200 in milliseconds
    W->>Q: dispatch job
    Q->>A: send templated message
    A--xQ: 5xx or rate limit
    Q->>Q: exponential backoff, time-bounded
    Q->>A: retry
    A-->>Q: delivered
```

**Two integrity gates, deliberately independent.** The signature check rejects forgeries. The unique index on `meta_leadgen_id` makes a replay a no&#8209;op at the database level. I want the second one in the schema rather than in a service class, because schemas do not get refactored around at 2am.

**Backoff is time&#8209;bounded, not attempt&#8209;bounded.** A provider outage should degrade throughput and then recover. It should not silently exhaust retries and drop a lead somebody paid for.

<img src="https://img.shields.io/badge/Meta%20Graph%20API-0D1117?style=flat-square&logo=meta&logoColor=0081FB" alt="Meta Graph API"/> <img src="https://img.shields.io/badge/WhatsApp%20Cloud%20API-0D1117?style=flat-square&logo=whatsapp&logoColor=25D366" alt="WhatsApp Cloud API"/> <img src="https://img.shields.io/badge/Laravel%2011-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt="Laravel 11"/> <img src="https://img.shields.io/badge/Filament%203-0D1117?style=flat-square&logo=filament&logoColor=F59E0B" alt="Filament 3"/> <img src="https://img.shields.io/badge/Redis%20%2B%20Supervisor-0D1117?style=flat-square&logo=redis&logoColor=DC382D" alt="Redis and Supervisor"/> <img src="https://img.shields.io/badge/HMAC%20SHA--256-0D1117?style=flat-square&logo=letsencrypt&logoColor=8957E5" alt="HMAC SHA-256"/>

---

# [The Regret Index](https://regretindex.me)

### Solo founder. My architecture, my pager.

Log a decision, revisit it on a schedule, find out whether your instincts actually calibrate. Backed by Google Cloud for Startups and MongoDB for Startups.

Building it alone taught me more about cost than about code. Embeddings are cheap to call and expensive to call *badly*, and the difference is entirely in what you cache.

<img src="https://img.shields.io/badge/Next.js-0D1117?style=flat-square&logo=nextdotjs&logoColor=FFFFFF" alt="Next.js"/> <img src="https://img.shields.io/badge/MongoDB%20Atlas-0D1117?style=flat-square&logo=mongodb&logoColor=47A248" alt="MongoDB Atlas"/> <img src="https://img.shields.io/badge/OpenAI%20Embeddings-0D1117?style=flat-square&logo=openai&logoColor=FFFFFF" alt="OpenAI embeddings"/> <img src="https://img.shields.io/badge/MCP%20Server-0D1117?style=flat-square&logo=anthropic&logoColor=8957E5" alt="MCP server"/> <img src="https://img.shields.io/badge/Stripe-0D1117?style=flat-square&logo=stripe&logoColor=635BFF" alt="Stripe"/> <img src="https://img.shields.io/badge/Cloud%20Run-0D1117?style=flat-square&logo=googlecloud&logoColor=4285F4" alt="Cloud Run"/> <img src="https://img.shields.io/badge/Cloudflare%20R2-0D1117?style=flat-square&logo=cloudflare&logoColor=F38020" alt="Cloudflare R2"/>

---

# Open source

Eight packages, **83 stars**, all PHP. Each one exists because I hit the problem on a real project, went looking for the fix, and did not find one that worked properly.

<table>
<tr>
<td width="50%" valign="top">

### [nexus-inventory](https://github.com/malikad778/nexus-inventory)

<img src="https://img.shields.io/github/stars/malikad778/nexus-inventory?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/nexus-inventory?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Stock sync for Laravel across Shopify, WooCommerce, Amazon and Etsy. The easy part is the webhooks. The real part is what happens when two channels sell the last unit inside the same second.

`Laravel 10-12` &nbsp;`Webhooks` &nbsp;`Job queues`

</td>
<td width="50%" valign="top">

### [php-sentinel](https://github.com/malikad778/php-sentinel)

<img src="https://img.shields.io/github/stars/malikad778/php-sentinel?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/php-sentinel?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Watches the JSON a third party actually sends you and infers its shape over time. When a field quietly disappears or changes type, you hear about it from this instead of from a customer.

`PHP 8.3+` &nbsp;`Schema drift` &nbsp;`MIT`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [Laravel-migration-guard](https://github.com/malikad778/Laravel-migration-guard)

<img src="https://img.shields.io/github/stars/malikad778/Laravel-migration-guard?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/Laravel-migration-guard?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Reads your migrations in CI and fails the build on the ones that take a table lock or drop a column with data behind it. Zero config. Rails has `strong_migrations`; Laravel did not.

`AST parser` &nbsp;`CI gate` &nbsp;`Zero config`

</td>
<td width="50%" valign="top">

### [wp-hook-check](https://github.com/malikad778/wp-hook-check)

<img src="https://img.shields.io/github/stars/malikad778/wp-hook-check?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/wp-hook-check?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Orphaned listeners, unheard hooks, misspelled action names. Finds all three by reading source, without ever bootstrapping WordPress, so it is fast enough to run on every commit.

`PHP CLI` &nbsp;`WordPress` &nbsp;`Static analysis`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [notification-center](https://github.com/malikad778/notification-center)

<img src="https://img.shields.io/github/stars/malikad778/notification-center?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/notification-center?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Multi&#8209;channel dispatch for Laravel 12. When a provider starts timing out the breaker trips and reroutes, instead of parking twenty workers on a dead endpoint until the queue backs up.

`Laravel 12` &nbsp;`Circuit breaker` &nbsp;`Telemetry`

</td>
<td width="50%" valign="top">

### [blade-access](https://github.com/malikad778/blade-access)

<img src="https://img.shields.io/github/stars/malikad778/blade-access?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/blade-access?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

73 WCAG 2.1 AA rules for Blade and Livewire, aimed at the European Accessibility Act. Ships a baseline file, because a linter that turns a legacy codebase red on day one just gets switched off.

`WCAG 2.1 AA` &nbsp;`Baseline` &nbsp;`CI`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [ai-mcp](https://github.com/malikad778/ai-mcp)

<img src="https://img.shields.io/github/stars/malikad778/ai-mcp?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/ai-mcp?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Makes a WordPress site readable by AI agents. Semantic chunking, FAQ extraction, media and author indexing, `llms.txt` and an MCP manifest, all over REST.

`MCP` &nbsp;`WordPress` &nbsp;`REST`

</td>
<td width="50%" valign="top">

### [woocommerce-otp-auth-engine](https://github.com/malikad778/woocommerce-otp-auth-engine)

<img src="https://img.shields.io/github/stars/malikad778/woocommerce-otp-auth-engine?style=flat-square&labelColor=0D1117&color=D29922&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/woocommerce-otp-auth-engine?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Gates OTP *before* the user row is written, so bots never create the account at all. Includes SMS pumping and AIT fraud defence, which is the bill most OTP plugins leave you to find out about.

`WooCommerce` &nbsp;`Fraud defence` &nbsp;`Multisite`

</td>
</tr>
</table>

---

# Stack

<table>
<tr><td valign="middle"><b>CORE</b></td><td><img src="https://img.shields.io/badge/PHP%208.2%20%2F%208.3%20%2F%208.4-0D1117?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="PHP"/><img src="https://img.shields.io/badge/Laravel%2011%20%2F%2012-102138?style=for-the-badge&logo=laravel&logoColor=FF8A80" alt="Laravel"/><img src="https://img.shields.io/badge/Filament%203-133059?style=for-the-badge&logo=filament&logoColor=FFD27A" alt="Filament"/><img src="https://img.shields.io/badge/Livewire-16407A?style=for-the-badge&logo=livewire&logoColor=FFC3DE" alt="Livewire"/><img src="https://img.shields.io/badge/TypeScript-1F6FEB?style=for-the-badge&logo=typescript&logoColor=FFFFFF" alt="TypeScript"/></td></tr>
<tr><td valign="middle"><b>DATA</b></td><td><img src="https://img.shields.io/badge/MySQL%208-0D1117?style=for-the-badge&logo=mysql&logoColor=9FC4E8" alt="MySQL"/><img src="https://img.shields.io/badge/PostgreSQL-102138?style=for-the-badge&logo=postgresql&logoColor=A8BFF0" alt="PostgreSQL"/><img src="https://img.shields.io/badge/MongoDB%20Atlas-133059?style=for-the-badge&logo=mongodb&logoColor=8FD9A8" alt="MongoDB Atlas"/><img src="https://img.shields.io/badge/Redis%20%2B%20Horizon-16407A?style=for-the-badge&logo=redis&logoColor=FF9C93" alt="Redis and Horizon"/><img src="https://img.shields.io/badge/Upstash-1F6FEB?style=for-the-badge&logo=upstash&logoColor=FFFFFF" alt="Upstash"/></td></tr>
<tr><td valign="middle"><b>INFRA</b></td><td><img src="https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=8FC5F5" alt="Docker"/><img src="https://img.shields.io/badge/Cloud%20Run-102138?style=for-the-badge&logo=googlecloud&logoColor=A3C2F5" alt="Cloud Run"/><img src="https://img.shields.io/badge/Cloudflare%20R2-133059?style=for-the-badge&logo=cloudflare&logoColor=FFB870" alt="Cloudflare R2"/><img src="https://img.shields.io/badge/Nginx-16407A?style=for-the-badge&logo=nginx&logoColor=7FD9A8" alt="Nginx"/><img src="https://img.shields.io/badge/GitHub%20Actions-1F6FEB?style=for-the-badge&logo=githubactions&logoColor=FFFFFF" alt="GitHub Actions"/></td></tr>
<tr><td valign="middle"><b>FRONT</b></td><td><img src="https://img.shields.io/badge/Next.js%2014%20%2F%2015-0D1117?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF" alt="Next.js"/><img src="https://img.shields.io/badge/React-102138?style=for-the-badge&logo=react&logoColor=9BE7FA" alt="React"/><img src="https://img.shields.io/badge/Tailwind-133059?style=for-the-badge&logo=tailwindcss&logoColor=7FDBEA" alt="Tailwind"/><img src="https://img.shields.io/badge/Alpine.js-16407A?style=for-the-badge&logo=alpinedotjs&logoColor=BFDCE8" alt="Alpine.js"/><img src="https://img.shields.io/badge/GrapesJS-1F6FEB?style=for-the-badge&logo=javascript&logoColor=FFFFFF" alt="GrapesJS"/></td></tr>
<tr><td valign="middle"><b>APIS</b></td><td><img src="https://img.shields.io/badge/Meta%20Graph-0D1117?style=for-the-badge&logo=meta&logoColor=7FBFFF" alt="Meta Graph"/><img src="https://img.shields.io/badge/WhatsApp%20Cloud-102138?style=for-the-badge&logo=whatsapp&logoColor=8FE8AC" alt="WhatsApp Cloud"/><img src="https://img.shields.io/badge/Stripe%20%2B%20Connect-133059?style=for-the-badge&logo=stripe&logoColor=B8B0F5" alt="Stripe and Connect"/><img src="https://img.shields.io/badge/OpenAI-16407A?style=for-the-badge&logo=openai&logoColor=FFFFFF" alt="OpenAI"/><img src="https://img.shields.io/badge/MCP-1F6FEB?style=for-the-badge&logo=anthropic&logoColor=FFFFFF" alt="Model Context Protocol"/></td></tr>
<tr><td valign="middle"><b>TEST</b></td><td><img src="https://img.shields.io/badge/PHPUnit%2011-0D1117?style=for-the-badge&logo=phpunit&logoColor=8FD9A8" alt="PHPUnit"/><img src="https://img.shields.io/badge/nikic%2Fphp--parser-102138?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="nikic/php-parser"/><img src="https://img.shields.io/badge/Mockery-133059?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="Mockery"/><img src="https://img.shields.io/badge/Pint-16407A?style=for-the-badge&logo=laravel&logoColor=FF8A80" alt="Pint"/><img src="https://img.shields.io/badge/composer%20audit-1F6FEB?style=for-the-badge&logo=composer&logoColor=FFFFFF" alt="composer audit"/></td></tr>
</table>

---

# The code itself

<div align="center">

<img src="https://img.shields.io/badge/778-CONTRIBUTIONS%20·%2012%20MONTHS-0D1117?style=for-the-badge&labelColor=1F6FEB" alt="778 contributions in 12 months"/> <img src="https://img.shields.io/badge/83-STARS%20ON%20PACKAGES-0D1117?style=for-the-badge&labelColor=D29922" alt="83 stars on packages"/> <img src="https://img.shields.io/badge/13-PUBLIC%20REPOS%20·%20NO%20FORKS-0D1117?style=for-the-badge&labelColor=8957E5" alt="13 public repos, no forks"/>

<br/><br/>

<img src="https://streak-stats.demolab.com?user=malikad778&hide_border=true&background=0D1117&stroke=21262D&ring=1F6FEB&fire=8957E5&currStreakLabel=F0F6FC&sideLabels=8B949E&dates=6E7681&currStreakNum=F0F6FC&sideNums=F0F6FC" alt="Contribution streak"/>

</div>

### Language split across the eight packages, by source bytes

<img src="https://img.shields.io/badge/PHP%20·%2087.1%25-777BB4?style=flat-square" alt="PHP 87.1 percent"/><img src="https://img.shields.io/badge/6.6-FF2D20?style=flat-square" alt="Blade 6.6 percent"/><img src="https://img.shields.io/badge/3.5-1F6FEB?style=flat-square" alt="JavaScript 3.5 percent"/><img src="https://img.shields.io/badge/2.8-8957E5?style=flat-square" alt="CSS and HTML 2.8 percent"/>

**PHP 87.1%** &nbsp;·&nbsp; Blade 6.6% &nbsp;·&nbsp; JavaScript 3.5% &nbsp;·&nbsp; CSS and HTML 2.8%

Measured across the eight packages, not every repo on the account. Counting everything puts JavaScript on top at 33.6%, which is just my portfolio site's vendored assets talking. The number that means something is the one over code other people run in their own CI.

---

# How I work

**A test that never disagrees with you is decoration.** Write the one that fails when the invariant breaks, not the one that passes today. In a multi&#8209;tenant system the tests worth having are the ones that go red the second somebody collapses two axes into one.

**Fail loudly at the boundary, gracefully in the middle.** Reject a malformed payload at ingestion, where it is cheap and you still have the context. The alternative is a half&#8209;written row three services deep that a customer finds for you next week.

**Write down the deviation and the reason.** Plans are wrong in places. Six months later the useful artefact is not the plan, it is knowing why the code went the other way and what would have to change for the original idea to work.

**Comments explain why. Code explains what.** If a block needs a comment to say what it does, rewrite the block. Save the comments for the constraints you cannot see from the syntax, like a port collision that presents as an auth error.

---

<div align="center">

<img src="https://img.shields.io/badge/OPEN%20TO%20BACKEND%20AND%20PLATFORM%20WORK-0D1117?style=for-the-badge&labelColor=1B7F3B" alt="Open to backend and platform work"/>

### Laravel · PHP · multi&#8209;tenant SaaS · integration&#8209;heavy systems

Based in Pakistan, working remotely.

**[adnanhaider0347@gmail.com](mailto:adnanhaider0347@gmail.com)** &nbsp;·&nbsp; **[codebyadnan.tech](https://codebyadnan.tech)** &nbsp;·&nbsp; **[LinkedIn](https://www.linkedin.com/in/adnan-haider/)**

</div>
