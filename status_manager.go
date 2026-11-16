package main

import (
	"encoding/json"
	"net/http"
	"os"
	"sync"
)

type StatusStore struct {
	mu       sync.RWMutex
	Projects map[string]bool `json:"projects"` // true = Green (Active), false = Red (Paused)
	FilePath string
}

var store = &StatusStore{
	Projects: map[string]bool{
		"tathastu-greens":     true,
		"imperial-grand-4bhk": true,
		"maheshwari-infra":    true,
	},
	FilePath: "data/status.json",
}

func getAdminPin() string {
	if pin := os.Getenv("ADMIN_PIN"); pin != "" {
		return pin
	}
	return "202699"
}

func initStatusStore() {
	_ = os.MkdirAll("data", 0755)
	bytes, err := os.ReadFile(store.FilePath)
	if err == nil {
		store.mu.Lock()
		_ = json.Unmarshal(bytes, &store.Projects)
		store.mu.Unlock()
	}
}

func (s *StatusStore) saveToDisk() {
	bytes, _ := json.MarshalIndent(s.Projects, "", "  ")
	_ = os.WriteFile(store.FilePath, bytes, 0644)
}

func isProjectActive(slug string) bool {
	store.mu.RLock()
	defer store.mu.RUnlock()
	active, exists := store.Projects[slug]
	if !exists {
		return true // Active by default unless paused
	}
	return active
}

// 1. Public API: widget.js & viewer check (CORS Enabled)
func handlePublicStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	slug := r.URL.Query().Get("client")
	_ = json.NewEncoder(w).Encode(map[string]bool{
		"active": isProjectActive(slug),
	})
}

// 2. Admin API: List all projects and their Green/Red status
func handleAdminList(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-Admin-Pin") != getAdminPin() {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	store.mu.RLock()
	defer store.mu.RUnlock()
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(store.Projects)
}

// 3. Admin API: Toggle Green <-> Red live
func handleAdminToggle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.Header.Get("X-Admin-Pin") != getAdminPin() {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var req struct {
		Slug   string `json:"slug"`
		Active bool   `json:"active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	store.Projects[req.Slug] = req.Active
	store.saveToDisk()
	store.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"slug":   req.Slug,
		"active": req.Active,
	})
}
