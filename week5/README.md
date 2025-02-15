# week5
學習建立MySQL Server、練習使用SQL語法

## Task2
- 建立資料庫並命名為website
  ~~~mysql
  CREATE DATABASE website;
  ~~~

- 在資料庫website中建立資料表並命名為member，並設定成指定的資料型態
  ~~~mysql
  CREATE TABLE member(
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      follower_count INT UNSIGNED NOT NULL DEFAULT 0,
      time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  ~~~

## Task3
- 建立新的row並設定name,usernamepassword為'test'，並另外新增四筆資料
  ~~~mysql
  INSERT INTO member(id,name,username,password)
  VALUES(1,'test','test','test');
  ~~~

- 呈現資料表member中的所有row
  ~~~mysql
  SELECT * FROM member;
  ~~~

- 以時間由近到遠排序，呈現資料表member中的所有row
  ~~~mysql
  SELECT * FROM member
  ORDER BY time DESC; 
  ~~~

- 以由近到遠的排序方式，呈現資料表member中第二到第四筆資料
  ~~~mysql
  SELECT * FROM member
  ORDER BY time DESC
  LIMIT 3 OFFSET 1;
  ~~~

- 篩選資料表member中username='test'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE username='test';
  ~~~

- 篩選資料表member中name包含'es'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE name LIKE '%es%';
  ~~~

- 篩選資料表member中username跟password都等於'test'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE username='test' and password='test';
  ~~~
  
- 更新資料表member中name等於'test'的資料，使該筆資料變更成name為'test2'
  ~~~mysql
  UPDATE member SET name='test2'
  WHERE name='test';
  ~~~

## Task4

- 計算資料表member有幾個row
  ~~~mysql
  SELECT COUNT(*) FROM member;
  ~~~

- 計算資料表member中，所有follower_count的加總
  ~~~mysql
  SELECT SUM(follower_count) FROM member;
  ~~~

- 計算資料表member中，所有follower_count的平均
  ~~~mysql
  SELECT AVG(follower_count) FROM member;
  ~~~
  
- 在資料表member中依照由大到小的順序排序follower_count，並選取前兩筆資料，取得follower_count的平均數
  ~~~mysql
  SELECT AVG(follower_count) FROM (SELECT follower_count From member
  Order by follower_count DESC LIMIT 2) AS first2sum;
  ~~~

## Task5
- 在資料庫website中建立資料表message，並設定成指定的資料型態
  ~~~mysql
  CREATE TABLE message(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    content VARCHAR(255) NOT NULL,
    like_count INT UNSIGNED NOT NULL DEFAULT 0,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(member_id)
	  REFERENCES member(id)
  );
  ~~~

- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name
  ~~~mysql
  SELECT * FROM message INNER JOIN member ON message.member_id=member.id;
  ~~~
  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中篩選傳送者的username等於'test'的資料
  ~~~mysql
  SELECT * FROM message INNER JOIN member ON message.member_id=member.id
  WHERE username='test';
  ~~~
  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中篩選傳送者的username等於'test'的資料並取得like_count的平均數
  ~~~mysql
  SELECT AVG(like_count) FROM message INNER JOIN member ON message.member_id=member.id
  WHERE username='test';
  ~~~
  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中依傳送者的username分別計算like_count的平均數
  ~~~mysql
  SELECT AVG(like_count) FROM message INNER JOIN member ON message.member_id=member.id
  GROUP BY username;
  ~~~









