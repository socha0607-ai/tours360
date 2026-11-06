package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

//go:embed static/*
var embeddedFiles embed.FS

type ShootInquiry struct {
	Developer string `json:"developer"`
	Project   string `json:"project"`
	Location  string `json:"location"`
	Carpet    string `json:"carpet"`
	Contact   string `json:"contact"`
	Phone     string `json:"phone"`
	CreatedAt string `json:"createdAt"`
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	staticFS, err := fs.Sub(embeddedFiles, "static")
	if err != nil {
		log.Fatal(err)
	}
	fileServer := http.FileServer(http.FS(staticFS))

	mux := http.NewServeMux()

	// 0. Admin Inquiries API Route
	mux.HandleFunc("/api/inquiries", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache")

		data, err := os.ReadFile("inquiries.json")
		if err != nil {
			w.Write([]byte("[]"))
			return
		}

		// inquiries.json stores one JSON object per line; convert to JSON array
		lines := strings.Split(strings.TrimSpace(string(data)), "\n")
		var items []string
		for _, l := range lines {
			l = strings.TrimSpace(l)
			if l != "" {
				items = append(items, l)
			}
		}

		w.Write([]byte("[" + strings.Join(items, ",") + "]"))
	})

	// 1. JSON API Route (क्लाइंट्स, बिल्डर्स और टीममेट्स का डेटा)
	mux.HandleFunc("/api/data", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "public, max-age=60")
		data, err := embeddedFiles.ReadFile("static/data.json")
		if err != nil {
			http.Error(w, `{"error":"data not found"}`, http.StatusNotFound)
			return
		}
		w.Write(data)
	})

	// 2. 48-Hour Demo Shoot Inquiry Booking Endpoint
	mux.HandleFunc("/api/book-shoot", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
			return
		}

		var inq ShootInquiry
		if err := json.NewDecoder(r.Body).Decode(&inq); err != nil {
			http.Error(w, `{"error":"Invalid JSON payload"}`, http.StatusBadRequest)
			return
		}
		inq.CreatedAt = time.Now().Format(time.RFC3339)

		// 1. Persistent Storage in inquiries.json
		inqData, _ := json.Marshal(inq)
		f, err := os.OpenFile("inquiries.json", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err == nil {
			f.WriteString(string(inqData) + "\n")
			f.Close()
		}

		// 2. Instant Telegram Notification Alert (Standard Library HTTP - Zero External Packages)
		botToken := os.Getenv("9063590356:AAF2O3d23E3BSXdnF7mDyWg0qKcUUgtds78")
		chatID := os.Getenv("9156762292")
		if botToken != "" && chatID != "" {
			msgText := fmt.Sprintf(
				"🚨 *नई 48-Hour Demo Shoot इंक्वायरी!*\n\n"+
					"🏢 *डेवलपर:* %s\n"+
					"📍 *प्रोजेक्ट:* %s (%s)\n"+
					"📐 *साइज:* %s\n"+
					"👤 *कांटेक्ट:* %s\n"+
					"📞 *फोन/व्हाट्सएप:* %s\n"+
					"⏰ *समय:* %s",
				inq.Developer, inq.Project, inq.Location, inq.Carpet, inq.Contact, inq.Phone, inq.CreatedAt,
			)

			apiURL := fmt.Sprintf(
				"https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=Markdown",
				botToken, chatID, url.QueryEscape(msgText),
			)
			go func() {
				client := &http.Client{Timeout: 5 * time.Second}
				client.Get(apiURL)
			}()
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"success","message":"Inquiry logged successfully"}`))
	})

	// 3. Smart Multi-Tenant Router:
	// - "/"                    -> Main Agency UI (tours360.in)
	// - "/b/rajesh-builders"   -> Builder Sub-UI
	// - "/view/imperial-3bhk"  -> Direct 360° Viewer (QR Code से सीधा खुलेगा)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// अगर कोई स्टैटिक फाइल (.css, .js, .webp, .json) मांगी गई है
		if strings.Contains(path, ".") {
			w.Header().Set("Cache-Control", "public, max-age=86400")
			fileServer.ServeHTTP(w, r)
			return
		}

		// सभी डायनामिक राउट्स (/b/* और /view/*) के लिए मुख्य SPA index.html सर्व करें
		indexData, err := embeddedFiles.ReadFile("static/index.html")
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexData)
	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("🚀 Tours360 Server running on http://localhost:%s", port)
	log.Fatal(server.ListenAndServe())
}
