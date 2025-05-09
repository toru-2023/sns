const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// アップロードされたファイルの保存先設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// MySQLデータベース接続
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abb0618abb",
  database: "Twitter",
});

// POSTデータの解析
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// アカウント作成完了後のリダイレクト先
app.post("/rcreate_account", upload.fields([{ name: "profile_image" }, { name: "avatar_image" }]), (req, res) => {
  const { username, email, password, display_name, bio } = req.body;
  const profileImagePath = req.files["profile_image"] ? req.files["profile_image"][0].path : null;
  const avatarImagePath = req.files["avatar_image"] ? req.files["avatar_image"][0].path : null;

  const sql = `
    INSERT INTO users (username, email, password, display_name, bio, profile_image, avatar_image, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.execute(
    sql,
    [username, email, password, display_name, bio, profileImagePath, avatarImagePath],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("データベースエラー");
      }
      res.redirect("/timeline.html"); // アカウント作成成功後にタイムラインへ
    }
  );
});



// タイムライン画面にリダイレクトするエンドポイント
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.execute(sql, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("データベースエラー");
    }

    if (results.length > 0) {
      res.redirect("/timeline.html"); // ログイン成功後にタイムラインへ
    } else {
      res.status(401).send("ユーザー名またはパスワードが間違っています");
    }
  });
});

app.use(express.static(path.join(__dirname, "views")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// サーバー起動
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
