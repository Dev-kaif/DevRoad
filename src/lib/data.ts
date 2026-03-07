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
        title: "Computer Architecture",
        tag: "CS Foundations",
        duration: "Week 1",
        color: "#e8c547",
        why: "Understanding how CPUs and memory actually work explains performance, concurrency, and system behavior at the deepest level.",
        sections: [
            {
                title: "CPU Fundamentals",
                items: [
                    { text: "CPU architecture — registers, ALU, control unit, instruction pipeline", build: false },
                    { text: "Instruction execution cycle — fetch, decode, execute, writeback", build: false },
                    { text: "Pipeline hazards — data hazards, control hazards, structural hazards", build: false },
                    { text: "Branch prediction — why mispredictions are expensive (pipeline flush cost)", build: false },
                    { text: "Out-of-order execution — how CPUs reorder instructions for performance", build: false },
                    { text: "Speculative execution — what it is, Spectre/Meltdown as consequences", build: false },
                    { text: "SIMD instructions — vectorized operations, why databases and media use them", build: false },
                    { text: "Hyper-threading — two logical cores per physical core, shared cache implications", build: false },
                ],
            },
            {
                title: "Memory Hierarchy",
                items: [
                    { text: "Cache hierarchy — L1 (~4 cycles), L2 (~12 cycles), L3 (~40 cycles), RAM (~200 cycles)", build: false },
                    { text: "Cache lines — 64 bytes, why reading one byte loads 64 bytes from memory", build: false },
                    { text: "Spatial locality — accessing nearby memory is fast (arrays beat linked lists)", build: false },
                    { text: "Temporal locality — recently accessed data likely accessed again soon", build: false },
                    { text: "Cache associativity — direct-mapped vs set-associative vs fully associative", build: false },
                    { text: "False sharing — two threads modifying different variables on the same cache line", build: false },
                    { text: "Memory latency numbers — cache hit ~1ns, RAM ~100ns, SSD ~100µs, HDD ~10ms", build: false },
                    { text: "NUMA — Non-Uniform Memory Access, CPU socket affinity in servers", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Benchmark sequential vs random array access — quantify cache miss penalty", build: true },
                    { text: "Demonstrate false sharing: two threads updating adjacent fields vs padded fields", build: true },
                    { text: "Matrix multiply: row-major vs column-major traversal — measure the difference", build: true },
                ],
            },
        ],
    },
    {
        phase: "02",
        title: "Operating Systems",
        tag: "CS Foundations",
        duration: "Week 2–3",
        color: "#e8c547",
        why: "Node.js and every backend system ultimately relies on OS primitives — processes, threads, memory management, and syscalls.",
        sections: [
            {
                title: "Processes & Threads",
                items: [
                    { text: "Processes vs threads — separate address space vs shared memory, stack per thread", build: false },
                    { text: "Context switching — what CPU state is saved/restored, cost in cycles", build: false },
                    { text: "Process Control Block (PCB) — what the OS tracks per process", build: false },
                    { text: "User space vs kernel space — why the boundary exists, syscall overhead", build: false },
                    { text: "System calls — read, write, open, close, socket — what Node calls under every I/O", build: false },
                    { text: "File descriptors — everything in Linux is a file, sockets and pipes are FDs", build: false },
                    { text: "CPU scheduling — preemptive scheduling, CFS (Completely Fair Scheduler) in Linux", build: false },
                    { text: "Process states — running, ready, blocked, zombie — what each means", build: false },
                ],
            },
            {
                title: "Memory Management",
                items: [
                    { text: "Virtual memory — address space abstraction, why each process thinks it owns all RAM", build: false },
                    { text: "Page tables — virtual to physical address translation, page table walk", build: false },
                    { text: "TLB — Translation Lookaside Buffer, cache for page table lookups", build: false },
                    { text: "Page faults — minor (page in memory, just unmapped) vs major (needs disk I/O)", build: false },
                    { text: "Heap vs stack — who allocates each, stack overflow, heap fragmentation", build: false },
                    { text: "Memory-mapped files — mmap(), how databases and executables use it", build: false },
                    { text: "Swap space — when RAM is full, why swap kills performance", build: false },
                    { text: "OOM killer — what Linux does when memory is exhausted, /proc/oom_score", build: false },
                ],
            },
            {
                title: "Concurrency & Synchronization",
                items: [
                    { text: "Race conditions — what they are, why they're non-deterministic and hard to reproduce", build: false },
                    { text: "Mutex — mutual exclusion, lock/unlock, priority inversion problem", build: false },
                    { text: "Semaphore — counting semaphore vs binary semaphore, signaling between threads", build: false },
                    { text: "Spinlock — busy-waiting, when it's faster than mutex (very short critical sections)", build: false },
                    { text: "Deadlock — 4 Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait", build: false },
                    { text: "Condition variables — waiting and signaling, spurious wakeups", build: false },
                    { text: "Signals — SIGTERM, SIGKILL, SIGINT, SIGUSR1, SIGHUP — semantics and handling", build: false },
                    { text: "IPC mechanisms — pipes, Unix domain sockets, shared memory, message queues", build: false },
                ],
            },
            {
                title: "I/O Models",
                items: [
                    { text: "Blocking vs non-blocking I/O — the fundamental distinction", build: false },
                    { text: "Synchronous vs asynchronous — orthogonal to blocking/non-blocking", build: false },
                    { text: "epoll (Linux) / kqueue (macOS) — kernel event notification, O(1) for N sockets", build: false },
                    { text: "io_uring — modern Linux async I/O, zero-copy, reduced syscall overhead", build: false },
                    { text: "/proc filesystem — /proc/self/fd, /proc/[pid]/status, live process introspection", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Write a Node script that catches SIGTERM, drains in-flight work, then exits cleanly", build: true },
                    { text: "Spawn child processes, observe them in htop, measure fork overhead vs thread spawn", build: true },
                    { text: "Read /proc/self/fd under different load — watch file descriptor count change", build: true },
                    { text: "strace a Node process — identify every syscall made for a single HTTP request", build: true },
                ],
            },
        ],
    },
    {
        phase: "03",
        title: "Linux Fundamentals",
        tag: "CS Foundations",
        duration: "Week 4",
        color: "#e8c547",
        why: "Production systems run on Linux. You cannot be a serious backend engineer without owning this environment.",
        sections: [
            {
                title: "Process & System Inspection",
                items: [
                    { text: "ps, top, htop — process list, CPU/memory per process, thread counts", build: false },
                    { text: "netstat, ss — network connections, listening ports, socket states (TIME_WAIT, CLOSE_WAIT)", build: false },
                    { text: "lsof — list open files, which process holds which FD or port", build: false },
                    { text: "strace — trace system calls, invaluable for diagnosing mysterious failures", build: false },
                    { text: "perf — Linux performance counters, CPU cycles, cache misses, branch mispredictions", build: false },
                    { text: "ulimit — per-process limits, especially file descriptors (Node needs high limits)", build: false },
                    { text: "vmstat, iostat — virtual memory stats, disk I/O utilization", build: false },
                    { text: "dmesg — kernel ring buffer, OOM kills, hardware errors", build: false },
                ],
            },
            {
                title: "System Management",
                items: [
                    { text: "systemd — unit files, ExecStart, Restart=always, After=network.target, environment files", build: false },
                    { text: "journalctl — structured logs, filter by unit, time range, priority level", build: false },
                    { text: "SSH — key-based auth, ssh-agent, port forwarding (-L, -R), ProxyJump", build: false },
                    { text: "ufw / iptables — firewall rules, default deny, opening specific ports", build: false },
                    { text: "cron and crontab — scheduled tasks, environment differences from shell", build: false },
                    { text: "Linux file permissions — rwx bits, chmod, chown, setuid, sticky bit", build: false },
                    { text: "Environment variables — /etc/environment, systemd EnvironmentFile, process.env", build: false },
                ],
            },
            {
                title: "Networking Tools",
                items: [
                    { text: "curl -v — inspect raw HTTP headers, timing breakdown with --write-out", build: false },
                    { text: "dig and nslookup — DNS resolution tracing, query specific servers, check TTL", build: false },
                    { text: "tcpdump — capture raw packets, filter by port/host, write to pcap", build: false },
                    { text: "Wireshark — GUI packet analysis, follow TCP stream, inspect TLS (with SSLKEYLOGFILE)", build: false },
                    { text: "ping, traceroute, mtr — network path debugging, identify latency hops", build: false },
                    { text: "nc (netcat) — raw TCP connections, port scanning, testing services", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Run a Node app as a systemd service — auto-restart on crash, correct env vars", build: true },
                    { text: "strace your Node app — count and categorize every syscall for a single request", build: true },
                    { text: "Use lsof to find which process is holding a port open and why", build: true },
                    { text: "Set up SSH key auth on a VPS and disable password login", build: true },
                    { text: "Use tcpdump to capture a real HTTP request — read the raw bytes", build: true },
                ],
            },
        ],
    },
    {
        phase: "04",
        title: "Computer Networks",
        tag: "CS Foundations",
        duration: "Week 5–7",
        color: "#e8c547",
        why: "Backend systems communicate via networks. Not knowing TCP/HTTP deeply is like building a house without knowing what walls do.",
        sections: [
            {
                title: "The Stack",
                items: [
                    { text: "OSI model — all 7 layers, what each does, which you actually touch as a backend dev", build: false },
                    { text: "TCP/IP model — how it maps to OSI, why it won over OSI's design", build: false },
                    { text: "IP addressing — IPv4, subnets, CIDR notation, private ranges (10.x, 172.16.x, 192.168.x)", build: false },
                    { text: "IPv6 — address format, why the transition is slow, dual-stack", build: false },
                    { text: "DNS — resolution chain, recursive vs authoritative, A/CNAME/MX/TXT/SRV records, TTL", build: false },
                    { text: "DNS propagation — why deploys can have delay, negative caching, how to verify with dig", build: false },
                    { text: "NAT — how your router gives one public IP to many devices, SNAT vs DNAT", build: false },
                ],
            },
            {
                title: "TCP Deep Dive",
                items: [
                    { text: "3-way handshake — SYN, SYN-ACK, ACK — why 3 steps not 2", build: false },
                    { text: "4-way teardown — FIN/FIN-ACK asymmetry, TIME_WAIT state and why it exists (2×MSL)", build: false },
                    { text: "TCP vs UDP — reliability, ordering, retransmission, when UDP wins (DNS, video, games)", build: false },
                    { text: "Flow control — sliding window, receiver buffer advertisement, window scaling option", build: false },
                    { text: "Congestion control — slow start, congestion avoidance, fast retransmit, CUBIC", build: false },
                    { text: "TCP keep-alive — detecting dead connections, what connection pooling in ORMs saves", build: false },
                    { text: "Nagle's algorithm — batching small writes, why it hurts latency, TCP_NODELAY", build: false },
                    { text: "TCP backlog queue — listen() queue depth, SYN flood attack, SYN cookies", build: false },
                    { text: "TCP fast open — avoiding handshake overhead for repeat connections", build: false },
                ],
            },
            {
                title: "HTTP",
                items: [
                    { text: "HTTP/1.1 — request/response format, headers, methods, status codes, persistent connections", build: false },
                    { text: "HTTP/1.1 head-of-line blocking — why pipelining failed in practice", build: false },
                    { text: "HTTP/2 — multiplexing streams, header compression (HPACK), server push, binary framing", build: false },
                    { text: "HTTP/3 — QUIC over UDP, solves HOL blocking at transport layer, 0-RTT", build: false },
                    { text: "Content negotiation — Accept, Content-Type, Accept-Encoding", build: false },
                    { text: "Conditional requests — ETag, If-None-Match, Last-Modified, 304 Not Modified", build: false },
                    { text: "Cache-Control — max-age, no-cache, no-store, stale-while-revalidate, s-maxage", build: false },
                    { text: "CORS — why it exists, preflight OPTIONS, how to configure correctly, credentials mode", build: false },
                ],
            },
            {
                title: "TLS",
                items: [
                    { text: "TLS handshake — ClientHello, ServerHello, certificate exchange, session key derivation", build: false },
                    { text: "Symmetric vs asymmetric encryption — why TLS uses asymmetric only for key exchange", build: false },
                    { text: "Certificate chain — root CA, intermediate CA, leaf cert, browser trust store", build: false },
                    { text: "SNI — Server Name Indication, one IP serving multiple HTTPS domains", build: false },
                    { text: "TLS 1.2 vs 1.3 — fewer round trips, removed weak cipher suites, 0-RTT resumption", build: false },
                    { text: "HSTS — forcing HTTPS, preload list, max-age, includeSubDomains", build: false },
                    { text: "mTLS — mutual TLS, both sides authenticate, used in service mesh", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Build a raw TCP server with Node's net module — no http module allowed", build: true },
                    { text: "Implement a basic HTTP/1.1 request parser — parse method, path, headers from raw bytes", build: true },
                    { text: "Capture TCP 3-way handshake with tcpdump — identify SYN, SYN-ACK, ACK packets", build: true },
                    { text: "Trace full DNS resolution of a domain with dig +trace — find every hop", build: true },
                    { text: "Set up Nginx as a reverse proxy with TLS termination for a Node app", build: true },
                ],
            },
        ],
    },
    {
        phase: "05",
        title: "Node.js Internals",
        tag: "Runtime",
        duration: "Week 8–9",
        color: "#47e8a0",
        why: "You've been using Node for every project. Time to own it. Understanding the runtime lets you reason about async behavior, performance, and scaling.",
        sections: [
            {
                title: "Event Loop",
                items: [
                    { text: "V8 engine — JIT compilation, hidden classes, inline caching, deoptimization", build: false },
                    { text: "libuv — C library handling async I/O, thread pool, event loop, timer management", build: false },
                    { text: "Event loop phases — timers → pending callbacks → idle/prepare → poll → check → close callbacks", build: false },
                    { text: "setTimeout vs setImmediate vs process.nextTick — exact execution order and why", build: false },
                    { text: "Microtask queue — Promise callbacks and queueMicrotask() run before next event loop phase", build: false },
                    { text: "The thread pool — which operations use it (fs, crypto, dns.lookup, zlib, http.get to IP)", build: false },
                    { text: "Blocking the event loop — what it means, why it kills throughput, how to detect", build: false },
                    { text: "Why CPU-intensive work kills Node — single-threaded JS execution, event loop starvation", build: false },
                ],
            },
            {
                title: "Streams",
                items: [
                    { text: "Readable streams — flowing vs paused mode, 'data', 'end', 'error', 'readable' events", build: false },
                    { text: "Writable streams — write(), 'drain' event, buffering, highWaterMark", build: false },
                    { text: "Transform streams — duplex stream, modifying data in-flight (compression, encryption)", build: false },
                    { text: "Backpressure — what it is, why it matters, how pipe() handles it automatically", build: false },
                    { text: "stream.pipeline() vs .pipe() — error propagation, cleanup, async iteration", build: false },
                    { text: "Practical use cases — large file processing, HTTP bodies, compression, encryption", build: false },
                ],
            },
            {
                title: "Concurrency",
                items: [
                    { text: "Worker threads — SharedArrayBuffer, Atomics, MessageChannel, transferable objects", build: false },
                    { text: "Cluster module — fork processes, share a port, round-robin load balancing", build: false },
                    { text: "Child processes — spawn vs exec vs fork, stdin/stdout piping, kill signals", build: false },
                    { text: "When to use: workers (CPU) vs cluster (per-request) vs job queue (async background)", build: false },
                ],
            },
            {
                title: "Node Internals",
                items: [
                    { text: "Buffer — binary data, encoding conversions, why it predates TypedArrays", build: false },
                    { text: "EventEmitter — internals, max listeners warning, memory leaks from unremoved listeners", build: false },
                    { text: "require() vs import — module caching, circular dependencies, CJS vs ESM interop", build: false },
                    { text: "process object — env, argv, exit codes, 'uncaughtException', 'unhandledRejection'", build: false },
                    { text: "AsyncLocalStorage — request-scoped context without threading it through every call", build: false },
                    { text: "V8 heap — old generation vs young generation, garbage collection, --max-old-space-size", build: false },
                    { text: "diagnostics_channel — built-in instrumentation hooks, what APMs use internally", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Predict then verify: exact execution order of setTimeout(0), setImmediate, nextTick, Promise.resolve", build: true },
                    { text: "Build a file transformation pipeline with streams — large CSV in, transformed output, no full load", build: true },
                    { text: "Implement EventEmitter from scratch — on, off, emit, once, error handling", build: true },
                    { text: "Offload CPU work to worker_threads — compare throughput with and without", build: true },
                    { text: "Profile with --prof + --prof-process — generate flamegraph, identify hot path", build: true },
                ],
            },
        ],
    },
    {
        phase: "06",
        title: "TypeScript Deep Dive",
        tag: "Language",
        duration: "Week 10",
        color: "#47e8a0",
        why: "Advanced TypeScript separates TS users from TS developers. This is what enables safe, large-scale systems.",
        sections: [
            {
                title: "Type System Internals",
                items: [
                    { text: "Structural vs nominal typing — why TS uses structural, what it means for assignability", build: false },
                    { text: "Type widening and narrowing — how TS infers types and refines them in branches", build: false },
                    { text: "Discriminated unions — tagged union pattern, exhaustiveness checking with never", build: false },
                    { text: "Type guards — typeof, instanceof, in operator, custom is-type-guards", build: false },
                    { text: "Assertion functions — asserts x is T, narrowing after side effects", build: false },
                    { text: "const assertions — as const, readonly tuples, literal inference", build: false },
                    { text: "satisfies operator — validate against a type without widening the inferred type", build: false },
                    { text: "Excess property checking — why { a: 1, b: 2 } fails as { a: number } in some contexts", build: false },
                ],
            },
            {
                title: "Advanced Types",
                items: [
                    { text: "Generics — constraints (extends), defaults, inference from arguments, variance", build: false },
                    { text: "Conditional types — T extends U ? X : Y, distributive behavior over unions", build: false },
                    { text: "infer keyword — extract types from inside conditional types", build: false },
                    { text: "Mapped types — { [K in keyof T]: ... }, key remapping with as clause", build: false },
                    { text: "Template literal types — `${Prefix}${string}`, string manipulation at type level", build: false },
                    { text: "Implement from scratch: Partial, Required, Readonly, Pick, Omit, ReturnType, Parameters, Awaited", build: false },
                    { text: "Recursive types — deep nested structures, JSON type, DeepPartial<T>", build: false },
                    { text: "Covariance vs contravariance — function parameter types, why it matters in generics", build: false },
                ],
            },
            {
                title: "Compiler & Config",
                items: [
                    { text: "tsconfig options that matter — strict, target, lib, moduleResolution, paths, baseUrl", build: false },
                    { text: "Declaration files — .d.ts, DefinitelyTyped, writing declarations for untyped modules", build: false },
                    { text: "Module augmentation — extending third-party type definitions", build: false },
                    { text: "Project references — monorepo builds, composite flag, incremental compilation", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Type-safe event emitter — full generic inference on event names and payload types", build: true },
                    { text: "Build Result<T, E> type (Rust-style) and use it through an entire small project — no throws", build: true },
                    { text: "Implement DeepPartial<T>, DeepReadonly<T>, Flatten<T> without looking them up", build: true },
                    { text: "Type a complex discriminated union API response end-to-end — zero any, zero type assertions", build: true },
                ],
            },
        ],
    },
    {
        phase: "07",
        title: "Databases",
        tag: "Data Layer",
        duration: "Week 11–13",
        color: "#e847a0",
        why: "You've used ORMs as black boxes. Time to own the data layer — the part that every production incident eventually traces back to.",
        sections: [
            {
                title: "PostgreSQL Internals",
                items: [
                    { text: "Storage — heap files, 8KB pages, tuples, TOAST for large values", build: false },
                    { text: "MVCC — Multi-Version Concurrency Control, how reads don't block writes", build: false },
                    { text: "Dead tuples and VACUUM — table bloat, autovacuum, why long-running transactions are dangerous", build: false },
                    { text: "WAL — Write-Ahead Log, crash recovery, replication, logical decoding", build: false },
                    { text: "EXPLAIN and EXPLAIN ANALYZE — reading query plans, actual vs estimated row counts", build: false },
                    { text: "Seq scan vs Index scan vs Bitmap scan vs Index-only scan — when Postgres chooses each", build: false },
                    { text: "Table statistics — ANALYZE, pg_stats, how planner estimates go wrong", build: false },
                    { text: "Connection overhead — why Postgres spawns a process per connection, PgBouncer", build: false },
                ],
            },
            {
                title: "Indexes",
                items: [
                    { text: "B-Tree — default index, structure, why it handles range and equality queries", build: false },
                    { text: "Hash indexes — equality-only, when faster than B-tree", build: false },
                    { text: "GIN — inverted index for JSONB, arrays, full-text search", build: false },
                    { text: "GiST — generalized search tree, geometric data, range types", build: false },
                    { text: "Partial indexes — index only a subset of rows, essential for soft deletes and status columns", build: false },
                    { text: "Composite indexes — column order matters, leftmost prefix rule, include clause", build: false },
                    { text: "Covering indexes — INCLUDE columns, index-only scan, avoid heap fetch", build: false },
                    { text: "Index write amplification — why over-indexing kills write performance", build: false },
                ],
            },
            {
                title: "Transactions & Isolation",
                items: [
                    { text: "ACID — what Atomicity, Consistency, Isolation, Durability each actually guarantees", build: false },
                    { text: "Isolation levels — Read Uncommitted, Read Committed, Repeatable Read, Serializable", build: false },
                    { text: "Anomalies — dirty reads, non-repeatable reads, phantom reads — which level prevents each", build: false },
                    { text: "Optimistic vs pessimistic locking — SELECT FOR UPDATE, SKIP LOCKED, version columns", build: false },
                    { text: "Deadlocks in Postgres — detection, the pg log message, consistent lock ordering to prevent", build: false },
                    { text: "Advisory locks — application-level locks via Postgres, use cases (cron dedup, migrations)", build: false },
                ],
            },
            {
                title: "Redis Internals",
                items: [
                    { text: "Single-threaded model — why Redis is fast despite being single-threaded, I/O multiplexing", build: false },
                    { text: "Data structures — strings, lists, hashes, sets, sorted sets, streams, HyperLogLog, Bloom filter", build: false },
                    { text: "Sorted sets — skiplist + hashtable internally, O(log N) for ZADD/ZRANK/ZSCORE", build: false },
                    { text: "Expiry — lazy deletion + periodic sampling, how TTL works under the hood", build: false },
                    { text: "Eviction policies — allkeys-lru, allkeys-lfu, volatile-lru, noeviction — when each applies", build: false },
                    { text: "Persistence — RDB snapshots (point-in-time) vs AOF log (every write), hybrid", build: false },
                    { text: "Redis Streams — persistent pub/sub with consumer groups, XADD, XREAD, XACK, XPENDING", build: false },
                    { text: "Lua scripting — atomic multi-key operations, EVALSHA, script caching", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Write 20 raw SQL queries — joins, aggregations, window functions (ROW_NUMBER, RANK, LAG), CTEs", build: true },
                    { text: "Run EXPLAIN ANALYZE on 5 real queries — find sequential scans, add appropriate indexes", build: true },
                    { text: "Add a partial index for soft-delete pattern — verify speedup with EXPLAIN ANALYZE", build: true },
                    { text: "Implement cursor-based pagination from scratch in raw SQL — opaque base64 cursor", build: true },
                    { text: "Rate limiter with Redis sorted sets — sliding window, ZADD + ZREMRANGEBYSCORE + ZCARD", build: true },
                    { text: "Leaderboard with Redis sorted sets — ZADD, ZRANK, ZRANGE WITHSCORES, ZINCRBY", build: true },
                    { text: "Distributed lock with Redis SET NX PX — handle expiry, avoid accidental release", build: true },
                ],
            },
        ],
    },
    {
        phase: "08",
        title: "Data Modeling",
        tag: "Data Layer",
        duration: "Week 14",
        color: "#e847a0",
        why: "Schema design is one of the hardest things to change in production. Getting it right saves months of painful migrations.",
        sections: [
            {
                title: "Relational Modeling",
                items: [
                    { text: "Normalization — 1NF, 2NF, 3NF — what each eliminates and why it matters", build: false },
                    { text: "When to denormalize — read-heavy queries, reporting tables, materialized views", build: false },
                    { text: "Foreign keys — enforcement cost, cascade delete/update, when to skip them (high-write tables)", build: false },
                    { text: "Many-to-many patterns — junction tables, composite PKs, extra columns on the join", build: false },
                    { text: "Polymorphic associations — one table, multiple parent types, tradeoffs vs separate tables", build: false },
                    { text: "Soft deletes — deleted_at pattern, partial indexes required, logical vs physical delete", build: false },
                    { text: "Audit logs — append-only tables, who changed what, triggers vs application-level", build: false },
                    { text: "UUIDs vs serial IDs — entropy, URL exposure, index fragmentation, ULID as a compromise", build: false },
                ],
            },
            {
                title: "Schema Migrations in Production",
                items: [
                    { text: "Zero-downtime migrations — adding nullable columns (safe), dropping columns (risky)", build: false },
                    { text: "Expand-contract pattern — safe way to rename a column without downtime", build: false },
                    { text: "Adding indexes in production — CREATE INDEX CONCURRENTLY in Postgres", build: false },
                    { text: "Backfilling data — chunked UPDATE batches, avoid table lock, use advisory lock", build: false },
                    { text: "Multi-tenant schema design — row-level vs schema-per-tenant vs database-per-tenant", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Design a normalized schema for a social network — users, posts, follows, likes, comments, notifications", build: true },
                    { text: "Write a zero-downtime migration plan for renaming a heavily-used column — every step", build: true },
                    { text: "Design a multi-tenant SaaS schema — pick a tenancy model and justify it in writing", build: true },
                ],
            },
        ],
    },
    {
        phase: "09",
        title: "Authentication & Security",
        tag: "Security",
        duration: "Week 15–16",
        color: "#e84747",
        why: "Every system you build needs auth. This section separates engineers who understand security from those who just copy-paste.",
        sections: [
            {
                title: "Cryptography Basics",
                items: [
                    { text: "Symmetric encryption — AES-256-GCM, nonce/IV, authenticated encryption (AEAD)", build: false },
                    { text: "Asymmetric encryption — RSA, public/private key pair, what each key does", build: false },
                    { text: "Hashing — SHA-256, one-way, deterministic, collision resistance, length extension attacks", build: false },
                    { text: "HMAC — keyed hash, proves both integrity and authenticity simultaneously", build: false },
                    { text: "Password hashing — bcrypt/argon2, intentionally slow, salted, work factor tuning", build: false },
                    { text: "Key derivation — PBKDF2, scrypt, argon2 — time and memory cost parameters", build: false },
                    { text: "Secure random — crypto.randomBytes(), why Math.random() must never be used for secrets", build: false },
                ],
            },
            {
                title: "JWT Internals",
                items: [
                    { text: "JWT structure — header.payload.signature, base64url (not encryption, anyone can read it)", build: false },
                    { text: "Signing algorithms — HS256 (shared secret HMAC) vs RS256 (RSA asymmetric), when each", build: false },
                    { text: "Standard claims — iss, sub, exp, iat, aud — what each means and what to validate", build: false },
                    { text: "Why JWTs are stateless — and the revocation problem this creates", build: false },
                    { text: "Storage tradeoffs — httpOnly cookie vs localStorage, XSS vs CSRF risk", build: false },
                    { text: "Short-lived access tokens + long-lived refresh tokens — the correct pattern", build: false },
                    { text: "Refresh token rotation — token families, detecting theft via reuse", build: false },
                    { text: "The alg:none vulnerability — why you must always explicitly validate algorithm", build: false },
                ],
            },
            {
                title: "OAuth2 & OIDC",
                items: [
                    { text: "OAuth2 roles — Resource Owner, Client, Authorization Server, Resource Server", build: false },
                    { text: "Authorization Code flow — step by step, why it's more secure than Implicit", build: false },
                    { text: "PKCE — Proof Key for Code Exchange, required for public clients (SPAs, mobile)", build: false },
                    { text: "Client Credentials — machine-to-machine auth, no user involved", build: false },
                    { text: "Scopes — requesting minimum permissions, consent screen", build: false },
                    { text: "OpenID Connect — identity layer on OAuth2, ID token is a JWT about the user", build: false },
                    { text: "State parameter — CSRF protection in the OAuth redirect flow", build: false },
                ],
            },
            {
                title: "Attack Vectors",
                items: [
                    { text: "CSRF — how it works, SameSite cookie attribute (Lax vs Strict), double-submit pattern", build: false },
                    { text: "XSS — Stored vs Reflected vs DOM-based, Content-Security-Policy, sanitization", build: false },
                    { text: "SQL injection — parameterized queries, why ORMs help but string interpolation kills you", build: false },
                    { text: "SSRF — Server-Side Request Forgery, AWS metadata endpoint, allow-list mitigation", build: false },
                    { text: "Timing attacks — why string equality for secrets is dangerous, crypto.timingSafeEqual", build: false },
                    { text: "Mass assignment — allowlist fields in your API, not blocklist", build: false },
                    { text: "Path traversal — user-controlled file paths, canonical path validation", build: false },
                    { text: "Brute force — rate limiting login endpoint, account lockout, CAPTCHA tradeoffs", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "JWT auth from scratch — sign, verify, refresh rotation, token family revocation — only jsonwebtoken lib", build: true },
                    { text: "Redis-backed sessions — session ID cookie, server-side state, secure flags", build: true },
                    { text: "OAuth2 Authorization Code + PKCE flow manually with GitHub as provider", build: true },
                    { text: "Refresh token rotation with family tracking — detect and block reuse attacks", build: true },
                    { text: "Rate limiting middleware for login — sliding window, Redis-backed, proper 429 + Retry-After", build: true },
                ],
            },
        ],
    },
    {
        phase: "10",
        title: "API Design",
        tag: "Backend Craft",
        duration: "Week 17",
        color: "#4788e8",
        why: "You've built APIs in every project. This is about building them correctly — predictable, safe, and maintainable at scale.",
        sections: [
            {
                title: "REST Done Right",
                items: [
                    { text: "Resource naming — nouns not verbs, plural collections, nested vs flat resource tradeoffs", build: false },
                    { text: "Idempotency — GET/PUT/DELETE are idempotent, POST is not, implications for retries", build: false },
                    { text: "Idempotency keys — POST endpoints that must not double-execute (payments, emails)", build: false },
                    { text: "HTTP status codes — 200/201/204/400/401/403/404/409/422/429/500/503 — use them correctly", build: false },
                    { text: "Consistent error response shape — type, code, message, details, request_id field", build: false },
                    { text: "API versioning strategies — URI prefix (/v1/), Accept header, tradeoffs of each", build: false },
                    { text: "HATEOAS — hypermedia links in responses, when the complexity is worth it", build: false },
                ],
            },
            {
                title: "Validation & Serialization",
                items: [
                    { text: "Zod deeply — transforms, refinements, superRefine, discriminatedUnion, preprocess", build: false },
                    { text: "Input validation vs output serialization — two separate concerns, validate at boundaries", build: false },
                    { text: "Never trust client data — validate everything, even from internal services", build: false },
                    { text: "OpenAPI/Swagger — spec-first design, client SDK generation, contract testing", build: false },
                    { text: "tRPC — type-safe APIs without schemas, full-stack TypeScript inference", build: false },
                ],
            },
            {
                title: "Pagination & Rate Limiting",
                items: [
                    { text: "Offset pagination — OFFSET 10000 does a full scan, breaks at scale", build: false },
                    { text: "Cursor pagination — stable under inserts/deletes, efficient, opaque cursor implementation", build: false },
                    { text: "Token bucket algorithm — burst-friendly, refill rate, Redis-based implementation", build: false },
                    { text: "Sliding window — more accurate than token bucket, Redis sorted set implementation", build: false },
                    { text: "Rate limit headers — X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Build REST API with consistent error shapes, Zod validation, request IDs, versioning", build: true },
                    { text: "Implement cursor-based pagination — opaque base64-encoded cursor, stable ordering", build: true },
                    { text: "Build sliding window rate limiter middleware — Redis-backed, per IP and per user-id", build: true },
                    { text: "Implement idempotency key middleware — Redis dedup, correct cache-then-process flow", build: true },
                ],
            },
        ],
    },
    {
        phase: "11",
        title: "Observability",
        tag: "Production",
        duration: "Week 18",
        color: "#4788e8",
        why: "Tutorial projects crash and you restart them. Production systems need to tell you what's wrong before users do.",
        sections: [
            {
                title: "Error Handling",
                items: [
                    { text: "Operational vs programmer errors — different handling: expose operational, crash on programmer", build: false },
                    { text: "Custom error classes — extend Error, add statusCode, code, isOperational, context fields", build: false },
                    { text: "Centralized error handler middleware — single place to format, log, and respond to all errors", build: false },
                    { text: "Never expose stack traces in production responses — log them, don't send them", build: false },
                    { text: "uncaughtException and unhandledRejection — last resort handlers, log then exit gracefully", build: false },
                    { text: "Graceful shutdown — stop accepting connections, drain in-flight requests, close DB pool, exit 0", build: false },
                    { text: "Result pattern — return errors as values instead of throwing, Railway-oriented programming", build: false },
                ],
            },
            {
                title: "Logging",
                items: [
                    { text: "Why console.log is not production logging — no levels, no structure, no context, no sampling", build: false },
                    { text: "Structured logging — JSON lines, machine-readable, queryable in Datadog/Loki/CloudWatch", build: false },
                    { text: "Pino — fastest Node.js logger, child loggers, redaction, level serializers", build: false },
                    { text: "Correlation IDs — generate UUID per request via AsyncLocalStorage, attach to all logs", build: false },
                    { text: "What to log — request in/out (sanitized), slow queries >100ms, errors with full context", build: false },
                    { text: "What NOT to log — passwords, tokens, PII, credit cards, anything regulated by GDPR", build: false },
                    { text: "Log levels — trace/debug/info/warn/error/fatal — use them correctly, filter in production", build: false },
                ],
            },
            {
                title: "Metrics & Tracing",
                items: [
                    { text: "Metric types — counter (only goes up), gauge (current value), histogram (distribution)", build: false },
                    { text: "p50/p95/p99 latency — why averages lie under skewed distributions", build: false },
                    { text: "Prometheus — metrics format, scraping, PromQL basics, alerting rules", build: false },
                    { text: "Grafana — dashboards, Prometheus data source, alert channels", build: false },
                    { text: "Distributed tracing — spans, trace IDs, parent-child relationships, sampling", build: false },
                    { text: "OpenTelemetry — standard for traces, metrics, logs — vendor neutral, how to instrument", build: false },
                    { text: "Sentry — error tracking, performance monitoring, source maps for TypeScript", build: false },
                    { text: "Health endpoints — /health/live (process alive) vs /health/ready (can serve traffic)", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Add Pino structured logging with correlation IDs via AsyncLocalStorage to an existing project", build: true },
                    { text: "Build a centralized error handler with custom error class hierarchy — operational vs programmer", build: true },
                    { text: "Implement graceful shutdown — drain in-flight HTTP requests before process.exit", build: true },
                    { text: "Expose /metrics endpoint with Prometheus — request count, latency histogram, active connections", build: true },
                    { text: "Integrate Sentry with source maps — stack traces should point to TypeScript lines", build: true },
                ],
            },
        ],
    },
    {
        phase: "12",
        title: "Caching",
        tag: "Performance",
        duration: "Week 19",
        color: "#a047e8",
        why: "Caching done wrong causes silent data bugs worse than no cache. Caching done right makes systems feel instant.",
        sections: [
            {
                title: "Caching Patterns",
                items: [
                    { text: "Cache-aside (lazy loading) — app checks cache, populates on miss, most common pattern", build: false },
                    { text: "Write-through — write to cache and DB simultaneously, strong read consistency", build: false },
                    { text: "Write-behind (write-back) — write cache only, async flush to DB, risk of data loss", build: false },
                    { text: "Read-through — cache sits in front, handles its own population from DB", build: false },
                    { text: "Cache invalidation — TTL, event-driven invalidation, version keys, cache tags", build: false },
                    { text: "Cache stampede (thundering herd) — many requests miss simultaneously, probabilistic early expiry or lock", build: false },
                    { text: "Negative caching — cache the absence of a value to prevent repeated DB misses", build: false },
                    { text: "What not to cache — personalized data, highly volatile data, data larger than memory", build: false },
                ],
            },
            {
                title: "HTTP & CDN Caching",
                items: [
                    { text: "Cache-Control — max-age, s-maxage, no-cache (revalidate), no-store, stale-while-revalidate", build: false },
                    { text: "ETag + If-None-Match — 304 Not Modified, saves bandwidth and compute", build: false },
                    { text: "Vary header — cache per-header, e.g. Vary: Accept-Encoding, Vary: Authorization", build: false },
                    { text: "CDN caching — Cloudflare cache rules, cache keys, purge API, edge cache", build: false },
                    { text: "Cache key design — namespace by version/user/tenant, avoid over-caching per-user", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Add cache-aside to a slow DB query — measure p99 latency before vs after", build: true },
                    { text: "Implement cache invalidation on write — keep cache consistent with DB state", build: true },
                    { text: "Solve cache stampede with a Redis lock — only one request populates, others wait", build: true },
                    { text: "Add correct Cache-Control headers to a REST API — test with curl -I", build: true },
                ],
            },
        ],
    },
    {
        phase: "13",
        title: "Background Jobs & Queues",
        tag: "Async Systems",
        duration: "Week 20",
        color: "#a047e8",
        why: "Queues decouple services, absorb traffic spikes, and make systems resilient to downstream failures.",
        sections: [
            {
                title: "Why Queues",
                items: [
                    { text: "Decoupling — producer doesn't wait for consumer, can scale independently", build: false },
                    { text: "Reliability — jobs survive crashes, guaranteed at-least-once delivery", build: false },
                    { text: "Backpressure — queue absorbs spikes, consumers process at sustainable rate", build: false },
                    { text: "At-least-once vs exactly-once — why exactly-once is hard, idempotent consumers as solution", build: false },
                    { text: "Dead letter queue — where jobs go after max retries, required for every queue", build: false },
                    { text: "Job priorities — critical jobs skip the line, low-priority jobs yield under load", build: false },
                ],
            },
            {
                title: "BullMQ",
                items: [
                    { text: "Jobs and queues — adding jobs, job data, defaultJobOptions, named queues", build: false },
                    { text: "Delayed jobs — schedule for future execution (emails, reminders, retries)", build: false },
                    { text: "Retries — exponential backoff, max attempts, custom backoff function", build: false },
                    { text: "Job events — completed, failed, progress, stalled — worker event hooks", build: false },
                    { text: "Worker concurrency — jobs processed in parallel per worker, rate limiting", build: false },
                    { text: "Flows — parent-child jobs, waiting for all children, aggregate results", build: false },
                    { text: "Bull Board — monitoring UI, inspect jobs, retry from UI, job data viewer", build: false },
                ],
            },
            {
                title: "Kafka Fundamentals",
                items: [
                    { text: "Topics and partitions — how data is distributed and parallelized", build: false },
                    { text: "Consumer groups — partition assignment, load balancing, cooperative rebalancing", build: false },
                    { text: "Offsets — tracking read position, committing, replaying from beginning", build: false },
                    { text: "Producer acks — acks=0 (fire and forget), acks=1 (leader), acks=all (durable)", build: false },
                    { text: "Log compaction — retain only latest value per key, use cases", build: false },
                    { text: "Kafka vs BullMQ — when volume, durability, replay, or audit log requirements justify Kafka", build: false },
                ],
            },
            {
                title: "Webhooks",
                items: [
                    { text: "Receiving reliably — respond 200 immediately, process async via queue", build: false },
                    { text: "Signature verification — HMAC-SHA256 of body, timing-safe comparison", build: false },
                    { text: "Idempotency — same event delivered twice must not create duplicate side effects", build: false },
                    { text: "Retries from sender — exponential backoff, deduplication by event ID", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Add BullMQ to a project — offload email or image processing from the request path", build: true },
                    { text: "Implement exponential backoff retries + dead letter queue, monitor via Bull Board", build: true },
                    { text: "Build a webhook receiver — verify HMAC signature, queue processing, idempotency key", build: true },
                ],
            },
        ],
    },
    {
        phase: "14",
        title: "Real-Time Systems",
        tag: "Realtime",
        duration: "Week 21",
        color: "#47e8e8",
        why: "Real-time is a different programming model. Stateful connections, multi-server scaling, and backpressure require fundamentally different thinking.",
        sections: [
            {
                title: "WebSocket Internals",
                items: [
                    { text: "HTTP Upgrade handshake — Sec-WebSocket-Key/Accept header derivation (SHA-1 + base64)", build: false },
                    { text: "WebSocket framing — FIN bit, opcode (text/binary/ping/pong/close), masking from client", build: false },
                    { text: "Ping/pong heartbeats — detecting dead connections, browser vs Node behavior", build: false },
                    { text: "Reconnection logic — exponential backoff with jitter, preserving client session state", build: false },
                    { text: "Backpressure — bufferedAmount (browser), pausing sends, flow control in ws library", build: false },
                ],
            },
            {
                title: "Scaling Real-Time",
                items: [
                    { text: "Sticky sessions — stateful connections break round-robin load balancing, ip_hash in Nginx", build: false },
                    { text: "Redis adapter — Socket.io Redis adapter, broadcasting via pub/sub across server instances", build: false },
                    { text: "Presence systems — tracking online users, Redis SETEX heartbeats, TTL-based expiry", build: false },
                    { text: "Connection limits — OS file descriptor limits, ulimit configuration, C10K problem history", build: false },
                    { text: "SSE — Server-Sent Events, one-way push, HTTP/2 friendly, automatic reconnect built-in", build: false },
                    { text: "Long polling — fallback pattern, how it differs from SSE, when still useful", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "WebSocket server with Node ws library — no Socket.io, implement rooms manually", build: true },
                    { text: "Add ping/pong heartbeat — disconnect clients that miss 2 consecutive pings", build: true },
                    { text: "Scale to 2 server instances using Redis pub/sub — both instances see all messages", build: true },
                    { text: "Build a presence system — who's online — Redis SETEX + periodic refresh + expiry events", build: true },
                    { text: "Implement an SSE endpoint for notifications — compare developer experience vs WebSocket", build: true },
                ],
            },
        ],
    },
    {
        phase: "15",
        title: "Distributed Systems",
        tag: "Advanced Systems",
        duration: "Week 22–23",
        color: "#ff6b35",
        why: "Modern backend systems are distributed by default. Partial failure is the norm, not the exception.",
        sections: [
            {
                title: "Core Concepts",
                items: [
                    { text: "CAP theorem — you can only guarantee 2 of 3: Consistency, Availability, Partition tolerance", build: false },
                    { text: "CP vs AP systems — Postgres/Zookeeper (CP) vs Cassandra/DynamoDB (AP)", build: false },
                    { text: "Eventual consistency — examples: DNS propagation, shopping cart, social counters", build: false },
                    { text: "Consistency models spectrum — linearizable → sequential → causal → eventual", build: false },
                    { text: "The 8 fallacies of distributed computing — network is reliable, latency is zero…", build: false },
                    { text: "Idempotency requirement — every operation that can be retried must be safe to retry", build: false },
                ],
            },
            {
                title: "Coordination & Consensus",
                items: [
                    { text: "FLP impossibility — consensus is impossible in async systems with even one failure", build: false },
                    { text: "Raft consensus — leader election, log replication, how etcd and Consul use it", build: false },
                    { text: "Distributed locks — when you need them, Redlock algorithm, fencing tokens", build: false },
                    { text: "Leader election — using Redis TTL, Zookeeper ephemeral nodes, fencing", build: false },
                    { text: "Vector clocks — tracking causality and happened-before relationships across nodes", build: false },
                ],
            },
            {
                title: "Reliability Patterns",
                items: [
                    { text: "Circuit breaker — fail fast, states: closed / open / half-open, probe interval", build: false },
                    { text: "Retry with exponential backoff — jitter to avoid thundering herd on recovery", build: false },
                    { text: "Timeout — every network call must have one, cascading timeout failures", build: false },
                    { text: "Bulkhead — isolate failures, separate connection pools per downstream service", build: false },
                    { text: "Saga pattern — distributed transactions without 2PC, compensating transactions", build: false },
                    { text: "Outbox pattern — reliably publish events atomically with DB writes, polling vs CDC", build: false },
                    { text: "Two-phase commit (2PC) — coordinator pattern, why it's often avoided in practice", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Distributed lock with Redis — handle expiry, crash recovery, fencing token", build: true },
                    { text: "Implement outbox pattern — write events to DB in same transaction, publish async", build: true },
                    { text: "Build a circuit breaker class from scratch — state machine, half-open probe logic", build: true },
                ],
            },
        ],
    },
    {
        phase: "16",
        title: "Event-Driven Architecture",
        tag: "Architecture",
        duration: "Week 24",
        color: "#ff6b35",
        why: "Event-driven systems are more scalable and decoupled than synchronous request-response. Most large systems eventually converge here.",
        sections: [
            {
                title: "Patterns",
                items: [
                    { text: "Event sourcing — store events not current state, rebuild state from event log", build: false },
                    { text: "CQRS — Command Query Responsibility Segregation, separate read and write models", build: false },
                    { text: "Choreography vs orchestration — each service reacts to events vs central coordinator", build: false },
                    { text: "Domain events — naming convention (past tense), what qualifies as a domain event", build: false },
                    { text: "Event-driven vs request-driven — when each fits, most systems are hybrid", build: false },
                    { text: "Eventual consistency in event systems — how read models lag, compensating for it in UI", build: false },
                ],
            },
            {
                title: "Kafka Deep Dive",
                items: [
                    { text: "Broker architecture — leaders, followers, ISR (In-Sync Replicas), controller", build: false },
                    { text: "Exactly-once semantics — idempotent producers, transactional API, EOS guarantees", build: false },
                    { text: "Schema registry — Avro/Protobuf, schema evolution rules, backward/forward compatibility", build: false },
                    { text: "Kafka Streams — stateful stream processing, KTable, windowing, joins, changelog topics", build: false },
                    { text: "Consumer lag — monitoring, alert when lag grows, identify slow consumers", build: false },
                    { text: "Kafka Connect — source and sink connectors, CDC from Postgres via Debezium", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Implement event sourcing for a bank account — append events, rebuild balance from log", build: true },
                    { text: "Build CQRS system — command side writes events, query side maintains a Redis read model", build: true },
                    { text: "Implement transactional outbox with Kafka — write events to DB + publish atomically", build: true },
                ],
            },
        ],
    },
    {
        phase: "17",
        title: "Performance Engineering",
        tag: "Optimization",
        duration: "Week 25",
        color: "#ff4757",
        why: "Performance problems only appear under real load. You need to find them with data, not guesses.",
        sections: [
            {
                title: "Profiling Node.js",
                items: [
                    { text: "CPU profiling — node --prof, node --prof-process, flame graphs, tick sampling", build: false },
                    { text: "Memory profiling — heap snapshots in Chrome DevTools, allocation timeline", build: false },
                    { text: "Clinic.js — Doctor (event loop delay), Flame (CPU), Bubbleprof (async), Heap", build: false },
                    { text: "0x — one-command flamegraph profiler for Node processes", build: false },
                    { text: "Chrome DevTools remote debugging — connect to running Node with --inspect", build: false },
                    { text: "async_hooks — track async operation lifecycle, detect resource leaks", build: false },
                    { text: "Memory leak patterns — closures retaining references, event listeners not removed", build: false },
                ],
            },
            {
                title: "Load Testing",
                items: [
                    { text: "k6 — load testing in JS, virtual users, ramp-up stages, custom metrics, thresholds", build: false },
                    { text: "autocannon — fast HTTP benchmarking, pipelining, latency percentiles", build: false },
                    { text: "Reading results — p50/p95/p99 latency, throughput (req/s), error rate, timeouts", build: false },
                    { text: "Finding the bottleneck — CPU bound, I/O bound, DB bound, memory bound — different fixes", build: false },
                    { text: "Capacity planning — RPS capacity per instance, replicas needed for N req/s at p99 target", build: false },
                ],
            },
            {
                title: "Common Bottlenecks",
                items: [
                    { text: "N+1 queries — most common ORM mistake, detect with query count middleware", build: false },
                    { text: "Missing indexes — find with pg_stat_statements, slow query log, auto_explain", build: false },
                    { text: "Connection pool exhaustion — pool size tuning, queuing, PgBouncer", build: false },
                    { text: "Event loop blocking — synchronous work in hot path, JSON.parse on large payloads", build: false },
                    { text: "Serialization overhead — JSON stringify on hot path, consider MessagePack or protobuf", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Profile a real Node app with --prof — generate flamegraph, identify the hot function", build: true },
                    { text: "Load test with k6 — find at what concurrency p99 latency exceeds SLA", build: true },
                    { text: "Find and fix an N+1 query — measure query count before/after, show latency improvement", build: true },
                    { text: "Take heap snapshots before and after a suspected leak — diff and identify the retained path", build: true },
                ],
            },
        ],
    },
    {
        phase: "18",
        title: "Infrastructure & DevOps",
        tag: "Deployment",
        duration: "Week 26–27",
        color: "#e8a047",
        why: "Backend engineers must own how their systems run in production. Docker and Nginx are not ops work — they're yours.",
        sections: [
            {
                title: "Docker Deep Dive",
                items: [
                    { text: "Container internals — Linux namespaces (pid, net, mnt, uts, ipc) + cgroups for resource limits", build: false },
                    { text: "Image layers — copy-on-write filesystem, why Dockerfile instruction order matters for cache", build: false },
                    { text: "Multi-stage builds — separate build and runtime stages, minimize final image attack surface", build: false },
                    { text: "Docker networking — bridge, host, overlay, DNS resolution between containers by name", build: false },
                    { text: "Volumes — named vs bind mounts, data persistence, backup patterns", build: false },
                    { text: "Docker Compose — depends_on with healthcheck condition, profiles, env files", build: false },
                    { text: "Non-root user — USER directive, why running as root in container is dangerous", build: false },
                    { text: ".dockerignore — exclude node_modules, .git, secrets — affects build context size and security", build: false },
                ],
            },
            {
                title: "Nginx",
                items: [
                    { text: "Architecture — master process, worker processes, event-driven model, epoll", build: false },
                    { text: "Reverse proxy — proxy_pass, proxy_set_header, X-Forwarded-For, X-Real-IP", build: false },
                    { text: "SSL termination — ssl_certificate, ssl_certificate_key, HTTPS to HTTP internally", build: false },
                    { text: "Load balancing — upstream block, round-robin, least_conn, ip_hash, health checks", build: false },
                    { text: "WebSocket proxying — proxy_http_version 1.1, Upgrade and Connection headers", build: false },
                    { text: "Rate limiting — limit_req_zone, limit_req directive, burst parameter", build: false },
                    { text: "Gzip compression — gzip_types, minimum length, when not to compress", build: false },
                    { text: "Static file serving — root vs alias, try_files, efficient static asset delivery", build: false },
                ],
            },
            {
                title: "CI/CD",
                items: [
                    { text: "GitHub Actions — workflow syntax, triggers (push, PR, schedule), jobs, matrix strategy", build: false },
                    { text: "Secrets management — GitHub Actions secrets, never log them, rotation policy", build: false },
                    { text: "Zero-downtime deploys — rolling updates, blue/green, health check gate before cutover", build: false },
                    { text: "Docker image tagging — :latest (bad), :sha (good), :semver (for releases)", build: false },
                    { text: "Rollback strategy — keep previous image, one-command rollback, automated trigger on error rate", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Production multi-stage Dockerfile for Node app — non-root, minimal image, correct COPY order", build: true },
                    { text: "Nginx config with SSL termination, WebSocket proxying, rate limiting, gzip", build: true },
                    { text: "GitHub Actions pipeline — lint → test → docker build → push to registry → deploy", build: true },
                    { text: "Zero-downtime deploy on a fresh VPS — Docker + Nginx health check gate", build: true },
                ],
            },
        ],
    },
    {
        phase: "19",
        title: "Cloud Architecture",
        tag: "Infrastructure",
        duration: "Week 28",
        color: "#ffa502",
        why: "Most backend systems run on cloud infrastructure. Understanding cloud primitives makes you dangerous on any provider.",
        sections: [
            {
                title: "Cloud Fundamentals",
                items: [
                    { text: "Regions and availability zones — geographic redundancy, AZ-level failure isolation", build: false },
                    { text: "IaaS vs PaaS vs SaaS — where the abstraction line is, what you still manage", build: false },
                    { text: "Shared responsibility model — cloud provider owns physical, you own everything above", build: false },
                    { text: "Autoscaling — launch templates, scaling policies, target tracking, warm-up time, cooldown", build: false },
                    { text: "Managed services tradeoff — RDS vs self-managed Postgres: operational cost vs control", build: false },
                ],
            },
            {
                title: "Storage",
                items: [
                    { text: "Object storage (S3) — eventual consistency, storage classes, lifecycle rules, versioning", build: false },
                    { text: "Presigned URLs — time-limited direct client upload/download, bypass your server entirely", build: false },
                    { text: "Block storage (EBS) — IOPS tiers, volume types, snapshots, multi-attach limitations", build: false },
                    { text: "CDN — edge PoPs, origin pull, cache key configuration, invalidation API", build: false },
                    { text: "Managed database — automatic backups, read replicas, failover, connection limits", build: false },
                ],
            },
            {
                title: "Networking",
                items: [
                    { text: "VPC — subnets (public/private), route tables, internet gateway, NAT gateway", build: false },
                    { text: "Security groups vs NACLs — stateful vs stateless, evaluation order", build: false },
                    { text: "Load balancers — ALB (HTTP, path routing) vs NLB (TCP, low latency), health checks", build: false },
                    { text: "Private subnets — databases behind NAT, bastion host / Session Manager access", build: false },
                    { text: "VPC peering and PrivateLink — private connectivity between services", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Deploy a full-stack app on AWS — VPC, EC2+Docker, RDS, S3, ALB, security groups", build: true },
                    { text: "Implement direct file upload to S3 with presigned URLs — files never touch your server", build: true },
                    { text: "Set up CDN in front of S3 — configure cache TTLs, test invalidation after update", build: true },
                ],
            },
        ],
    },
    {
        phase: "20",
        title: "System Design",
        tag: "Interview Prep",
        duration: "Week 29–30",
        color: "#ff6b35",
        why: "System design is where everything you've learned converges. It's what senior engineers and serious companies actually test.",
        sections: [
            {
                title: "Scaling Patterns",
                items: [
                    { text: "Horizontal vs vertical scaling — statelessness requirement for horizontal, limits of vertical", build: false },
                    { text: "Load balancing algorithms — round-robin, least connections, consistent hashing", build: false },
                    { text: "Read replicas — replication lag, read-after-write consistency problem and solutions", build: false },
                    { text: "Database sharding — range vs hash sharding, hotspot problem, cross-shard queries, resharding", build: false },
                    { text: "CQRS at scale — separate read/write databases, eventual consistency explicitly accepted", build: false },
                    { text: "Multi-region — active-active vs active-passive, conflict resolution, data sovereignty", build: false },
                ],
            },
            {
                title: "Classic Design Problems",
                items: [
                    { text: "URL shortener — hash function, collision handling, redirect, click analytics, CDN caching", build: false },
                    { text: "Rate limiter service — distributed, per-user and per-IP, sliding window, Redis cluster", build: false },
                    { text: "Notification system — fanout strategies, push vs pull, delivery guarantees, multi-channel", build: false },
                    { text: "Twitter/news feed — fanout on write vs read, celebrity problem, Redis timeline cache", build: false },
                    { text: "Video upload pipeline — chunked upload, queue, transcoding workers, streaming delivery", build: false },
                    { text: "Distributed key-value store — consistent hashing, replication factor, quorum reads/writes", build: false },
                    { text: "Real-time collaborative editor — OT vs CRDT, conflict resolution, operational history", build: false },
                ],
            },
            {
                title: "Interview Framework",
                items: [
                    { text: "Clarify requirements — functional, non-functional, scale (DAU, peak QPS, data volume)", build: false },
                    { text: "Capacity estimation — storage per day, read/write QPS, bandwidth, instances needed", build: false },
                    { text: "High-level design — core components, data flow, API surface, key tradeoffs", build: false },
                    { text: "Deep dive — bottlenecks, failure modes, scaling path, observability", build: false },
                    { text: "Draw architecture diagrams for all your own projects — justify every technology decision", build: false },
                ],
            },
            {
                title: "Build",
                items: [
                    { text: "Build a URL shortener from scratch — no tutorial, requirements only: short URL, redirect, analytics", build: true },
                    { text: "Build a notification fanout system — BullMQ workers, email + webhook delivery channels", build: true },
                    { text: "Do 5 mock system design interviews out loud — record yourself, review the recording", build: true },
                ],
            },
        ],
    },
    {
        phase: "21",
        title: "DSA for Interviews",
        tag: "Interview Prep",
        duration: "Week 31",
        color: "#ff6b35",
        why: "Not competitive programming. Just enough to pass technical screens at companies that pay well. Patterns over memorization.",
        sections: [
            {
                title: "Data Structures",
                items: [
                    { text: "Arrays & strings — two pointers, sliding window, prefix sums, in-place manipulation", build: false },
                    { text: "Hash maps — frequency counting, two-sum variants, grouping, complement lookup", build: false },
                    { text: "Stacks — valid parentheses, monotonic stack, next greater element", build: false },
                    { text: "Queues & deques — BFS level-order traversal, sliding window maximum", build: false },
                    { text: "Linked lists — reversal, cycle detection (Floyd's), merge sorted, find middle", build: false },
                    { text: "Binary trees — DFS (pre/in/post), BFS, LCA, diameter, path sums", build: false },
                    { text: "Graphs — adjacency list, BFS/DFS, topological sort (Kahn's), union-find, Dijkstra", build: false },
                    { text: "Heaps / priority queues — top-K elements, merge K sorted, median of stream", build: false },
                ],
            },
            {
                title: "Algorithm Patterns",
                items: [
                    { text: "Binary search — sorted arrays, rotated arrays, search on answer space", build: false },
                    { text: "Sliding window — fixed size, variable size with character frequency", build: false },
                    { text: "Two pointers — sorted arrays, palindrome check, container with most water", build: false },
                    { text: "BFS vs DFS — BFS for shortest path/levels, DFS for backtracking/connectivity", build: false },
                    { text: "Dynamic programming — recognize optimal substructure, memoize first then tabulate", build: false },
                    { text: "Top DP problems — coin change, LCS, 0/1 knapsack, edit distance, LIS, word break", build: false },
                    { text: "Greedy — interval scheduling, activity selection, when greedy provably works", build: false },
                    { text: "Backtracking — permutations, combinations, subsets, N-queens template", build: false },
                ],
            },
            {
                title: "Practice Plan",
                items: [
                    { text: "NeetCode 150 — curated, covers every pattern, do in recommended order", build: false },
                    { text: "Solve each problem, then re-solve 3 days later without looking — spaced repetition", build: false },
                    { text: "Explain approach out loud before writing code — that's the interview", build: false },
                    { text: "Target: 25 minutes per medium problem — time yourself every time", build: false },
                    { text: "60–80 problems done deeply beats 200 done shallowly", build: false },
                ],
            },
        ],
    },
    {
        phase: "22",
        title: "Build to Master",
        tag: "Final Mile",
        duration: "Week 32+",
        color: "#00ff88",
        why: "Reading builds recognition. Building builds recall. These projects are chosen to force you to combine everything you've learned under time pressure.",
        sections: [
            {
                title: "Tier 1 — Core Muscle Memory (2–4 hrs each)",
                items: [
                    { text: "URL shortener — hash, collision, Redis cache, click analytics, Postgres persistence", build: true },
                    { text: "JWT auth service — sign, verify, refresh rotation, token family revocation — jsonwebtoken only", build: true },
                    { text: "Rate limiter middleware — sliding window, Redis sorted sets, exportable as npm package", build: true },
                    { text: "In-memory key-value store — TTL, LRU eviction, get/set/delete/expire — CLI interface", build: true },
                    { text: "Task queue — BullMQ, exponential backoff retries, DLQ, Bull Board monitoring", build: true },
                    { text: "File upload service — multipart, S3, presigned URLs, size and type validation", build: true },
                ],
            },
            {
                title: "Tier 2 — System Depth (1–2 days each)",
                items: [
                    { text: "Real-time chat — WebSocket rooms, Redis pub/sub multi-server, presence, message history", build: true },
                    { text: "Notification fanout — write vs read fanout, BullMQ workers, email + webhook, retries", build: true },
                    { text: "API gateway — Node reverse proxy, per-route rate limiting, JWT validation, request logging", build: true },
                    { text: "Webhook engine — HMAC verification, queue processing, idempotency, retry backoff", build: true },
                    { text: "Full-text search — Postgres tsvector, ranked results, autocomplete with trigrams, GIN index", build: true },
                    { text: "Distributed cron — Redis lock prevents duplicate runs, job history, failure alerts", build: true },
                ],
            },
            {
                title: "Tier 3 — Interview Gold (2–5 days each)",
                items: [
                    { text: "Twitter/feed clone — follow graph, fanout on write, cursor pagination, Redis timeline cache", build: true },
                    { text: "Distributed lock service — Redlock algorithm, lease renewal, fencing tokens, HTTP API", build: true },
                    { text: "Event sourcing store — append-only log, state reconstruction, snapshots, replay API", build: true },
                    { text: "Metrics collector — time-series ingestion, p50/p95/p99 aggregation, Prometheus-compatible", build: true },
                    { text: "Collaborative document — OT or CRDT conflict resolution, WebSockets, version history", build: true },
                    { text: "Video pipeline — chunked upload → queue → FFmpeg transcode → S3 → stream, SSE progress", build: true },
                ],
            },
            {
                title: "Non-negotiable Rules",
                items: [
                    { text: "Zero AI for writing code — docs, source code, Stack Overflow only. AI only to explain errors after you've genuinely tried.", build: false },
                    { text: "Time every build — anything taking 3× longer than expected is your next study target", build: false },
                    { text: "Write a README with architecture diagram — every technology decision justified in writing", build: false },
                    { text: "Every project gets: structured logging, /health endpoint, graceful shutdown, Docker support", build: false },
                    { text: "After finishing: explain the entire system out loud in 5 minutes as if in a technical interview", build: false },
                ],
            },
        ],
    },
];

export function getItemKey(phaseIndex: number, sectionTitle: string, itemIndex: number): string {
    return `${phaseIndex}-${sectionTitle}-${itemIndex}`;
}

export function getTotalItems(): number {
    return roadmap.reduce(
        (acc, phase) => acc + phase.sections.reduce((sacc, s) => sacc + s.items.length, 0),
        0
    );
}

export function getTotalBuildItems(): number {
    return roadmap.reduce(
        (acc, phase) =>
            acc + phase.sections.reduce((sacc, s) => sacc + s.items.filter((i) => i.build).length, 0),
        0
    );
}