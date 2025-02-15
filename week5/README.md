# week5
學習建立MySQL Server、練習使用SQL語法

## Task2
- 建立資料庫並命名為website
  ~~~mysql
  CREATE DATABASE website;
  ~~~
  ※因當初忘記截圖，此為完成其他Task後重新截圖的
  ![建立資料庫](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK2_1_%E5%BB%BA%E7%AB%8B%E8%B3%87%E6%96%99%E5%BA%ABwebsite.png)
  

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
  ![建立資料表_member_1](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK2_2_%E9%A1%AF%E7%A4%BA%E8%B3%87%E6%96%99%E8%A1%A8%E4%B8%AD%E6%89%80%E6%9C%89%E8%B3%87%E6%96%99.png)
  ![建立資料表_member_2](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK2_2_%E9%A1%AF%E7%A4%BA%E8%B3%87%E6%96%99%E8%A1%A8%E4%B8%AD%E5%90%84%E6%AC%84%E4%BD%8D%E7%9A%84%E8%A8%AD%E5%AE%9A%E5%80%BC.png)

## Task3
- 建立新的row並設定name,usernamepassword為'test'，並另外新增四筆資料
  ~~~mysql
  INSERT INTO member(id,name,username,password)
  VALUES(1,'test','test','test');
  ~~~
  ※加入的資料在Task2的截圖中

- 呈現資料表member中的所有row
  ~~~mysql
  SELECT * FROM member;
  ~~~
  ![加入資料_1](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_1%262_%E6%96%B0%E5%A2%9E%26%E6%9F%A5%E7%9C%8B%E8%B3%87%E6%96%99.png)
  ※因為後續計算需求，為了能檢視是否成功計算，更動初始加入資料為下圖
  ![加入資料_2](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_1%262_%E6%96%B0%E5%A2%9E%26%E6%9F%A5%E7%9C%8B%E8%B3%87%E6%96%99(%E6%9B%B4%E5%8B%95%E5%BE%8C).png)

- 以時間由近到遠排序，呈現資料表member中的所有row
  ~~~mysql
  SELECT * FROM member
  ORDER BY time DESC; 
  ~~~
  ![依時間排序資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_3_%E8%B3%87%E6%96%99%E4%BB%A5%E6%96%B0%E5%A2%9E%E6%99%82%E9%96%93%E7%82%BA%E6%9C%80%E6%96%B0%E6%8E%92%E5%88%97.png)

- 以由近到遠的排序方式，呈現資料表member中第二到第四筆資料
  ~~~mysql
  SELECT * FROM member
  ORDER BY time DESC
  LIMIT 3 OFFSET 1;
  ~~~
  ![依時間排序資料並取二到四筆](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_4_%E6%99%82%E9%96%93%E6%8E%92%E5%88%97%E9%81%B8%E5%8F%96%E7%AC%AC2%7E4.png)

- 篩選資料表member中username='test'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE username='test';
  ~~~
  ![取username為test的資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_5_username%E7%AD%89%E6%96%BCtest.png)

- 篩選資料表member中name包含'es'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE name LIKE '%es%';
  ~~~
  ![取name包含es的資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_6_name%E5%8C%85%E5%90%ABes.png)

- 篩選資料表member中username跟password都等於'test'的資料
  ~~~mysql
  SELECT * FROM member
  WHERE username='test' and password='test';
  ~~~
  ![取username跟password皆為test的資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_7_username%E5%8F%8Apassword%E7%AD%89%E6%96%BCtest.png)
  
- 更新資料表member中name等於'test'的資料，使該筆資料變更成name為'test2'
  ~~~mysql
  UPDATE member SET name='test2'
  WHERE name='test';
  ~~~
  ![變更name的資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK3_8_%E6%9B%B4%E6%96%B0name%E7%82%BAtest%E7%9A%84%E7%82%BAtest2.png)

## Task4

