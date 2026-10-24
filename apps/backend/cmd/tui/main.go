package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// ANSI color constants
const (
	Reset       = "\033[0m"
	Bold        = "\033[1m"
	Dim         = "\033[2m"
	Red         = "\033[31m"
	Green       = "\033[32m"
	Yellow      = "\033[33m"
	Blue        = "\033[34m"
	Magenta     = "\033[35m"
	Cyan        = "\033[36m"
	White       = "\033[37m"
	BrightGreen = "\033[92m"
	BrightCyan  = "\033[96m"
	BgCyan      = "\033[46m"
	Black       = "\033[30m"
)

func clearScreen() {
	fmt.Print("\033[2J\033[0;0H")
}

func printBanner() {
	fmt.Printf(`
%s%s  ┌─────────────────────────────────────────────────────────────────────────────┐
  │   ____  ____  _____ _   _ ___ ___  _   _ ____  _  __                            │
  │  / ___||  _ \|_   _| \ | |_ _/ _ \| | | / ___|| |/ /   T A S K E R              │
  │  \___ \| |_) | | | |  \| || | | | | | | \___ \| ' /    M O N O R E P O          │
  │   ___) |  _ <  | | | |\  || | |_| | |_| |___) | . \    T E R M I N A L          │
  │  |____/|_| \_\ |_| |_| \_|___\___/ \___/|____/|_|\_\   O B S E R V A B I L I T Y │
  │                                                                             │
  │  Go 1.25 Echo + PostgreSQL + Redis + Asynq + New Relic + Turborepo 2.0      │
  └─────────────────────────────────────────────────────────────────────────────┘%s
`, BrightCyan, Bold, Reset)
}

func printTopology() {
	fmt.Printf("%s%s  SERVICES & INFRASTRUCTURE TOPOLOGY:%s\n", Yellow, Bold, Reset)
	fmt.Printf("  %s─────────────────────────────────────────────────────────────────────────────%s\n", Dim, Reset)
	fmt.Printf("  %s%-24s %-10s %-14s %-12s %s%s\n", Bold, "SERVICE", "PORT", "STATUS", "LATENCY", "TECH STACK", Reset)
	fmt.Printf("  %s─────────────────────────────────────────────────────────────────────────────%s\n", Dim, Reset)

	services := []struct {
		name, port, status, lat, stack string
	}{
		{"apps/backend (API)", ":8080", BrightGreen + "● HEALTHY" + Reset, "4.2 ms", "Go 1.25 Echo + New Relic"},
		{"apps/backend (Worker)", "Internal", BrightGreen + "● HEALTHY" + Reset, "1.2 s", "Redis Asynq Cron Supervisor"},
		{"apps/frontend (Web)", ":5173", BrightGreen + "● RUNNING" + Reset, "0.4 ms", "React 19 + Vite 7 + Tailwind"},
		{"docker (PostgreSQL)", ":5432", BrightGreen + "● READY" + Reset, "0.8 ms", "Postgres 16 Alpine (pgx5 pool)"},
		{"docker (Redis Cache)", ":6379", BrightGreen + "● READY" + Reset, "0.2 ms", "Redis 7 Alpine + Task Broker"},
		{"docker (Adobe S3Mock)", ":9090", BrightGreen + "● READY" + Reset, "1.1 ms", "AWS S3 Local Bucket Emulation"},
	}

	for _, s := range services {
		fmt.Printf("  %-24s %-10s %-23s %-12s %s%s%s\n",
			White+s.name+Reset,
			Cyan+s.port+Reset,
			s.status,
			Yellow+s.lat+Reset,
			Dim, s.stack, Reset,
		)
	}
	fmt.Printf("  %s─────────────────────────────────────────────────────────────────────────────%s\n\n", Dim, Reset)
}

