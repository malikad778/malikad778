<div align="center">

# Adnan Haider

### Senior Backend Engineer &nbsp;·&nbsp; Distributed Queues &nbsp;·&nbsp; Multitenant SaaS &nbsp;·&nbsp; AST Static Analysis

Six years of engineering high throughput backend infrastructure, resilient distributed queues, and multitenant architectures.
Specialized in the load bearing layers of production software: the webhook that cannot return a 502, the queue that must never drop a paid event,
the migration that would take an exclusive table lock at peak traffic, and the static analyzers that keep teams from introducing silent failures.

Founder of **[The Regret Index](https://regretindex.me)** (backed by Google Cloud for Startups & MongoDB for Startups). Author of 11 open source packages. 450+ delivered commercial projects.

<br/>

<a href="https://codebyadnan.tech"><img src="https://img.shields.io/badge/codebyadnan.tech-0D1117?style=for-the-badge&logo=googlechrome&logoColor=1F6FEB" alt="Portfolio"/></a>
<a href="https://www.linkedin.com/in/adnan-haider/"><img src="https://img.shields.io/badge/LinkedIn-0D1117?style=for-the-badge&logo=linkedin&logoColor=0A66C2" alt="LinkedIn"/></a>
<a href="https://regretindex.me"><img src="https://img.shields.io/badge/The%20Regret%20Index-0D1117?style=for-the-badge&logo=vercel&logoColor=8957E5" alt="The Regret Index"/></a>
<a href="https://packagist.org/packages/malikad778/"><img src="https://img.shields.io/badge/Packagist%20Packages-0D1117?style=for-the-badge&logo=packagist&logoColor=F28D1A" alt="Packagist"/></a>
<a href="https://www.npmjs.com/~askmalikadnan"><img src="https://img.shields.io/badge/npm%20Packages-0D1117?style=for-the-badge&logo=npm&logoColor=CB3837" alt="npm"/></a>
<a href="mailto:adnanhaider0347@gmail.com"><img src="https://img.shields.io/badge/Email-0D1117?style=for-the-badge&logo=gmail&logoColor=EA4335" alt="Email"/></a>

<br/><br/>

<img src="https://img.shields.io/badge/6%2B%20Years-Engineering-0D1117?style=flat-square&labelColor=1B7F3B&color=0D1117" alt="6+ Years Experience"/> <img src="https://img.shields.io/badge/450%2B-Projects%20Delivered-0D1117?style=flat-square&labelColor=1F6FEB&color=0D1117" alt="450+ Projects Delivered"/> <img src="https://img.shields.io/badge/11-Open%20Source%20Packages-0D1117?style=flat-square&labelColor=8957E5&color=0D1117" alt="11 Packages"/> <img src="https://img.shields.io/badge/Verified-5.0%20%E2%98%85%20Track%20Record-0D1117?style=flat-square&labelColor=D29922&color=0D1117" alt="5.0 Star Rating"/>

</div>

---

# Architecture Case Studies

## 1. Multitenant Proposal SaaS

### Turning a delivered single tenant document engine into a zero leak multitenant platform

Originally shipped as a single tenant proposal studio: GrapesJS visual canvas, a ~900 line server renderer, headless Chrome PDF generation via Spatie Browsershot, and cryptographic HMAC sealing. The challenge was converting it into a true multitenant SaaS without compromising security or breaking backward compatibility.

Tenancy is not a database query filter; it is an impenetrable security boundary. Every B2B data leak postmortem reveals the same root cause: someone treated tenant isolation as an optional query scope instead of an architectural invariant that queries cannot escape.

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
> `CompanyScope` applies **no filter at all** when no tenant resolves in context. That sounds counterintuitive, but it is deliberate so that background workers, migrations, and CLI maintenance commands function seamlessly. It is safe for exactly one architectural reason: `users.company_id` is defined as `NOT NULL`. An authenticated user session can never resolve to null and view global records. Make that column nullable, and the boundary collapses into a critical vulnerability.

### Five Invariants Defended with Automated Tests

| Invariant | System Failure Prevented |
|:--|:--|
| **Scope narrows, never swaps** | Team visibility is built strictly by *layering* on top of company scope, never by replacing it. Prevents cross tenant leaks. |
| **Fails open, deliberately** | Console commands and system queues continue running safely while `users.company_id` remains `NOT NULL`. |
| **Roles are per company** | Spatie's `team_foreign_key` explicitly targets `company_id`. Pointing it at `teams.id` causes permissions to bleed across tenants. |
| **Authorisation self scopes** | `User::can()` automatically binds to the user's active tenant, preventing silent `false` denials inside queues. |
| **Two distinct locale axes** | `users.locale` controls the sender's dashboard chrome; `proposals.locale` governs the legal rendered document (25 locales supported). |

### Concurrency Hardening & Cryptographic Sealing

Proposals become quasi legal contracts the second a client signs. To guarantee immutability:
- **HMAC-SHA256 Document Sealing:** Upon acceptance, the rendered HTML, CSS AST, signature bitmap, and client IP/user agent are serialized and cryptographically hashed with `APP_KEY`. Any manual database alteration invalidates the seal.
- **Queued PDF Pre Warming:** Headless Chrome rendering is isolated to asynchronous background queues (`SendProposalEmailJob`), pre warming the document cache upon status change so public downloads execute in milliseconds without spinning up headless Chrome on the web request thread.

<div align="left">
<img src="https://img.shields.io/badge/157%20tests-413%20assertions-0D1117?style=flat-square&labelColor=1B7F3B&logo=phpunit&logoColor=white" alt="157 tests, 413 assertions"/> <img src="https://img.shields.io/badge/PHPStan-Level%20Max-0D1117?style=flat-square&labelColor=1B7F3B&logo=php&logoColor=white" alt="PHPStan Max"/> <img src="https://img.shields.io/badge/composer%20audit-0%20advisories-0D1117?style=flat-square&labelColor=1B7F3B&logo=composer&logoColor=white" alt="composer audit clean"/> <img src="https://img.shields.io/badge/Laravel-11%20%2F%2012-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt="Laravel 12"/> <img src="https://img.shields.io/badge/Browsershot-5-0D1117?style=flat-square&logo=googlechrome&logoColor=8B949E" alt="Browsershot 5"/> <img src="https://img.shields.io/badge/Locales-25-0D1117?style=flat-square&logo=googletranslate&logoColor=8957E5" alt="25 locales"/>
</div>

---

## 2. [The Regret Index](https://regretindex.me)

### Solo Founder & Platform Architect · Backed by Google Cloud for Startups & MongoDB for Startups

A high scale decision journaling platform that quantifies decision quality, revisits outcomes on an automated schedule, and helps individuals calibrate intuition.

```mermaid
flowchart LR
    subgraph INGESTION["Multi Subreddit Ingestion"]
        CRON["GCP Cloud Scheduler"] --> RUN["GCP Cloud Run Worker"]
        RUN --> REDDIT["75+ Decision Subreddits<br/><i>9 Categories</i>"]
        REDDIT --> CHUNK["Semantic Chunker & Sanitizer"]
    end

    subgraph AI_PIPELINE["Dual Auditor AI Pipeline"]
        CHUNK --> V3["Vertex AI Gemini 3<br/><i>gemini-3.8-flash</i>"]
        V3 --> FACT["Fact-Checking & Claim Verification"]
        FACT --> IMAGEN["Vertex AI Imagen 3"]
    end

    subgraph STORAGE["Edge & Data Layer"]
        IMAGEN --> R2["Cloudflare R2 Storage"]
        FACT --> ATLAS["MongoDB Atlas<br/><i>22 Collections</i>"]
        USER["Web Client / Next.js 15"] --> UPSTASH["Upstash Redis<br/><i>Sliding Window</i>"]
        UPSTASH --> ATLAS
    end

    classDef c1 fill:#132E5C,stroke:#1F6FEB,stroke-width:1px,color:#F0F6FC
    classDef c2 fill:#2A1B4D,stroke:#8957E5,stroke-width:1px,color:#F0F6FC
    classDef c3 fill:#161B22,stroke:#30363D,color:#C9D1D9
    class INGESTION c1
    class AI_PIPELINE c2
    class STORAGE c3
```

### Architectural Highlights
- **Vertex AI Gemini 3 Migration:** Migrated the core reasoning pipeline from retiring Gemini 2.5 to GA Gemini 3 (`gemini-3.8-flash` for high throughput draft synthesis and `gemini-3.1-flash-image` for multimodal context extraction).
- **Automated Social Signal Ingestion:** Orchestrates GCP Cloud Scheduler and Cloud Run endpoints to systematically ingest and index decision outcomes across 75+ specialized subreddits in 9 categories, bypassing Cloudflare bot challenges through direct service networking.
- **Async Background Polling:** Implemented an asynchronous polling engine with sentence completion safeguards to prevent Cloudflare 524 gateway timeouts on deep analytical drafts up to 8,192 tokens.
- **Edge Storage & Caching:** Automated image synthesis via Vertex AI Imagen 3 with fallback SVG pipelines, stored in Cloudflare R2 and served through an Upstash Redis sliding window rate limiter.

<div align="left">
<img src="https://img.shields.io/badge/Next.js-15-0D1117?style=flat-square&logo=nextdotjs&logoColor=FFFFFF" alt="Next.js 15"/> <img src="https://img.shields.io/badge/TypeScript-Strict-0D1117?style=flat-square&logo=typescript&logoColor=3178C6" alt="TypeScript"/> <img src="https://img.shields.io/badge/MongoDB-Atlas-0D1117?style=flat-square&logo=mongodb&logoColor=47A248" alt="MongoDB Atlas"/> <img src="https://img.shields.io/badge/Google%20Vertex%20AI-Gemini%203-0D1117?style=flat-square&logo=googlecloud&logoColor=4285F4" alt="Vertex AI"/> <img src="https://img.shields.io/badge/Upstash-Redis-0D1117?style=flat-square&logo=redis&logoColor=DC382D" alt="Upstash Redis"/> <img src="https://img.shields.io/badge/Cloudflare-R2-0D1117?style=flat-square&logo=cloudflare&logoColor=F38020" alt="Cloudflare R2"/> <img src="https://img.shields.io/badge/Stripe-Connect%20%2B%20Billing-0D1117?style=flat-square&logo=stripe&logoColor=635BFF" alt="Stripe"/>
</div>

---

## 3. Meta Lead Ads to WhatsApp Cloud Engine

### Zero drop webhook ingestion with cryptographic verification & cronless queue draining

Meta does not wait for slow downstream queue workers. If an ingestion endpoint takes longer than a few hundred milliseconds, Meta marks the webhook unhealthy and throttles live advertising campaigns. Real work must never execute on the request thread.

```mermaid
sequenceDiagram
    autonumber
    participant M as Meta Lead Ads
    participant W as Webhook Endpoint
    participant D as MySQL / InnoDB
    participant Q as Redis Queue Worker
    participant A as WhatsApp Cloud API

    M->>W: POST lead payload
    W->>W: verify X-Hub-Signature-256 via hash_equals()
    W->>D: INSERT (unique meta_leadgen_id)
    Note over D: Replays collide here at schema level,<br/>not in mutable application code
    W-->>M: 200 OK (< 50ms)
    W->>Q: Dispatch FetchLeadDataJob + SendWhatsAppJob
    Q->>A: Send templated WhatsApp message
    A--xQ: 5xx Transient Error / Rate Limit
    Q->>Q: Time bounded exponential backoff
    Q->>A: Retry dispatch
    A-->>Q: 200 Delivered & Logged
```

### Key Engineering Decisions
- **Two Independent Integrity Gates:** The HMAC SHA-256 signature verification validates payload authenticity. A unique database index on `meta_leadgen_id` guarantees that webhook replays are rejected by the MySQL storage engine, where race conditions cannot bypass application logic.
- **Cronless Queue Draining (`DrainQueueAfterResponse`):** For environments where system level cron daemons or supervisor instances are restricted, an HTTP terminable middleware triggers background job processing immediately after the fast response is flushed to Meta.
- **Automatic Graph API Pagination:** Built into `PageManager` to transparently fetch high volume ad lead forms with System User token renewal safeguards.
- **Filament 3 Operational Hub:** Admin configurable campaign-to-recipient mappings, round robin lead allocation, and real time session health widgets.

<div align="left">
<img src="https://img.shields.io/badge/Meta%20Graph-v21.0-0D1117?style=flat-square&logo=meta&logoColor=0081FB" alt="Meta Graph"/> <img src="https://img.shields.io/badge/WhatsApp%20Cloud%20API-Production-0D1117?style=flat-square&logo=whatsapp&logoColor=25D366" alt="WhatsApp Cloud API"/> <img src="https://img.shields.io/badge/Laravel-11-0D1117?style=flat-square&logo=laravel&logoColor=FF2D20" alt="Laravel 11"/> <img src="https://img.shields.io/badge/Filament-3-0D1117?style=flat-square&logo=filament&logoColor=F59E0B" alt="Filament 3"/> <img src="https://img.shields.io/badge/Redis-Queue%20%2B%20Supervisor-0D1117?style=flat-square&logo=redis&logoColor=DC382D" alt="Redis"/>
</div>

---

# Open Source Packages & Developer Tooling

Active packages built to solve structural problems in production and published to Packagist, npm, and GitHub.

<table>
<tr>
<td width="50%" valign="top">
### [supabase-edge-guard](https://github.com/malikad778/supabase-edge-guard)

<img src="https://img.shields.io/badge/npm-v0.2.1-3ecf8e?style=flat-square&labelColor=0D1117&logo=npm&logoColor=3ecf8e" alt="npm version"/> <img src="https://img.shields.io/badge/Packagist-v0.2.1-F28D1A?style=flat-square&labelColor=0D1117&logo=packagist&logoColor=F28D1A" alt="Packagist version"/> <img src="https://img.shields.io/badge/CI-passing-3FB950?style=flat-square&labelColor=0D1117&logo=githubactions&logoColor=white" alt="CI status"/> <img src="https://img.shields.io/badge/SARIF%202.1.0-validated-orange?style=flat-square&labelColor=0D1117" alt="SARIF"/>

Cross-boundary static security analyzer and Row Level Security (RLS) auditor for Next.js, TanStack Start, Lovable (Vite), and Supabase apps. Correlates TypeScript AST with SQL migrations to catch critical vulnerabilities before deploy.

- 18 high-precision rules (SG001–SG018) detecting cookie spoofing, service_role leaks, SECURITY DEFINER RPCs, unindexed FKs, and RLS gaps
- Automated `--fix` engine generating TypeScript refactors and safe SQL migrations
- Ships with Model Context Protocol (MCP) server, SARIF 2.1.0 reporter, and GitHub Action

`TypeScript AST` &nbsp;`Supabase / Postgres` &nbsp;`RLS Auditor` &nbsp;`MCP Server`
</td>
<td width="50%" valign="top">
### [laravel-queue-guard](https://github.com/malikad778/laravel-queue-guard)

<img src="https://img.shields.io/badge/CI-passing-3FB950?style=flat-square&labelColor=0D1117&logo=githubactions&logoColor=white" alt="CI status"/> <img src="https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117" alt="license"/> <img src="https://img.shields.io/badge/rules-9%20detectors-1F6FEB?style=flat-square&labelColor=0D1117" alt="rules"/>

Zero-bootstrap static AST security analyzer and reliability linter for Laravel queues, Horizon, and background jobs. Prevents database connection exhaustion, money-losing non-idempotent retries, and race conditions before deploy.

- 9 specialized detectors (QG001–QG009) catching HTTP calls in DB transactions, financial retries, missing SerializesModels, and Horizon timeout drift
- Automated `--fix` safe code transforms and `@queue-safe` granular docblock exemptions
- Standalone CLI, PHPStan 2.x extension, SARIF 2.1.0, and GitHub Action annotations

`AST static analysis` &nbsp;`Laravel Horizon` &nbsp;`Distributed Queues` &nbsp;`PHPStan 2.x`
</td>
</tr>
<tr>
<td width="50%" valign="top">
### [laravel-tenant-guard](https://github.com/malikad778/laravel-tenant-guard)

<img src="https://img.shields.io/badge/CI-passing-3FB950?style=flat-square&labelColor=0D1117&logo=githubactions&logoColor=white" alt="CI status"/> <img src="https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117" alt="license"/>

Zero overhead static analysis and AST security scanner for multitenant Laravel SaaS applications. Prevents cross tenant data leaks across database queries, unique validation rules, cache collisions, Filament resources, queued jobs, and route bindings.

- 6 core security rules detecting raw DB queries, cache collisions, unisolated jobs, and unscoped routes
- Emits GitHub Action PR annotations, SARIF v2.1.0, and JSON reports
- Includes standalone zero bootstrap CLI and PHPStan 2.x extension

`AST static analysis` &nbsp;`Multitenant SaaS` &nbsp;`PHPStan 2.x`
</td>
<td width="50%" valign="top">
### [Laravel-migration-guard](https://github.com/malikad778/Laravel-migration-guard)

<img src="https://img.shields.io/packagist/dt/malikad778/laravel-migration-guard?style=flat-square&labelColor=0D1117&color=3FB950&logo=packagist&logoColor=3FB950" alt="Packagist downloads"/> <img src="https://img.shields.io/badge/stars-18-D29922?style=flat-square&labelColor=0D1117&logo=github&logoColor=D29922" alt="stars"/>

Catches dangerous, table locking, or destructive database migrations in CI before they reach production. The `strong_migrations` equivalent for Laravel. Uses `nikic/php-parser` for AST analysis. Zero configuration required.

- Detects `AddColumnNotNull`, unindexed foreign keys, column type changes, and table drops
- Emits GitHub Action PR annotations, JSON, and CLI reports
- Runtime safety listener intercepts accidental execution

`AST static analysis` &nbsp;`CI safety gate` &nbsp;`nikic/php-parser`
</td>
</tr>
<tr>
<td width="50%" valign="top">
### [php-sentinel](https://github.com/malikad778/php-sentinel)

<img src="https://img.shields.io/packagist/dt/malikad778/php-sentinel?style=flat-square&labelColor=0D1117&color=3FB950&logo=packagist&logoColor=3FB950" alt="Packagist downloads"/> <img src="https://img.shields.io/badge/stars-18-D29922?style=flat-square&labelColor=0D1117&logo=github&logoColor=D29922" alt="stars"/>

Passive API contract monitoring for strictly typed PHP 8.3+. Silently samples live HTTP payloads via Guzzle middleware, infers deep JSON Schema structures probabilistically, locks a hardened baseline, and alerts when upstream providers introduce breaking schema drift.

- Detects removed fields, type mutations, nullable drift, and enum additions
- Alerts via PSR-3 loggers and PSR-14 events before production code crashes
- Native integrations for Laravel, Symfony, and pure PHP CLI

`PHP 8.3+` &nbsp;`Schema drift detection` &nbsp;`Probabilistic inference`
</td>
<td width="50%" valign="top">
### [nexus-inventory](https://github.com/malikad778/nexus-inventory)

<img src="https://img.shields.io/packagist/dt/malikad778/nexus-inventory?style=flat-square&labelColor=0D1117&color=3FB950&logo=packagist&logoColor=3FB950" alt="Packagist downloads"/> <img src="https://img.shields.io/badge/stars-30-D29922?style=flat-square&labelColor=0D1117&logo=github&logoColor=D29922" alt="stars"/>

Unified, driver based Laravel package for multi channel inventory and catalog synchronization across Shopify, WooCommerce, Amazon SP-API, and Etsy.

- Drop in Composer package with zero third party SaaS dependency
- Custom `AwsV4Signer` implementation for Amazon SP-API compliance
- Token bucket rate limiting preventing channel API quota exhaustion
- Livewire monitoring dashboard with dead letter queue recovery

`Laravel 10 to 12` &nbsp;`Amazon SP-API` &nbsp;`Token bucket` &nbsp;`Webhooks`
</td>
</tr>
<tr>
<td width="50%" valign="top">
### [notification-center](https://github.com/malikad778/notification-center)

<img src="https://img.shields.io/badge/stars-8-D29922?style=flat-square&labelColor=0D1117&logo=github&logoColor=D29922" alt="stars"/> <img src="https://img.shields.io/github/last-commit/malikad778/notification-center?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Enterprise notification microservice and domain package built for Laravel 12 & PHP 8.4. Provides unified dispatching across 7 channels (Email, SMS, Push, Slack, WhatsApp, Reverb WebSockets, Database).

- Dual architecture: Standalone microservice or embeddable domain package
- Intelligent fallback routing: Tripping circuit breakers reroute messages to backup channels
- Custom Laravel Pulse telemetry cards monitoring delivery throughput

`Laravel 12` &nbsp;`PHP 8.4` &nbsp;`Circuit breaker` &nbsp;`Laravel Pulse`
</td>
<td width="50%" valign="top">
### [wp-hook-check](https://github.com/malikad778/wp-hook-check)

<img src="https://img.shields.io/packagist/dt/malikad778/wp-hook-check?style=flat-square&labelColor=0D1117&color=3FB950&logo=packagist&logoColor=3FB950" alt="Packagist downloads"/> <img src="https://img.shields.io/badge/stars-10-D29922?style=flat-square&labelColor=0D1117&logo=github&logoColor=D29922" alt="stars"/>

Static analysis for WordPress hooks. Detects orphaned listeners, unheard hooks, and typo ridden actions/filters by analyzing source code AST directly without booting WordPress.

- Runs fast enough to execute on every pre commit hook
- Detects dynamic hook patterns and generates comprehensive hook maps
- Ships with native WP-CLI package support (`wp hook-check audit`)

`WordPress` &nbsp;`Static analysis` &nbsp;`WP-CLI` &nbsp;`Zero bootstrap`
</td>
</tr>
<tr>
<td width="50%" valign="top">
### [woocommerce-otp-auth-engine](https://github.com/malikad778/woocommerce-otp-auth-engine)

<img src="https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117" alt="license"/> <img src="https://img.shields.io/github/last-commit/malikad778/woocommerce-otp-auth-engine?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Decoupled, high performance authentication and registration engine for WooCommerce and WordPress multisite.

- **3 Phase Transient Pipeline:** Gating registration before database insertion so spam bots never populate `wp_users`
- Multi identifier login (Email, Username, or Verified Phone)
- Defends against SMS pumping & Artificially Inflated Traffic (AIT) fraud
- WooCommerce checkout field locking prevents post auth identity tampering

`WooCommerce` &nbsp;`Fraud defense` &nbsp;`Transient pipeline` &nbsp;`Multisite`
</td>
<td width="50%" valign="top">
### [blade-access](https://github.com/malikad778/blade-access)

<img src="https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117" alt="license"/> <img src="https://img.shields.io/github/last-commit/malikad778/blade-access?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Static accessibility analyzer for Laravel Blade & Livewire views enforcing 73 WCAG 2.1 AA rules aligned with the European Accessibility Act (EAA).

- Parses Blade template directives without executing the rendering engine
- Ships with a baseline configuration system to prevent CI failure on legacy views
- Zero runtime dependencies

`WCAG 2.1 AA` &nbsp;`EAA compliance` &nbsp;`Blade linter` &nbsp;`Baseline system`
</td>
</tr>
<tr>
<td colspan="2" valign="top">
### [php-vs-go-benchmark](https://github.com/malikad778/php-vs-go-benchmark)

<img src="https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117" alt="license"/> <img src="https://img.shields.io/github/last-commit/malikad778/php-vs-go-benchmark?style=flat-square&labelColor=0D1117&color=1F6FEB" alt="last commit"/>

Comprehensive concurrency and throughput benchmark comparing modern PHP runtimes (RoadRunner, Swoole, PHP-FPM 8.3) against idiomatic Go under high concurrency.

- Measures p50, p95, p99 latency distributions, memory ceilings, and context switching
- Tests realistic real world workloads: JSON serialization, DB connection pooling, and hashing

`High concurrency` &nbsp;`Performance` &nbsp;`RoadRunner` &nbsp;`Go`
</td>
</tr>
</table>

---

# AI Agents & Model Context Protocol (MCP)

Building production systems that connect LLMs, autonomous agents, and real world tools via the **Model Context Protocol (MCP)**.

```mermaid
flowchart LR
    AGENT["AI Agent / Claude / Assistant"] -->|"Model Context Protocol<br/>JSON-RPC / SSE"| MCP_HUB{"MCP Server Layer"}
    
    MCP_HUB --> UPWORK["Upwork MCP Agent<br/><i>Job matching, scoring & WhatsApp alerts</i>"]
    MCP_HUB --> LINKEDIN["LinkedIn MCP Server<br/><i>Profile, company & job queries</i>"]
    MCP_HUB --> WP["WordPress AI MCP<br/><i>Semantic chunking & llms.txt</i>"]
    
    UPWORK --> WA["Meta WhatsApp Cloud API"]
    UPWORK --> AI["Vercel AI SDK<br/><i>Proposal synthesis</i>"]
```

### Systems in Production
- **[Job Alert Upwork MCP](https://github.com/malikad778/job-alert-upwork-mcp)**: Full stack monorepo (`@job-radar/web` + `@job-radar/jobs`) connecting directly to Upwork's official MCP server via `@modelcontextprotocol/sdk` and OAuth 2.1 Dynamic Client Registration. Evaluates jobs against strict criteria with a 0 to 100 matching engine, triggers automated proposal generation via the Vercel AI SDK, and delivers alerts to WhatsApp in real time. 100% TOS compliant zero scraping architecture.
- **[LinkedIn MCP Server](https://github.com/malikad778/linkedin-mcp-server)**: Open source MCP server giving AI agents direct tool calling access to professional profiles, companies, jobs, and communication channels. Dockerized with `uv`, Python, and AWS Bedrock support.
- **[WordPress AI MCP](https://github.com/malikad778/ai-mcp)**: Exposes any WordPress site to AI search agents over REST with semantic content chunking, FAQ extraction, media indexing, `llms.txt`, and full MCP manifests.
- **Self Hosted vLLM GPU Cloud Infrastructure**: Automated AWS EC2 lifecycle tooling managing GPU instances running vLLM inference server for open weights models (e.g., Qwen-Coder 30B), optimizing compute costs with automated elastic IP attachment and instance hibernation.

---

# Stealth Automation, Daemons & Extensions

Long running browser automation and system level telemetry engineered for stability, evasion, and zero leak operations.

- **Resilient Session Keepalive Daemon**: Stealth browser automation daemon operating under Linux systemd and Xvfb on AWS EC2. Built with Python, Playwright, and asyncio. Features state machine CAPTCHA resolution, Fernet encrypted session cookie storage, humanized jittered mouse/scroll behavioral simulations, and memory managed Chromium lifecycle recycling.
- **Consular Service Appointment Monitor**: Manifest V3 Chrome extension providing real time visa wait time calculation and tracking directly on diplomatic consular candidate portals with local only DOM parsing and zero external data transmission.
- **Network Telemetry & Fiber Health Monitor**: Multi threaded PowerShell system tray widget running in background STA runspaces with C# P/Invoke. Polls LAN HTTP router diagnostic endpoints to track live optical fiber health (Rx/Tx dBm, optical temperature, line latency) with zero WAN bandwidth impact.

---

# Cross Platform & Commercial Systems

- **Chapter Link Log**: Cross platform web and native iOS application built with TanStack Start (SSR), TanStack Router, TanStack Query, Tailwind CSS v4, Capacitor iOS, and Supabase.
- **[Pure Korea](https://github.com/malikad778/pure-korea)**: Korean skincare e-commerce platform built with Next.js, Firebase Firestore live sitemaps, JSON-LD rich schema markup, and Cloudflare Web Analytics.
- **European SME Enterprise Web Architecture**: Delivered production platforms and bespoke digital systems for precision craftsmanship, gastronomy, and retail businesses across European commercial markets.
- **Client Track Record**: 450+ completed projects across international clients on Upwork, top freelance platforms, and direct enterprise contracts with a verified 5.0★ rating.

---

# Stack

<table>
<tr><td valign="middle"><b>CORE</b></td><td><img src="https://img.shields.io/badge/PHP%208.2%20%2F%208.3%20%2F%208.4-0D1117?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="PHP"/><img src="https://img.shields.io/badge/Laravel%2011%20%2F%2012-102138?style=for-the-badge&logo=laravel&logoColor=FF8A80" alt="Laravel"/><img src="https://img.shields.io/badge/Filament%203-133059?style=for-the-badge&logo=filament&logoColor=FFD27A" alt="Filament"/><img src="https://img.shields.io/badge/Livewire-16407A?style=for-the-badge&logo=livewire&logoColor=FFC3DE" alt="Livewire"/><img src="https://img.shields.io/badge/TypeScript-1F6FEB?style=for-the-badge&logo=typescript&logoColor=FFFFFF" alt="TypeScript"/><img src="https://img.shields.io/badge/Python-3.11%2B-2A1B4D?style=for-the-badge&logo=python&logoColor=FFD43B" alt="Python"/></td></tr>
<tr><td valign="middle"><b>DATA</b></td><td><img src="https://img.shields.io/badge/MySQL%208-0D1117?style=for-the-badge&logo=mysql&logoColor=9FC4E8" alt="MySQL"/><img src="https://img.shields.io/badge/PostgreSQL-102138?style=for-the-badge&logo=postgresql&logoColor=A8BFF0" alt="PostgreSQL"/><img src="https://img.shields.io/badge/MongoDB%20Atlas-133059?style=for-the-badge&logo=mongodb&logoColor=8FD9A8" alt="MongoDB Atlas"/><img src="https://img.shields.io/badge/Redis%20%2B%20Horizon-16407A?style=for-the-badge&logo=redis&logoColor=FF9C93" alt="Redis and Horizon"/><img src="https://img.shields.io/badge/Upstash-1F6FEB?style=for-the-badge&logo=upstash&logoColor=FFFFFF" alt="Upstash"/></td></tr>
<tr><td valign="middle"><b>INFRA</b></td><td><img src="https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=8FC5F5" alt="Docker"/><img src="https://img.shields.io/badge/Cloud%20Run-102138?style=for-the-badge&logo=googlecloud&logoColor=A3C2F5" alt="Cloud Run"/><img src="https://img.shields.io/badge/Cloudflare%20R2-133059?style=for-the-badge&logo=cloudflare&logoColor=FFB870" alt="Cloudflare R2"/><img src="https://img.shields.io/badge/AWS%20EC2%20%2F%20S3-16407A?style=for-the-badge&logo=amazonwebservices&logoColor=FF9900" alt="AWS"/><img src="https://img.shields.io/badge/GitHub%20Actions-1F6FEB?style=for-the-badge&logo=githubactions&logoColor=FFFFFF" alt="GitHub Actions"/></td></tr>
<tr><td valign="middle"><b>FRONT</b></td><td><img src="https://img.shields.io/badge/Next.js%2015-0D1117?style=for-the-badge&logo=nextdotjs&logoColor=FFFFFF" alt="Next.js"/><img src="https://img.shields.io/badge/React%2019-102138?style=for-the-badge&logo=react&logoColor=9BE7FA" alt="React"/><img src="https://img.shields.io/badge/TanStack%20Start-133059?style=for-the-badge&logo=reactquery&logoColor=FF4154" alt="TanStack"/><img src="https://img.shields.io/badge/Tailwind%20v4-16407A?style=for-the-badge&logo=tailwindcss&logoColor=7FDBEA" alt="Tailwind"/><img src="https://img.shields.io/badge/Alpine.js-1F6FEB?style=for-the-badge&logo=alpinedotjs&logoColor=BFDCE8" alt="Alpine.js"/><img src="https://img.shields.io/badge/GrapesJS-2A1B4D?style=for-the-badge&logo=javascript&logoColor=FFFFFF" alt="GrapesJS"/></td></tr>
<tr><td valign="middle"><b>AI & MCP</b></td><td><img src="https://img.shields.io/badge/Model%20Context%20Protocol-0D1117?style=for-the-badge&logo=anthropic&logoColor=FFFFFF" alt="MCP"/><img src="https://img.shields.io/badge/Google%20Vertex%20AI-102138?style=for-the-badge&logo=googlecloud&logoColor=4285F4" alt="Vertex AI"/><img src="https://img.shields.io/badge/OpenAI%20API-133059?style=for-the-badge&logo=openai&logoColor=FFFFFF" alt="OpenAI"/><img src="https://img.shields.io/badge/vLLM%20Inference-16407A?style=for-the-badge&logo=nvidia&logoColor=76B900" alt="vLLM"/><img src="https://img.shields.io/badge/Vercel%20AI%20SDK-1F6FEB?style=for-the-badge&logo=vercel&logoColor=FFFFFF" alt="Vercel AI"/></td></tr>
<tr><td valign="middle"><b>TEST</b></td><td><img src="https://img.shields.io/badge/PHPUnit%2011-0D1117?style=for-the-badge&logo=phpunit&logoColor=8FD9A8" alt="PHPUnit"/><img src="https://img.shields.io/badge/nikic%2Fphp--parser-102138?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="nikic/php-parser"/><img src="https://img.shields.io/badge/PHPStan%20Max-133059?style=for-the-badge&logo=php&logoColor=BDB4E6" alt="PHPStan"/><img src="https://img.shields.io/badge/Pest-16407A?style=for-the-badge&logo=pestphp&logoColor=FF8A80" alt="Pest"/><img src="https://img.shields.io/badge/Playwright-1F6FEB?style=for-the-badge&logo=playwright&logoColor=2EAD33" alt="Playwright"/></td></tr>
</table>

---

# Engineering Philosophy

**A test that never disagrees with you is decoration.**
Write the test that fails when the invariant breaks, not the one that passes today. In a multitenant system, the tests worth having are the ones that go red the second someone collapses two tenant axes into one.

**Fail loudly at the boundary, gracefully in the middle.**
Reject a malformed payload at ingestion where validation is cheap and full request context exists. The alternative is a half written row three services deep that a customer finds for you next week.

**Write down the deviation and the reason.**
Specifications and plans are always incomplete in places. Six months later, the useful artefact is not the original plan; it is knowing why the implementation diverged and what constraints governed the choice.

**Comments explain why. Code explains what.**
If a block needs a comment to explain what it does, rewrite the block. Reserve comments for non obvious constraints you cannot deduce from syntax, such as an upstream provider bug that presents as an auth timeout.

---

<div align="center">

<img src="https://img.shields.io/badge/OPEN%20TO%20BACKEND%20%26%20PLATFORM%20ROLES-0D1117?style=for-the-badge&labelColor=1B7F3B" alt="Open to backend and platform roles"/>

### Laravel · PHP · Distributed Queues · Multitenant SaaS · AI & MCP Infrastructure

Based in Pakistan &nbsp;·&nbsp; Working remotely with teams worldwide

**[adnanhaider0347@gmail.com](mailto:adnanhaider0347@gmail.com)** &nbsp;·&nbsp; **[codebyadnan.tech](https://codebyadnan.tech)** &nbsp;·&nbsp; **[LinkedIn](https://www.linkedin.com/in/adnan-haider/)** &nbsp;·&nbsp; **[The Regret Index](https://regretindex.me)**

</div>
