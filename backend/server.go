package main

import (
	"strconv"
	"context"
	"encoding/json"
    "os"
	"fmt"
	"net/http"
	"github.com/labstack/echo/v4"

	_ "github.com/go-kivik/couchdb/v4"
	kivik "github.com/go-kivik/kivik/v4"
)

type Configuration struct {  
	DB_USERNAME string  
	DB_PASSWORD string  
	DB_PORT     string  
	DB_HOST     string  
	DB_NAME     string
}

// Store the database as a global variable
var db *kivik.DB

func welcome(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World!")
}

func getRawData(c echo.Context) error {
	docs, err := db.AllDocs(context.TODO())
	if err != nil {
		panic(err)
	}
	// return c.String(http.StatusOK, strconv.Itoa(docs.TotalRows()))
}

func main() {
	// Read config file
	file, _ := os.Open("config.json")
	defer file.Close()
	decoder := json.NewDecoder(file)
	configuration := Configuration{}
	err := decoder.Decode(&configuration)
	if err != nil {
		fmt.Println("error:", err)
	}

	// Establish connection with couchdb
	client, err := kivik.New("couch", fmt.Sprintf("http://%s:%s@%s:%s/", configuration.DB_USERNAME, configuration.DB_PASSWORD, configuration.DB_HOST, configuration.DB_PORT))
	if err != nil {
		panic(err)
	}

	// Get the test database
	db = client.DB(configuration.DB_NAME)

	e := echo.New()

	// Routers
	e.GET("/", welcome)
	e.GET("/raw", getRawData)
	e.GET("/test", func(c echo.Context) error {
		return c.String(http.StatusOK, "test")
	})

	// Starting server at port 1234
	e.Logger.Fatal(e.Start(":1234"))
}