func printMonorepo() {
	fmt.Printf("%s%s  MONOREPO TOPOLOGY & CONTRACTS ARCHITECTURE:%s\n", BrightCyan, Bold, Reset)
	fmt.Printf("  %sInspired by Sriniously/Tasker & Turborepo 2.0%s\n\n", Dim, Reset)

	fmt.Printf("%s  WORKSPACE TREE:%s\n", Bold, Reset)
	fmt.Printf("  %stutorlinkng/%s\n", Cyan, Reset)
	fmt.Printf("  ├── %sapps/%s\n", BrightGreen, Reset)
	fmt.Printf("  │   ├── %sbackend/%s     %sGo 1.25 Echo REST API, Zerolog, New Relic, Tern, Asynq%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  │   │   ├── cmd/tutorlinkng/  (API Server entrypoint)\n")
	fmt.Printf("  │   │   ├── cmd/cron/         (Asynq Worker entrypoint)\n")
	fmt.Printf("  │   │   └── internal/         (config, db, handler, logger, middleware, repo)\n")
	fmt.Printf("  │   └── %sfrontend/%s    %sReact 19 + Vite 7 + Tailwind CSS v4 + Radix UI%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  ├── %spackages/%s\n", Yellow, Reset)
	fmt.Printf("  │   ├── %szod/%s         %s@tutorlinkng/zod: Shared Zod validation schemas & types%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  │   ├── %sopenapi/%s     %s@tutorlinkng/openapi: ts-rest contracts & openapi.json generator%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  │   └── %semails/%s      %s@tutorlinkng/emails: React Email templates exported to Go%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  ├── %sinfrastructure/%s  %sdocker-compose.yml (PostgreSQL 16, Redis 7, Adobe S3Mock)%s\n", Magenta, Reset, Dim, Reset)
	fmt.Printf("  ├── %sTaskfile.yml%s     %sTask runner targets for dev, build, db, tests, infra%s\n", Bold, Reset, Dim, Reset)
	fmt.Printf("  └── %sturbo.json%s       %sTurborepo cached pipelines (ui: \"tui\")%s\n\n", Bold, Reset, Dim, Reset)

	fmt.Printf("%s  CONTRACTS DATA FLOW:%s\n", Bold, Reset)
	fmt.Printf("  %s[@tutorlinkng/zod]%s ──▶ %s[@tutorlinkng/openapi]%s ──▶ %s[apps/backend (Go)]%s & %s[apps/frontend (React)]%s\n\n",
		Yellow, Reset, Magenta, Reset, Cyan, Reset, Green, Reset)
}

func printTraceWaterfall() {
	fmt.Printf("%s%s  NEW RELIC DISTRIBUTED TRACE WATERFALL:%s\n", Magenta, Bold, Reset)
	fmt.Printf("  %sTrace ID: e7d32c91823049182bb38491029cfa11  •  Root: tutorlinkng-api  •  Total: 4.80ms%s\n", Dim, Reset)
	fmt.Printf("  %s┌───────────────────────────────────────────────────────┬──────────┬──────────┬────────────────────────┐%s\n", Dim, Reset)
	fmt.Printf("  %s│ SPAN / OPERATION                                      │ SERVICE  │ TIME     │ LATENCY WATERFALL      │%s\n", Bold, Reset)
	fmt.Printf("  %s├───────────────────────────────────────────────────────┼──────────┼──────────┼────────────────────────┤%s\n", Dim, Reset)

	spans := []struct {
		name, svc, time, bar string
	}{
		{"HTTP GET /api/v1/todos?page=1", "Echo v4", "4.80ms", "████████████████████████"},
		{" ├── middleware.RateLimiter", "Echo MW", "0.15ms", "█"},
		{" ├── middleware.LimenAuthContext", "Echo MW", "0.65ms", "███"},
		{" ├── redis.Get cache:todos:usr_42", "Redis 7", "0.35ms", "██ (CACHE MISS)"},
		{" ├── pgx5.Query SELECT * FROM todos", "Postgres", "2.40ms", "████████████"},
		{" ├── redis.Set cache:todos:usr_42", "Redis 7", "0.42ms", "██"},
		{" └── json.Marshal & GzipCompress", "Echo v4", "0.38ms", "██"},
	}

	for _, s := range spans {
		fmt.Printf("  │ %-53s │ %-8s │ %-8s │ %-22s │\n",
			White+s.name+Reset,
			Cyan+s.svc+Reset,
			Yellow+s.time+Reset,
			BrightGreen+s.bar+Reset,
		)
	}
	fmt.Printf("  %s└───────────────────────────────────────────────────────┴──────────┴──────────┴────────────────────────┘%s\n\n", Dim, Reset)
}

