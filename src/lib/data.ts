export interface RoadmapItem {
    text: string;
    build: boolean;
}

export interface RoadmapSection {
    title: string;
    items: RoadmapItem[];
}

export interface RoadmapPhase {
    phase: string;
    title: string;
    tag: string;
    duration: string;
    color: string;
    why: string;
    sections: RoadmapSection[];
}

export const roadmap: RoadmapPhase[] = [
    {
        phase: "01",
        title: "Operating System",
        tag: "CS Foundations",
        duration: "Week 1–2",
        color: "#e8c547",
        why: "Explains Node.js behavior at the deepest level. Every async question traces back to here.",
        sections: [
            {
                title: "Core Concepts",
                items: [
                    { text: "Processes vs Threads — memory space, stack, heap, why they're isolated", build: false },
                    { text: "Context switching — what the CPU does when switching between processes", build: false },
                    { text: "PCB (Process Control Block) — what the OS stores per process", build: false },
                    { text: "User space vs Kernel space — why syscalls cross this boundary", build: false },
                    { text: "System calls — read, write, open, close — what Node actually calls for I/O", build: false },
                    { text: "File descriptors — everything in Linux is a file, sockets are FDs too", build: false },
                    { text: "Virtual memory — address spaces, page tables, why each process thinks it owns RAM", build: false },
                    { text: "Heap vs Stack in memory — who manages each, what lives where", build: false },
                    { text: "Memory-mapped files — how OS loads executables and shared libs", build: false },
                ],
            },
            {
                title: "Concurrency & Sync",
                items: [
                    { text: "CPU scheduling — preemptive, round-robin, priority, CFS (Linux default)", build: false },
                    { text: "Deadlocks — 4 conditions (Coffman), prevention vs detection", build: false },
                    { text: "Race conditions — what they are, why they're hard to reproduce", build: false },
                    { text: "Mutex vs Semaphore vs Spinlock — when each is appropriate", build: false },
                    { text: "Condition variables — waiting and signaling between threads", build: false },
                    { text: "IPC — pipes, Unix sockets, shared memory, message queues", build: false },
                ],
            },
            {
                title: "Signals & I/O",
                items: [
                    { text: "Signals — SIGTERM, SIGKILL, SIGINT, SIGUSR1, SIGHUP", build: false },
                    { text: "Graceful shutdown in Node — catching SIGTERM, draining connections", build: false },
                    { text: "Blocking vs Non-blocking I/O — the fundamental difference", build: false },
                    { text: "Synchronous vs Asynchronous I/O — not the same as blocking/non-blocking", build: false },
                    { text: "epoll (Linux) — how the kernel notifies about I/O readiness, what libuv uses", build: false },
                    { text: "The /proc filesystem — explore /proc/self, /proc/[pid]/fd live", build: false },
                ],
            },
            {
                title: "Build: OS Concepts in Node",
                items: [
                    { text: "Write a Node script that catches SIGTERM and does graceful shutdown", build: true },
                    { text: "Use process.memoryUsage() and track heap across operations", build: true },
                    { text: "Spawn child processes with child_process, observe in htop", build: true },
                    { text: "Read /proc/self/fd in Linux — see your open file descriptors", build: true },
                ],
            },
        ],
    },
    {
        phase: "02",
        title: "Computer Networks",
        tag: "CS Foundations",
        duration: "Week 3–5",
        color: "#e8c547",
        why: "You build networked systems daily. Not knowing TCP/HTTP deeply is like building a house without knowing what walls do.",
        sections: [
            {
                title: "The Stack",
                items: [
                    { text: "OSI model — all 7 layers, what each does, which ones you actually touch", build: false },
                    { text: "TCP/IP model — how it maps to OSI, why it won", build: false },
                    { text: "IP addressing — IPv4, subnets, CIDR notation, private ranges", build: false },
                    { text: "DNS — resolution chain (recursive vs authoritative), A/CNAME/MX/TXT records, TTL", build: false },
                    { text: "DNS propagation — why deploys can have a delay, how to check with dig", build: false },
                ],
            },
            {
                title: "TCP Deep Dive",
                items: [
                    { text: "3-way handshake — SYN, SYN-ACK, ACK, what each means", build: false },
                    { text: "4-way teardown — FIN, FIN-ACK, why it's asymmetric", build: false },
                    { text: "TCP vs UDP — reliability tradeoffs, when UDP wins (DNS, video, games)", build: false },
                    { text: "Flow control — sliding window, receiver buffer", build: false },
                    { text: "Congestion control — slow start, congestion avoidance, CUBIC", build: false },
                    { text: "TCP connection reuse — why keep-alive exists, what connection pooling saves", build: false },
                    { text: "TIME_WAIT state — why it exists, what happens if you run out of ports", build: false },
                    { text: "Nagle's algorithm — when it hurts latency, how to disable", build: false },
                ],
            },
            {
                title: "HTTP",
                items: [
                    { text: "HTTP/1.1 — request/response format, headers, methods, status codes", build: false },
                    { text: "HTTP/1.1 pipelining — why it failed, head-of-line blocking", build: false },
                    { text: "HTTP/2 — multiplexing, header compression (HPACK), streams, server push", build: false },
                    { text: "HTTP/3 — QUIC protocol, UDP-based, why it solves HOL blocking differently", build: false },
                    { text: "Keep-alive — persistent connections, how many requests share one TCP conn", build: false },
                    { text: "Content negotiation — Accept, Content-Type, charset", build: false },
                    { text: "Conditional requests — ETag, If-None-Match, Last-Modified, 304 Not Modified", build: false },
                    { text: "Cache-Control — max-age, no-cache, no-store, stale-while-revalidate, private/public", build: false },
                    { text: "CORS — why it exists, preflight OPTIONS request, how to configure properly", build: false },
                ],
            },
            {
                title: "TLS & Security",
                items: [
                    { text: "TLS handshake — ClientHello, ServerHello, certificate, key exchange", build: false },
                    { text: "Symmetric vs asymmetric encryption — why TLS uses both", build: false },
                    { text: "Certificate chain — root CA, intermediate CA, leaf cert, how browsers verify", build: false },
                    { text: "SNI (Server Name Indication) — how one IP serves multiple HTTPS domains", build: false },
                    { text: "TLS 1.2 vs 1.3 — fewer round trips, no RSA key exchange", build: false },
                    { text: "HSTS — forcing HTTPS, preload lists", build: false },
                ],
            },
            {
                title: "Build: Network Fundamentals",
                items: [
                    { text: "Use curl -v to inspect raw HTTP headers on your own projects", build: true },
                    { text: "Use dig and nslookup to trace DNS resolution of a domain", build: true },
                    { text: "Use Wireshark or tcpdump to capture a TCP handshake", build: true },
                    { text: "Build a raw TCP server with Node's net module (no http module)", build: true },
                    { text: "Implement a basic HTTP/1.1 parser from scratch — parse headers manually", build: true },
                    { text: "Set up Nginx locally as a reverse proxy in front of a Node app", build: true },
                ],
            },
        ],
    },
    {
        phase: "03",
        title: "Node.js Internals",
        tag: "Runtime Depth",
        duration: "Week 6–7",
        color: "#47e8a0",
        why: "You've been using Node for every project. Time to own it, not just use it.",
        sections: [
            {
                title: "Event Loop",
                items: [
                    { text: "V8 engine — JS compilation (JIT), hidden classes, inline caching", build: false },
                    { text: "libuv — the C library that handles async I/O, thread pool", build: false },
                    { text: "Event loop phases — timers → pending callbacks → idle → poll → check → close", build: false },
                    { text: "setTimeout vs setImmediate vs process.nextTick — exact execution order", build: false },
                    { text: "Microtask queue — Promise callbacks run before next event loop phase", build: false },
                    { text: "The thread pool — which operations use it (fs, crypto, dns.lookup)", build: false },
                    { text: "Blocking the event loop — what it means, how to detect with --prof", build: false },
                    { text: "Why CPU-intensive work kills Node performance", build: false },
                ],
            },
            {
                title: "Streams",
                items: [
                    { text: "Readable streams — flowing vs paused mode, events (data, end, error)", build: false },
                    { text: "Writable streams — write(), drain event, buffering", build: false },
                    { text: "Transform streams — duplex, modifying data in flight", build: false },
                    { text: "Backpressure — what it is, why it matters, pipe() handles it automatically", build: false },
                    { text: "Stream pipelines — pipeline() vs pipe(), error propagation", build: false },
                    { text: "Practical streams — reading large files without loading into memory", build: false },
                ],
            },
            {
                title: "Concurrency in Node",
                items: [
                    { text: "Worker threads — SharedArrayBuffer, Atomics, MessageChannel", build: false },
                    { text: "Cluster module — fork processes, share port, round-robin load balancing", build: false },
                    { text: "Child processes — spawn vs exec vs fork, stdin/stdout piping", build: false },
                    { text: "When to use workers vs cluster vs external queue", build: false },
                ],
            },
            {
                title: "Node Internals",
                items: [
                    { text: "Buffer — binary data, why it exists before TypedArrays, encoding", build: false },
                    { text: "EventEmitter — internals, max listeners, memory leak from unremoved listeners", build: false },
                    { text: "require() vs import — module caching, circular dependencies, ESM vs CJS", build: false },
                    { text: "process object — env, argv, exit codes, uncaughtException, unhandledRejection", build: false },
                    { text: "AsyncLocalStorage — request-scoped context without passing it everywhere", build: false },
                ],
            },
            {
                title: "Build: Node Internals",
                items: [
                    { text: "Log the order of: setTimeout(0), setImmediate, process.nextTick, Promise.resolve — predict before running", build: true },
                    { text: "Build a file processing pipeline using streams — read large CSV, transform, write output", build: true },
                    { text: "Implement a simple EventEmitter from scratch", build: true },
                    { text: "Use worker_threads to offload a CPU-heavy task (e.g. bcrypt, image resize)", build: true },
                    { text: "Profile a Node app with node --prof and node --prof-process", build: true },
                ],
            },
        ],
    },
    {
        phase: "04",
        title: "TypeScript Deep Dive",
        tag: "Language Depth",
        duration: "Week 8",
        color: "#47e8a0",
        why: "You use TS daily but probably stay in basic types. This is what separates TS users from TS developers.",
        sections: [
            {
                title: "Type System Internals",
                items: [
                    { text: "Structural vs nominal typing — why TS uses structural", build: false },
                    { text: "Type widening and narrowing — how TS infers and refines types", build: false },
                    { text: "Discriminated unions — the most useful pattern you're probably underusing", build: false },
                    { text: "Type guards — typeof, instanceof, in operator, custom guards", build: false },
                    { text: "Assertion functions — asserts x is T pattern", build: false },
                    { text: "const assertions — as const, readonly, literal types", build: false },
                ],
            },
            {
                title: "Advanced Types",
                items: [
                    { text: "Generics — constraints (extends), defaults, inference from usage", build: false },
                    { text: "Conditional types — T extends U ? X : Y, distributive behavior", build: false },
                    { text: "infer keyword — extract types inside conditional types", build: false },
                    { text: "Mapped types — { [K in keyof T]: ... }, remapping with as", build: false },
                    { text: "Template literal types — `${Prefix}${string}` for string patterns", build: false },
                    { text: "Build your own: Partial, Required, Readonly, Pick, Omit, ReturnType", build: false },
                    { text: "Recursive types — deeply nested structures, JSON type", build: false },
                ],
            },
            {
                title: "Compiler & Config",
                items: [
                    { text: "tsconfig options that matter — strict, target, lib, moduleResolution, paths", build: false },
                    { text: "Declaration files — .d.ts, DefinitelyTyped, writing your own", build: false },
                    { text: "Module augmentation — extending third-party types", build: false },
                    { text: "Project references — monorepo setup, composite builds", build: false },
                ],
            },
            {
                title: "Build: TS Muscle Memory",
                items: [
                    { text: "Implement a type-safe event emitter with full generic inference", build: true },
                    { text: "Build a Result<T, E> type (like Rust's Result) and use it for error handling", build: true },
                    { text: "Write DeepPartial<T>, DeepReadonly<T>, Flatten<T> from scratch", build: true },
                    { text: "Type a complex API response shape with discriminated unions", build: true },
                ],
            },
        ],
    },
    {
        phase: "05",
        title: "Databases",
        tag: "Data Layer",
        duration: "Week 9–11",
        color: "#e847a0",
        why: "Every app you've built uses a DB. You've used Prisma/Drizzle as a black box. Time to own the data layer.",
        sections: [
            {
                title: "PostgreSQL Internals",
                items: [
                    { text: "How Postgres stores data — heap files, pages (8KB blocks), tuples", build: false },
                    { text: "MVCC — Multi-Version Concurrency Control, how reads don't block writes", build: false },
                    { text: "Dead tuples and VACUUM — why table bloat happens, autovacuum", build: false },
                    { text: "WAL (Write-Ahead Log) — crash recovery, replication", build: false },
                    { text: "EXPLAIN and EXPLAIN ANALYZE — reading query plans, actual vs estimated rows", build: false },
                    { text: "Seq scan vs Index scan vs Bitmap scan — when Postgres chooses each", build: false },
                    { text: "Statistics and the query planner — ANALYZE, pg_stats", build: false },
                ],
            },
            {
                title: "Indexes",
                items: [
                    { text: "B-Tree indexes — structure, why range queries work, why it's the default", build: false },
                    { text: "Hash indexes — equality only, faster than B-tree for =", build: false },
                    { text: "GIN indexes — for JSONB, arrays, full-text search", build: false },
                    { text: "Partial indexes — index only a subset of rows, huge for soft deletes", build: false },
                    { text: "Composite indexes — column order matters, leftmost prefix rule", build: false },
                    { text: "Covering indexes — INCLUDE columns to avoid heap fetch", build: false },
                    { text: "When indexes hurt — write amplification, low-cardinality columns", build: false },
                    { text: "Index bloat — dead index entries, REINDEX", build: false },
                ],
            },
            {
                title: "Transactions",
                items: [
                    { text: "ACID — Atomicity, Consistency, Isolation, Durability — what each actually means", build: false },
                    { text: "Isolation levels — Read Uncommitted, Read Committed, Repeatable Read, Serializable", build: false },
                    { text: "Dirty reads, non-repeatable reads, phantom reads — which level prevents each", build: false },
                    { text: "Optimistic vs pessimistic locking — SELECT FOR UPDATE, version columns", build: false },
                    { text: "Deadlocks in Postgres — how they're detected, how to avoid", build: false },
                    { text: "Long transactions — why they're dangerous, lock contention, MVCC bloat", build: false },
                ],
            },
            {
                title: "Redis Internals",
                items: [
                    { text: "Single-threaded model — why it's fast, I/O multiplexing with epoll", build: false },
                    { text: "Data structures — strings, lists, hashes, sets, sorted sets, streams", build: false },
                    { text: "Sorted sets internals — skiplist + hashtable hybrid, O(log N) ops", build: false },
                    { text: "Expiry — how TTL works internally (lazy + periodic deletion)", build: false },
                    { text: "Eviction policies — LRU, LFU, allkeys vs volatile", build: false },
                    { text: "Persistence — RDB (snapshots) vs AOF (append-only log), tradeoffs", build: false },
                    { text: "Pub/Sub — fire-and-forget, no persistence, limitations", build: false },
                    { text: "Redis Streams — persistent pub/sub, consumer groups, XADD/XREAD", build: false },
                ],
            },
            {
                title: "Build: Data Layer",
                items: [
                    { text: "Write 20 raw SQL queries against a real schema — no ORM", build: true },
                    { text: "Run EXPLAIN ANALYZE on your Beatflow/ViralRot queries — find slow ones", build: true },
                    { text: "Add a partial index for a soft-delete pattern, verify with EXPLAIN", build: true },
                    { text: "Implement cursor-based pagination from scratch in raw SQL", build: true },
                    { text: "Implement a rate limiter using Redis sorted sets (sliding window)", build: true },
                    { text: "Build a leaderboard with Redis sorted sets — ZADD, ZRANK, ZRANGE", build: true },
                    { text: "Implement a distributed lock with Redis SETNX + expiry", build: true },
                ],
            },
        ],
    },
    {
        phase: "06",
        title: "Auth — The Full Picture",
        tag: "Security",
        duration: "Week 12–13",
        color: "#e84747",
        why: "Every project has auth. You've used NextAuth blindly. This is the section that will get you hired.",
        sections: [
            {
                title: "Cryptography Basics",
                items: [
                    { text: "Symmetric encryption — AES, same key for encrypt/decrypt", build: false },
                    { text: "Asymmetric encryption — RSA, public/private key pair, what each does", build: false },
                    { text: "Hashing — SHA-256, one-way, deterministic, why it's not encryption", build: false },
                    { text: "HMAC — keyed hash, why it proves authenticity + integrity", build: false },
                    { text: "Password hashing — bcrypt/argon2, salting, why MD5/SHA1 are dead", build: false },
                    { text: "Key derivation functions — PBKDF2, scrypt, argon2 — slow by design", build: false },
                ],
            },
            {
                title: "JWT Internals",
                items: [
                    { text: "JWT structure — header.payload.signature, base64url encoding", build: false },
                    { text: "Signing algorithms — HS256 (shared secret) vs RS256 (asymmetric)", build: false },
                    { text: "Standard claims — iss, sub, exp, iat, aud — what each means", build: false },
                    { text: "Why JWTs are stateless — and why that's a double-edged sword", build: false },
                    { text: "JWT revocation problem — can't invalidate without blocklist", build: false },
                    { text: "Where to store JWTs — httpOnly cookie vs localStorage tradeoffs", build: false },
                    { text: "Short-lived access tokens + refresh tokens — the standard pattern", build: false },
                    { text: "Refresh token rotation — token families, detecting reuse attacks", build: false },
                ],
            },
            {
                title: "OAuth2 & OIDC",
                items: [
                    { text: "OAuth2 roles — Resource Owner, Client, Authorization Server, Resource Server", build: false },
                    { text: "Authorization Code flow — the secure one, step by step", build: false },
                    { text: "PKCE — Proof Key for Code Exchange, why public clients need it", build: false },
                    { text: "Client Credentials flow — machine-to-machine, no user", build: false },
                    { text: "Access token vs ID token vs refresh token — what each is for", build: false },
                    { text: "OpenID Connect — OAuth2 + identity layer, ID token is a JWT", build: false },
                    { text: "NextAuth/Auth.js internals — what it does under the hood", build: false },
                ],
            },
            {
                title: "Security Attacks",
                items: [
                    { text: "CSRF — Cross-Site Request Forgery, how it works, SameSite cookie defense", build: false },
                    { text: "XSS — Stored vs Reflected vs DOM, Content-Security-Policy", build: false },
                    { text: "SQL injection — parameterized queries, why ORMs help but aren't enough", build: false },
                    { text: "Timing attacks — crypto.timingSafeEqual for secret comparison", build: false },
                    { text: "Brute force — rate limiting login, account lockout, CAPTCHA", build: false },
                ],
            },
            {
                title: "Build: Auth From Scratch",
                items: [
                    { text: "Implement JWT auth — sign, verify, refresh — no library except jsonwebtoken", build: true },
                    { text: "Implement Redis-backed sessions from scratch", build: true },
                    { text: "Build OAuth2 Authorization Code + PKCE flow manually (GitHub as provider)", build: true },
                    { text: "Implement refresh token rotation with token family blocklist in Redis", build: true },
                    { text: "Add rate limiting to a login endpoint with Redis sliding window", build: true },
                ],
            },
        ],
    },
    {
        phase: "07",
        title: "API Design & Patterns",
        tag: "Backend Craft",
        duration: "Week 14–15",
        color: "#4788e8",
        why: "You've built APIs in every project. This is about building them the right way.",
        sections: [
            {
                title: "REST Done Right",
                items: [
                    { text: "Resource naming — nouns not verbs, plural, nested vs flat", build: false },
                    { text: "Idempotency — GET/PUT/DELETE are idempotent, POST is not", build: false },
                    { text: "Idempotency keys — for POST endpoints that must not double-execute", build: false },
                    { text: "Status codes — 200/201/204/400/401/403/404/409/422/429/500/503", build: false },
                    { text: "Error response shape — consistent error body (code, message, details)", build: false },
                    { text: "API versioning — URI (/v1/) vs header versioning, tradeoffs", build: false },
                ],
            },
            {
                title: "Validation & Serialization",
                items: [
                    { text: "Zod deeply — transforms, refinements, superRefine, z.discriminatedUnion", build: false },
                    { text: "Input validation vs output serialization — two different concerns", build: false },
                    { text: "Never trust client data — validate at the boundary, always", build: false },
                    { text: "Schema-first API design — define contract before implementing", build: false },
                ],
            },
            {
                title: "Pagination & Rate Limiting",
                items: [
                    { text: "Offset pagination — simple, breaks at scale (OFFSET 10000 is slow)", build: false },
                    { text: "Cursor pagination — stable, efficient, opaque cursors", build: false },
                    { text: "Token bucket algorithm — bursts allowed, refill rate", build: false },
                    { text: "Sliding window algorithm — more accurate, Redis sorted set implementation", build: false },
                    { text: "Rate limit headers — X-RateLimit-Limit, Remaining, Reset, Retry-After", build: false },
                ],
            },
            {
                title: "Build: API Patterns",
                items: [
                    { text: "Build a REST API with proper error shapes, validation, and versioning", build: true },
                    { text: "Implement cursor-based pagination endpoint from scratch", build: true },
                    { text: "Build a rate limiter middleware (sliding window, Redis-backed)", build: true },
                    { text: "Implement idempotency key middleware for a payment-like endpoint", build: true },
                ],
            },
        ],
    },
    {
        phase: "08",
        title: "Error Handling & Observability",
        tag: "Production Craft",
        duration: "Week 16",
        color: "#4788e8",
        why: "Tutorial projects crash on unhandled errors. Production code doesn't. This separates you.",
        sections: [
            {
                title: "Error Handling Patterns",
                items: [
                    { text: "Operational vs programmer errors — different handling strategies", build: false },
                    { text: "Custom error classes — extend Error, add statusCode, isOperational", build: false },
                    { text: "Centralized error handler middleware in Express/Fastify", build: false },
                    { text: "Never expose stack traces in production responses", build: false },
                    { text: "process.on('uncaughtException') and 'unhandledRejection'", build: false },
                    { text: "Graceful shutdown — close server, drain connections, close DB pool", build: false },
                    { text: "Result pattern — returning errors as values instead of throwing", build: false },
                ],
            },
            {
                title: "Logging & Observability",
                items: [
                    { text: "Why console.log is not production logging", build: false },
                    { text: "Structured logging — JSON logs, machine-readable, queryable", build: false },
                    { text: "Pino — fastest Node logger, child loggers, log levels", build: false },
                    { text: "Correlation IDs — generate per-request, attach to all logs", build: false },
                    { text: "What to log — request/response (sanitized), errors, slow queries", build: false },
                    { text: "What not to log — passwords, tokens, PII", build: false },
                    { text: "OpenTelemetry — traces, spans, metrics, the standard", build: false },
                    { text: "Sentry — error tracking, source maps, release tracking", build: false },
                    { text: "Health check endpoints — liveness vs readiness probes", build: false },
                ],
            },
            {
                title: "Build: Production Error Handling",
                items: [
                    { text: "Add structured Pino logging with correlation IDs to an existing project", build: true },
                    { text: "Build a centralized error handler with custom error classes", build: true },
                    { text: "Implement graceful shutdown handling SIGTERM", build: true },
                    { text: "Add Sentry with proper source maps", build: true },
                    { text: "Add /health/live and /health/ready endpoints", build: true },
                ],
            },
        ],
    },
    {
        phase: "09",
        title: "Caching",
        tag: "Performance",
        duration: "Week 17",
        color: "#a047e8",
        why: "You used Redis in Beatflow but probably just as key-value. Caching done wrong creates bugs worse than no cache.",
        sections: [
            {
                title: "Caching Patterns",
                items: [
                    { text: "Cache hit vs miss — hit rate, what it means for performance", build: false },
                    { text: "Cache-aside (lazy loading) — app checks cache, falls back to DB", build: false },
                    { text: "Write-through — write to cache and DB simultaneously", build: false },
                    { text: "Write-behind (write-back) — write to cache, async write to DB", build: false },
                    { text: "Cache invalidation — the hard problem, strategies: TTL, event-based, version keys", build: false },
                    { text: "Cache stampede — many requests miss simultaneously, thundering herd", build: false },
                ],
            },
            {
                title: "HTTP & Application Caching",
                items: [
                    { text: "Cache-Control directives — max-age, no-cache, no-store, stale-while-revalidate", build: false },
                    { text: "ETag and conditional requests — how 304 Not Modified saves bandwidth", build: false },
                    { text: "CDN caching — Cloudflare cache rules, cache keys, purging", build: false },
                    { text: "Next.js caching layers — all 4 (request memo, data cache, full route, router)", build: false },
                    { text: "What to cache vs what not to cache", build: false },
                    { text: "Cache key design — namespacing, versioning, user-scoping", build: false },
                ],
            },
            {
                title: "Build: Caching",
                items: [
                    { text: "Add cache-aside caching to a DB query — measure latency before/after", build: true },
                    { text: "Implement cache invalidation on write", build: true },
                    { text: "Implement a memoization wrapper with Redis and TTL", build: true },
                    { text: "Fix a thundering herd problem with a Redis lock", build: true },
                ],
            },
        ],
    },
    {
        phase: "10",
        title: "Background Jobs & Queues",
        tag: "Async Systems",
        duration: "Week 18",
        color: "#a047e8",
        why: "You built distributed GPU pipelines in ViralRot — you already did this intuitively. Now understand it properly.",
        sections: [
            {
                title: "Why Queues",
                items: [
                    { text: "Decoupling — producer doesn't wait for consumer", build: false },
                    { text: "Reliability — jobs survive crashes, can be retried", build: false },
                    { text: "Backpressure — queue absorbs spikes, consumers process at their rate", build: false },
                    { text: "At-least-once vs exactly-once delivery — tradeoffs, idempotent consumers", build: false },
                    { text: "Dead letter queue — where failed jobs go after max retries", build: false },
                ],
            },
            {
                title: "BullMQ",
                items: [
                    { text: "Jobs and queues — adding, processing, priorities", build: false },
                    { text: "Delayed jobs — schedule for future, use cases", build: false },
                    { text: "Retries — exponential backoff, max attempts", build: false },
                    { text: "Job events — completed, failed, progress, stalled", build: false },
                    { text: "Concurrency — worker concurrency setting, rate limiting workers", build: false },
                    { text: "Flow — parent/child jobs, waiting for dependencies", build: false },
                    { text: "Bull Board — monitoring UI, job inspection", build: false },
                ],
            },
            {
                title: "Kafka & Webhooks",
                items: [
                    { text: "Topics and partitions — how data is organized and parallelized", build: false },
                    { text: "Consumer groups — load balancing across consumers", build: false },
                    { text: "Offsets — tracking position, replaying events", build: false },
                    { text: "When Kafka vs BullMQ — volume, durability, replay, team size", build: false },
                    { text: "Receiving webhooks reliably — respond 200 fast, process async", build: false },
                    { text: "Webhook signature verification — HMAC-SHA256", build: false },
                ],
            },
            {
                title: "Build: Async Systems",
                items: [
                    { text: "Add BullMQ to an existing project — offload email or image processing", build: true },
                    { text: "Implement retry with exponential backoff and dead letter queue", build: true },
                    { text: "Build a webhook receiver — verify signature, queue processing, idempotency", build: true },
                    { text: "Add Bull Board UI to monitor your queues", build: true },
                ],
            },
        ],
    },
    {
        phase: "11",
        title: "WebSockets & Real-time",
        tag: "Real-time Systems",
        duration: "Week 19",
        color: "#47e8e8",
        why: "You built SketchWiz with WebSockets. Do you know what happens under the hood?",
        sections: [
            {
                title: "WebSocket Internals",
                items: [
                    { text: "HTTP Upgrade handshake — Sec-WebSocket-Key, Sec-WebSocket-Accept header", build: false },
                    { text: "WebSocket framing — FIN bit, opcodes (text/binary/ping/pong/close), masking", build: false },
                    { text: "Ping/pong — heartbeat mechanism, detecting dead connections", build: false },
                    { text: "Reconnection logic — exponential backoff, jitter, preserving state", build: false },
                    { text: "Backpressure in WebSockets — bufferedAmount, pausing sends", build: false },
                ],
            },
            {
                title: "Scaling WebSockets",
                items: [
                    { text: "Sticky sessions — why stateful connections break with multiple servers", build: false },
                    { text: "Redis adapter for Socket.io — broadcasting across server instances", build: false },
                    { text: "Presence systems — tracking who's online, TTL-based heartbeats in Redis", build: false },
                    { text: "Connection limits — OS file descriptor limits, ulimit", build: false },
                    { text: "SSE (Server-Sent Events) — one-way, HTTP/2-friendly, auto-reconnect", build: false },
                ],
            },
            {
                title: "Build: Real-time",
                items: [
                    { text: "Build a raw WebSocket server with Node's ws library — no Socket.io", build: true },
                    { text: "Implement ping/pong heartbeat with auto-disconnect for dead clients", build: true },
                    { text: "Scale a WebSocket chat to 2 servers using Redis pub/sub adapter", build: true },
                    { text: "Build a presence system — who's online — with Redis and TTL", build: true },
                    { text: "Implement an SSE endpoint for real-time notifications", build: true },
                ],
            },
        ],
    },
    {
        phase: "12",
        title: "Infrastructure & DevOps",
        tag: "Deployment",
        duration: "Week 20–21",
        color: "#e8a047",
        why: "You have Docker + Nginx + Digital Ocean on your resume. Time to actually own it.",
        sections: [
            {
                title: "Docker Deep Dive",
                items: [
                    { text: "Docker internals — namespaces + cgroups, what containers actually are", build: false },
                    { text: "Image layers — how they stack, layer caching, why order matters in Dockerfile", build: false },
                    { text: "Multi-stage builds — separate build/runtime, minimize final image size", build: false },
                    { text: "Docker networking — bridge, host, overlay networks, DNS between containers", build: false },
                    { text: "Docker volumes — named vs bind mounts, data persistence, backups", build: false },
                    { text: "Docker Compose — depends_on, healthcheck, env files, profiles", build: false },
                    { text: "Running as non-root user — security best practice", build: false },
                ],
            },
            {
                title: "Nginx & CI/CD",
                items: [
                    { text: "Nginx architecture — master process, worker processes, event-driven", build: false },
                    { text: "Reverse proxy config — proxy_pass, proxy headers, X-Forwarded-For", build: false },
                    { text: "SSL termination — handling HTTPS at Nginx, passing HTTP to app", build: false },
                    { text: "Load balancing — upstream block, round-robin, least_conn, ip_hash", build: false },
                    { text: "GitHub Actions — workflow syntax, triggers, jobs, steps, secrets", build: false },
                    { text: "Zero-downtime deploys — rolling updates, blue/green, health checks", build: false },
                ],
            },
            {
                title: "Linux Fundamentals",
                items: [
                    { text: "Essential commands — ps, top, htop, kill, netstat, ss, lsof, strace", build: false },
                    { text: "Systemd — services, journalctl, enabling/disabling, ExecStart", build: false },
                    { text: "SSH — key-based auth, ssh-agent, port forwarding, tunneling", build: false },
                    { text: "Firewall basics — ufw, iptables basics, open ports carefully", build: false },
                ],
            },
            {
                title: "Build: Infrastructure",
                items: [
                    { text: "Optimize your Beatflow Dockerfile — multi-stage, minimize size", build: true },
                    { text: "Set up Nginx with SSL termination, rate limiting, WebSocket proxy from scratch", build: true },
                    { text: "Write a GitHub Actions pipeline — build → test → push Docker image → deploy", build: true },
                    { text: "Deploy a Node app on a fresh VPS with zero-downtime via Docker + Nginx", build: true },
                    { text: "Use strace to see system calls made by a running Node process", build: true },
                ],
            },
        ],
    },
    {
        phase: "13",
        title: "System Design",
        tag: "Interview Prep",
        duration: "Week 22–23",
        color: "#ff6b35",
        why: "This is what senior engineers and better companies test. Your projects give you real ammunition here.",
        sections: [
            {
                title: "Distributed Systems Fundamentals",
                items: [
                    { text: "CAP theorem — Consistency, Availability, Partition tolerance — you pick 2", build: false },
                    { text: "CP vs AP systems — real examples (Postgres vs Cassandra)", build: false },
                    { text: "Eventual consistency — DNS, shopping carts, social feeds", build: false },
                    { text: "Idempotency — why every distributed operation should be idempotent", build: false },
                    { text: "Distributed locks — when you need them, Redlock algorithm", build: false },
                    { text: "The fallacies of distributed computing — network is reliable, latency is zero…", build: false },
                ],
            },
            {
                title: "Scaling Patterns",
                items: [
                    { text: "Horizontal vs vertical scaling — when each works, why horizontal needs statelessness", build: false },
                    { text: "Load balancing algorithms — round-robin, least connections, consistent hashing", build: false },
                    { text: "Database read replicas — replication lag, read-after-write consistency problem", build: false },
                    { text: "Database sharding — range vs hash sharding, resharding pain", build: false },
                    { text: "CQRS — separate read/write models, when it's worth the complexity", build: false },
                ],
            },
            {
                title: "Classic System Design Problems",
                items: [
                    { text: "Design a URL shortener — hashing, redirects, analytics, scale", build: false },
                    { text: "Design a rate limiter — algorithms, distributed, Redis implementation", build: false },
                    { text: "Design a notification system — fanout, push vs pull, delivery guarantees", build: false },
                    { text: "Design a real-time collaborative editor — CRDTs, OT, WebSockets", build: false },
                    { text: "Design ViralRot — explain your distributed GPU pipeline properly", build: false },
                    { text: "Design OpenFlowX — explain your event-driven workflow engine properly", build: false },
                ],
            },
            {
                title: "Build: System Design Practice",
                items: [
                    { text: "Draw architecture diagrams for all your existing projects", build: true },
                    { text: "Build a URL shortener from scratch — no tutorial, just requirements", build: true },
                    { text: "Build a notification fanout system with BullMQ", build: true },
                    { text: "Practice explaining ViralRot architecture in 10 minutes — every decision", build: true },
                    { text: "Do 5 mock system design interviews — record yourself", build: true },
                ],
            },
        ],
    },
    {
        phase: "14",
        title: "DSA for Interviews",
        tag: "Interview Prep",
        duration: "Week 24–25",
        color: "#ff6b35",
        why: "Not for competitive programming. Just enough to pass technical screens at good companies.",
        sections: [
            {
                title: "Data Structures to Own",
                items: [
                    { text: "Arrays & strings — two pointers, sliding window patterns", build: false },
                    { text: "Hash maps — frequency counting, two-sum type problems", build: false },
                    { text: "Stacks — valid parentheses, monotonic stack", build: false },
                    { text: "Queues & deques — BFS, sliding window maximum", build: false },
                    { text: "Linked lists — reversal, cycle detection, merge sorted", build: false },
                    { text: "Binary trees — DFS/BFS traversal, LCA, depth problems", build: false },
                    { text: "Graphs — BFS/DFS, topological sort, union-find", build: false },
                    { text: "Heaps/Priority queues — top K elements, merge K sorted", build: false },
                ],
            },
            {
                title: "Algorithms & Patterns",
                items: [
                    { text: "Binary search — on arrays, on answer space", build: false },
                    { text: "Sliding window — fixed and variable size", build: false },
                    { text: "Two pointers — sorted arrays, palindromes", build: false },
                    { text: "BFS/DFS — know both, know when each is better", build: false },
                    { text: "Dynamic programming — memoization first, tabulation second, 10 classic problems", build: false },
                    { text: "Greedy — interval scheduling, activity selection", build: false },
                    { text: "Solve 60-80 LeetCode problems — easy + medium, patterns over quantity", build: false },
                    { text: "NeetCode 150 — curated list, covers all patterns", build: false },
                ],
            },
        ],
    },
    {
        phase: "15",
        title: "Build to Own",
        tag: "Final Mile",
        duration: "Week 26",
        color: "#00ff88",
        why: "Reading makes you recognize. Building makes you recall. These projects are chosen specifically to force you to combine everything you've learned — no hand-holding.",
        sections: [
            {
                title: "Tier 1 — Core Muscle Memory (2–4 hrs each)",
                items: [
                    { text: "URL Shortener — hashing, redirects, click analytics, Redis caching, Postgres persistence", build: true },
                    { text: "JWT Auth Service — sign, verify, refresh token rotation, token family blocklist in Redis, no library except jsonwebtoken", build: true },
                    { text: "Rate Limiter Middleware — sliding window algorithm, Redis sorted sets, pluggable as npm package", build: true },
                    { text: "Key-Value Store — in-memory with TTL, eviction policy (LRU), CLI interface", build: true },
                    { text: "Task Queue — BullMQ, retries with exponential backoff, dead letter queue, Bull Board UI", build: true },
                    { text: "File Upload Service — multipart upload, S3-compatible storage, presigned URLs, virus scan hook", build: true },
                ],
            },
            {
                title: "Tier 2 — System Depth (1–2 days each)",
                items: [
                    { text: "Real-time Chat — WebSocket rooms, Redis pub/sub for multi-server scaling, presence system, message history", build: true },
                    { text: "Notification Service — fanout on write vs read, BullMQ workers, email + webhook delivery, retry logic", build: true },
                    { text: "API Gateway — reverse proxy in Node, rate limiting per route, JWT verification, request logging", build: true },
                    { text: "Webhook Engine — receive events, verify HMAC signatures, queue processing, idempotency keys, retry with backoff", build: true },
                    { text: "Search Service — full-text search with Postgres tsvector, ranked results, autocomplete with trigrams", build: true },
                    { text: "Cron Job Scheduler — distributed cron, prevent duplicate execution with Redis locks, job history, failure alerts", build: true },
                ],
            },
            {
                title: "Tier 3 — Interview Gold (2–5 days each)",
                items: [
                    { text: "Twitter/X Feed — follow graph in Postgres, fanout on write, cursor pagination, Redis timeline cache", build: true },
                    { text: "Distributed Lock Service — Redlock algorithm, lease renewal, deadlock detection, HTTP API", build: true },
                    { text: "Event Sourcing Store — append-only event log, rebuild state from events, snapshots, replay API", build: true },
                    { text: "Metrics Collector — time-series data ingestion, aggregation (p50/p95/p99), Postgres storage, dashboard endpoint", build: true },
                    { text: "Collaborative Document Editor — operational transforms or CRDTs, WebSockets, conflict resolution, version history", build: true },
                    { text: "Video Processing Pipeline — upload → queue → transcode (FFmpeg) → store → stream, BullMQ workers, progress events", build: true },
                ],
            },
            {
                title: "Rules for Every Build",
                items: [
                    { text: "Zero AI for writing code — use docs, use MDN, use Postgres docs. AI only to explain errors after you've tried.", build: false },
                    { text: "Time yourself — if something takes 3x longer than expected, that's your next study target", build: false },
                    { text: "Write a README with architecture diagram and every tech decision explained", build: false },
                    { text: "Add structured logging, /health endpoint, and graceful shutdown to every project", build: false },
                    { text: "After finishing: explain the whole thing out loud in 5 minutes as if in an interview", build: false },
                ],
            },
        ],
    },
];

export function getItemKey(phaseIndex: number, sectionTitle: string, itemIndex: number): string {
    return `${phaseIndex}-${sectionTitle}-${itemIndex}`;
}

export function getTotalItems(): number {
    return roadmap.reduce((acc, phase) =>
        acc + phase.sections.reduce((sacc, s) => sacc + s.items.length, 0), 0);
}

export function getTotalBuildItems(): number {
    return roadmap.reduce((acc, phase) =>
        acc + phase.sections.reduce((sacc, s) =>
            sacc + s.items.filter((i) => i.build).length, 0), 0);
}