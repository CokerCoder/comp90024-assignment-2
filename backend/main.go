package main

import (
    "context"
    "fmt"

	// 这是两个kivik包需要用到的import
    kivik "github.com/go-kivik/kivik/v3" // import xxx as kivik
    _ "github.com/go-kivik/couchdb/v3" // The CouchDB driver
)

func main() {

	// 连接本地数据库，返回的client是调用数据库的实例
    client, err := kivik.New("couch", "http://admin:123456@localhost:5984/")
    if err != nil {
        panic(err)
    }

	// 这一段代码还不会用
    // usersDB := client.DB(context.TODO(), "_users") // Connect to the _users database
	// fmt.Println("Hello")
	// fmt.Println(usersDB)
	// user := map[string]interface{}{
	// 		"_id":      kivik.UserPrefix + "username",
	// 		"type":     "user",
	// 		"password": "abc123",
	// 	}
	// rev, _ := usersDB.Put(context.TODO(), kivik.UserPrefix+"username", user)
	// fmt.Println(rev)


	// 定义一个新的数据类型Animal
	type Animal struct {
		ID       string `json:"_id"`
		Rev      string `json:"_rev,omitempty"`
		Feet     int    `json:"feet"`
		Greeting string `json:"greeting"`
	}

	// 拿到couchdb中的animals数据库
	animalsDB := client.DB(context.TODO(), "animals")
	
	// 新建一个cow并放到animals数据库中
	cow := Animal{ID: "cow2", Feet: 4, Greeting: "moo"}
	fmt.Println(cow)
	rev2, err2 := animalsDB.Put(context.TODO(), "cow2", cow)
	if err2 != nil {
		panic(err2)
	}
	cow.Rev = rev2
}