- 計算資料表member有幾個row
  ~~~mysql
  SELECT COUNT(*) FROM member;
  ~~~
  ![計算有幾行](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK4_1_%E5%8F%96%E5%BE%97%E5%88%97%E6%95%B8.png)

- 計算資料表member中，所有follower_count的加總
  ~~~mysql
  SELECT SUM(follower_count) FROM member;
  ~~~
  ![加總follower_count](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK4_2_%E5%8A%A0%E7%B8%BD%E8%BF%BD%E8%B9%A4%E8%80%85%E6%95%B8.png)

- 計算資料表member中，所有follower_count的平均
  ~~~mysql
  SELECT AVG(follower_count) FROM member;
  ~~~
  ![平均follower_count](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK4_3_%E5%B9%B3%E5%9D%87%E8%BF%BD%E8%B9%A4%E8%80%85%E6%95%B8.png)
  
- 在資料表member中依照由大到小的順序排序follower_count，並選取前兩筆資料，取得follower_count的平均數
  ~~~mysql
  SELECT AVG(follower_count) FROM (SELECT follower_count From member
  Order by follower_count DESC LIMIT 2) AS first2sum;
  ~~~
  ![篩選出前兩筆並平均follower_count](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK4_4_%E5%B9%B3%E5%9D%87%E5%89%8D%E5%85%A9%E5%A4%9A%E7%9A%84%E8%BF%BD%E8%B9%A4%E8%80%85%E6%95%B8.png)

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
  ![建立資料表_message_1](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_1_%E6%96%B0%E5%A2%9Emessage%E8%B3%87%E6%96%99%E8%A1%A8.png)
  ![建立資料表_message_2](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_1_%E6%96%B0%E5%A2%9Emessage%E8%B3%87%E6%96%99%E8%A1%A8(2).png)
  ※下圖為資料表message中加入的所有資料
  ![建立資料表_message_加入資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_1_%E6%96%B0%E5%A2%9Emessage%E8%B3%87%E6%96%99%E8%A1%A8_%E5%8A%A0%E5%85%A5%E8%B3%87%E6%96%99.png)

- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name
  ~~~mysql
  SELECT * FROM message INNER JOIN member ON message.member_id=member.id;
  ~~~
  ![關聯member與message](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_2_message%20join%20member%E8%B3%87%E6%96%99%E8%A1%A8.png)
  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中篩選傳送者的username等於'test'的資料
  ~~~mysql
  SELECT * FROM message INNER JOIN member ON message.member_id=member.id
  WHERE username='test';
  ~~~
  ![關聯member與message並篩選指定username的資料](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_3_message%26member%E7%AF%A9%E9%81%B8username%E7%82%BAtest.png)
  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中篩選傳送者的username等於'test'的資料並取得like_count的平均數
  ~~~mysql
  SELECT AVG(like_count) FROM message INNER JOIN member ON message.member_id=member.id
  WHERE username='test';
  ~~~
  ※因當初漏截圖，下圖為重新補截圖的資料
  ![關聯member跟message並平均指定username的like_count](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_4_message%26member%E7%AF%A9%E9%81%B8username%E7%82%BAtest%E4%B8%A6%E5%B9%B3%E5%9D%87like%E6%95%B8%E9%87%8F.png)

  
- 使用JOIN關連member及message，呈現所有資料表message的資料並包含傳送者的name，從中依傳送者的username分別計算like_count的平均數
  ~~~mysql
  SELECT AVG(like_count) FROM message INNER JOIN member ON message.member_id=member.id
  GROUP BY username;
  ~~~
    ![關聯member與message並平均指定username的like_count](https://raw.githubusercontent.com/YU-20-10/WeHelp-1st/refs/heads/main/week5/img/week5_TASK5_5_message%26member%E4%BB%A5username%E5%88%86%E5%88%A5%E5%B9%B3%E5%9D%87like%E6%95%B8%E9%87%8F.png)