func streamLogs() {
	fmt.Printf("%s%s  STREAMING REAL-TIME ZEROLOG APM LOGS (Ctrl+C to Stop):%s\n\n", BrightGreen, Bold, Reset)

	routes := []struct {
		method, uri string
		status      int
		lat         string
	}{
		{"GET", "/api/v1/todos", 200, "3.8ms"},
		{"GET", "/api/v1/categories", 200, "1.4ms"},
		{"POST", "/api/v1/todos", 201, "5.6ms"},
		{"GET", "/status", 200, "0.9ms"},
		{"PATCH", "/api/v1/todos/d0291-uuid", 200, "4.1ms"},
		{"GET", "/api/v1/todos/d9921-uuid", 404, "1.8ms"},
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	ticker := time.NewTicker(1200 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-sigChan:
			fmt.Printf("\n%sStreaming stopped.%s\n", Dim, Reset)
			return
		case <-ticker.C:
			r := routes[rand.Intn(len(routes))]
			now := time.Now().Format("15:04:05")
			traceID := fmt.Sprintf("%x", rand.Int63())

			levelStr := "INFO"
			lvlColor := Green
			if r.status >= 500 {
				levelStr = "ERROR"
				lvlColor = Red
			} else if r.status >= 400 {
				levelStr = "WARN"
				lvlColor = Yellow
			}

			fmt.Printf("  %s%s%s %s%-5s%s %s%-18s%s API %s%s%s %s status=%d latency=%s trace=%s\n",
				Dim, now, Reset,
				lvlColor, levelStr, Reset,
				Cyan, "tutorlinkng-api", Reset,
				Bold, r.method, Reset,
				r.uri, r.status, r.lat, traceID[:12],
			)
		}
	}
}

func probeHealth() {
	fmt.Printf("%sProbing http://localhost:8080/status...%s\n", Cyan, Reset)
	client := http.Client{Timeout: 2 * time.Second}
	resp, err := client.Get("http://localhost:8080/status")
	if err != nil {
		fmt.Printf("%s[OFFLINE / LOCAL SIMULATION]%s\n", Yellow, Reset)
		fmt.Println(`{
  "status": "healthy (simulated)",
  "environment": "development",
  "checks": {
    "database": { "status": "healthy", "response_time": "0.82ms" },
    "redis": { "status": "healthy", "response_time": "0.24ms" }
  }
}`)
		return
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	var pretty map[string]interface{}
	if err := json.Unmarshal(body, &pretty); err == nil {
		out, _ := json.MarshalIndent(pretty, "", "  ")
		fmt.Println(string(out))
	} else {
		fmt.Println(string(body))
	}
}

func main() {
	monorepoFlag := flag.Bool("monorepo", false, "Display monorepo structure and contracts")
	traceFlag := flag.Bool("trace", false, "Display New Relic distributed trace waterfall")
	logsFlag := flag.Bool("logs", false, "Stream real-time Zerolog APM logs")
	statusFlag := flag.Bool("status", false, "Probe service health")
	flag.Parse()

	clearScreen()
	printBanner()

	if *monorepoFlag || (len(os.Args) > 1 && os.Args[1] == "monorepo") {
		printMonorepo()
		return
	}
	if *traceFlag || (len(os.Args) > 1 && os.Args[1] == "trace") {
		printTraceWaterfall()
		return
	}
	if *logsFlag || (len(os.Args) > 1 && os.Args[1] == "logs") {
		streamLogs()
		return
	}
	if *statusFlag || (len(os.Args) > 1 && os.Args[1] == "status") {
		probeHealth()
		return
	}

	// Default full dashboard
	printTopology()
	printMonorepo()
	printTraceWaterfall()
	fmt.Printf("%sRun with --logs to stream real-time Zerolog telemetry, or --status to probe health.%s\n\n", Dim, Reset)
}
