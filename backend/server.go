package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"

	_ "github.com/go-kivik/couchdb/v4"
	kivik "github.com/go-kivik/kivik/v4"
)

// e.GET("/users/:id", getUser)
func getUser(c echo.Context) error {
	// User ID from path `users/:id`
	id := c.Param("id")
	return c.String(http.StatusOK, id)
}

// e.GET("/raw", getRawData)
func getRawData(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}

func main() {
	e := echo.New()

	// Establish connection with couchdb
	client, err := kivik.New("couch", "http://admin:admin@172.26.132.83:5984/")
	if err != nil {
		panic(err)
	}

	// Retrieve all databases
	all_db, _ := client.AllDBs(context.TODO())
	fmt.Println(all_db)

	// Create a database named test
	client.CreateDB(context.TODO(), "animals")

	// Get the test database
	animal_db := client.DB("animals")

	// Insert some random data
	doc := map[string]interface{}{
		"_id":      "cow",
		"feet":     4,
		"greeting": "moo",
	}

	rev, err := animal_db.Put(context.TODO(), "cow", doc)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Cow inserted with revision %s\n", rev)

	// Routers
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/users/:id", getUser)
	e.GET("/raw", getRawData)

	// Starting server
	e.Logger.Fatal(e.Start(":1323"))
}
