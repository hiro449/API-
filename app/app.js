const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const dbpath = "app/db/datebase.sqlite3"
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))//htmlから呼ばなくてもよくなる？？

app.get('/api/v1/users', (req, res) => {
     const db = new sqlite3.Database(dbpath)

     db.all('SELECT * FROM users', (error, rows) =>{
          if(!rows){
               res.status(404).send({error: "Not Found"})

          } else {
               res.status(200).json(rows)
          }
     })
     db.close()
})

//idの人がフォローしている
app.get('/api/v1/users/:id/following', (req, res) => {
     const db = new sqlite3.Database(dbpath)
     const id = req.params.id //ONはくっつける場所

     db.all(`SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id = ${id};`, (error, rows) =>{
          if(!rows){
               res.status(404).send({error: "Not Found"})

          } else {
               res.status(200).json(rows)
          }
     })
     db.close()
})


app.get('/api/v1/users/:id/following/:id2', (req, res) => {
     const db = new sqlite3.Database(dbpath)
     const id = req.params.id //ONはくっつける場所
     const id2 = req.params.id2

     db.all(`SELECT * FROM following LEFT JOIN users ON following.followed_id = users.id WHERE following_id = ${id} AND followed_id = ${id2};`, (error, rows) =>{
          if(!rows){
               res.status(404).send({error: "Not Found"})

          } else {
               res.status(200).json(rows)
          }
     })
     db.close()
})


app.get('/api/v1/users/:id', (req, res) => {
     const db = new sqlite3.Database(dbpath)
     const id = req.params.id

     db.get(`SELECT * FROM users WHERE id = ${id}`, (error, row) =>{

          if(!row){
               res.status(404).send({error: "Not Found"})

          } else {
               res.status(200).json(row)
          }
      
     })
     db.close()
})

//検索
app.get('/api/v1/search', (req, res) => {
     const db = new sqlite3.Database(dbpath)
     const keyword = req.query.q

     db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (error, rows) =>{
          res.json(rows)
     })
     db.close()
})


const run = async (sql, db) => {
     return new Promise ((resolve, reject) => {
          db.run(sql, (err) => {
               if(err){
                   
                    return reject(err)
               } else {
                    
                    return resolve()
               }
          })

     })

}

app.post('/api/v1/users', async (req, res) => {
     if(!req.body.name){
    res.status(400).send({error: "ユーザー名が指定されていません"})
     } else {
     const db = new sqlite3.Database(dbpath)

     const name = req.body.name
     const profile = req.body.profile ? req.body.profile : ""
     const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : ""

 try {
      await run(`INSERT INTO users (name, profile, date_of_birth) VALUES("${name}", "${profile}", "${dateOfBirth}")`,
      db
      )
      res.status(201).send({message: "新規ユーザーを作成しました"})
 } catch (e) {
      res.status(500).send({error: e})
 }

       db.close()
     }

})



app.put('/api/v1/users/:id', async (req, res) => {

     if(!req.body.name){
          res.status(400).send({error: "ユーザー名が指定されていません"})
           } else {

     const db = new sqlite3.Database(dbpath)
     const id = req.params.id

     //現在のユーザ情報を取得
     db.get(`SELECT * FROM users WHERE id=${id}`, async (error, row) =>{

          if(!row){
               res.status(404).send({error: "指定されたユーザーが見つかりません"})
          } else {
      
          const name = req.body.name ? req.body.name : row.name
          const profile = req.body.profile ? req.body.profile : row.profile
          const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
          
          try {
               await run(`UPDATE users SET name = "${name}", profile = "${profile}", date_of_birth = "${dateOfBirth}" WHERE id=${id}`,
               db
               )
               res.status(200).send({message: "新規ユーザーを更新しました"})
          } catch (e) {
               res.status(500).send({error: e})
          }
        }
     })


     db.close()
    }
})


app.delete('/api/v1/users/:id', async (req, res) => {
     const db = new sqlite3.Database(dbpath)
     const id = req.params.id

     db.get(`SELECT * FROM users WHERE id=${id}`, async (error, row) =>{

          if(!row){
               res.status(404).send({error: "指定されたユーザーが見つかりません"})
          } else {
          try {
               await run(`DELETE FROM users WHERE id=${id}`,
               db
               )
               res.status(200).send({message: "ユーザーを削除しました"})
             } catch (e) {
               res.status(500).send({error: e})
              }

          }
     })
          
  


     db.close()
})


const port = process.env.port || 3000;
app.listen(port)

console.log(port)


