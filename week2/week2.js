function findAndPrint(messages, currentStation) {
  const stationName = [
    "Xindian",
    "Xindian City Hall",
    "Qizhang",
    "Dapinglin",
    "Jingmei",
    "Wanlong",
    "Gongguan",
    "Taipower Building",
    "Guting",
    "Chiang Kai-Shek Memorial Hall",
    "Xiaonanmen",
    "Ximen",
    "Beimen",
    "Zhongshan",
    "Songjiang Nanjing",
    "Nanjing Fuxing",
    "Taipei Arena",
    "Nanjing Sanmin",
    "Songshan",
  ];
  let data = {};
  // 過濾原始資料，僅存放index
  Object.entries(messages).forEach(([key, value]) => {
    stationName.forEach((e) => {
      let thisStationNameInclude = value.includes(e);

      if (thisStationNameInclude) {
        let index = stationName.indexOf(e);
        data[key] = index;
      } else if (!thisStationNameInclude && value.includes("Xiaobitan")) {
        data[key] = 2.1;
      }
    });
  });

  // 初始化現在車站的值
  let currentStationIndex = 0;
  if (
    stationName.indexOf(currentStation) === -1 &&
    currentStation === "Xiaobitan"
  ) {
    currentStationIndex = "sp";
  } else {
    currentStationIndex = stationName.indexOf(currentStation);
  }

  // nearestFriend 及 nearest 及 nearestValue初始化
  // nearestFriend存放的最近的朋友是誰
  // nearest為存放最近的朋友的車站的index
  // nearestValue為現在車站-最近的朋友車站的最小差值
  let nearestFriend = Object.keys(data)[0];
  let nearest = 0;
  let nearestValue = 0;
  if (data[Object.keys(data)[0]] === 2.1 && currentStationIndex !== "sp") {
    nearest = "sp";
    nearestValue =
      Math.abs(currentStationIndex - stationName.indexOf("Qizhang")) + 1;
  } else if (
    data[Object.keys(data)[0]] !== 2.1 &&
    currentStationIndex === "sp"
  ) {
    nearest = data[Object.keys(data)[0]];
    nearestValue =
      Math.abs(stationName.indexOf("Qizhang") - data[Object.keys(data)[0]]) + 1;
  } else if (
    data[Object.keys(data)[0]] === 2.1 &&
    currentStationIndex === "sp"
  ) {
    nearest = "sp";
    nearestValue = 0;
  } else {
    nearest = data[Object.keys(data)[0]];
    nearestValue = Math.abs(currentStationIndex - data[Object.keys(data)[0]]);
  }

  // 兩個車站的index相減取最小值
  for (let i = 0; i < Object.keys(data).length; i++) {
    let friendStationIndex = 0;
    let friend = Object.keys(data)[i];
    if (data[Object.keys(data)[i]] === 2.1) {
      friendStationIndex = "sp";
    } else {
      friendStationIndex = data[Object.keys(data)[i]];
    }
    // 初始化差值
    let diffBetween = 0;

    // 計算現在所在車站及朋友的車站之間的差值
    if (currentStationIndex === "sp" && friendStationIndex !== "sp") {
      diffBetween =
        Math.abs(stationName.indexOf("Qizhang") - friendStationIndex) + 1;
    } else if (currentStationIndex !== "sp" && friendStationIndex === "sp") {
      diffBetween =
        Math.abs(currentStationIndex - stationName.indexOf("Qizhang")) + 1;
    } else if (currentStationIndex === "sp" && friendStationIndex === "sp") {
      diffBetween = 0;
    } else {
      diffBetween = Math.abs(currentStationIndex - friendStationIndex);
    }
    if (diffBetween <= nearestValue) {
      nearest = friendStationIndex;
      nearestValue = diffBetween;
      nearestFriend = friend;
    }
  }

  return console.log(nearestFriend);
}

const messages = {
  Bob: "I'm at Ximen MRT station.",
  Mary: "I have a drink near Jingmei MRT station.",
  Copper: "I just saw a concert at Taipei Arena.",
  Leslie: "I'm at home near Xiaobitan station.",
  Vivian: "I'm at Xindian station waiting for you.",
};

console.log("---task1---");
findAndPrint(messages, "Wanlong"); //print Mary
findAndPrint(messages, "Songshan"); //print Copper
findAndPrint(messages, "Qizhang"); //print Leslie
findAndPrint(messages, "Ximen"); //print Bob
findAndPrint(messages, "Xindian City Hall"); //print Vivian
findAndPrint(messages, "Xiaobitan"); //Leslie
findAndPrint(messages, "Dapinglin"); //Mary

function book(consultants, hour, duration, criteria) {
  //初始化consultants[i].hour
  consultants.forEach((e) => {
    if (e.hour === undefined) {
      e.hour = [];
    }
  });

  //展開需要申請的時間陣列
  let needTime = [];
  for (let i = 0; i < duration; i++) {
    needTime.push(hour + i);
  }

  let newConsultants = [...consultants];
  let bookConsultant = "";
  if (criteria === "price") {
    //依價格排序後，再以值找原先陣列的index
    let sortByPrice = newConsultants.sort((a, b) => {
      return a.price - b.price;
    });
    let consultantsPriceSortArr = [];
    sortByPrice.forEach((item) => {
      for (let i = 0; i < consultants.length; i++) {
        if (item === consultants[i]) {
          consultantsPriceSortArr.push(i);
        }
      }
    });

    for (
      let dataIndex = 0;
      dataIndex < consultantsPriceSortArr.length;
      dataIndex++
    ) {
      let checkTimeAvailable = true;
      //確認是否所有想預約時段可被預約
      for (let index = 0; index < needTime.length; index++) {
        if (
          consultants[consultantsPriceSortArr[dataIndex]].hour.indexOf(
            needTime[index]
          ) === -1
        ) {
          checkTimeAvailable = true;
          continue;
        } else {
          checkTimeAvailable = false;
          break;
        }
      }

      if (checkTimeAvailable) {
        //將所有預約時間加入原始資料
        for (let index = 0; index < needTime.length; index++) {
          consultants[consultantsPriceSortArr[dataIndex]].hour.push(
            needTime[index]
          );
        }
        //取得預約到的諮商師
        bookConsultant = consultants[consultantsPriceSortArr[dataIndex]].name;
        break;
      }
    }
    if (bookConsultant.length === 0) {
      bookConsultant = "No Service";
    }
  } else if (criteria === "rate") {
    //依評價排序後，再以值找原先陣列的index
    let sortByRate = newConsultants.sort((a, b) => {
      return b.rate - a.rate;
    });

    let consultantsRateSortArr = [];
    sortByRate.forEach((item) => {
      for (let i = 0; i < consultants.length; i++) {
        if (item === consultants[i]) {
          consultantsRateSortArr.push(i);
        }
      }
    });

    for (
      let dataIndex = 0;
      dataIndex < consultantsRateSortArr.length;
      dataIndex++
    ) {
      let checkTimeAvailable = true;
      //確認是否所有想預約時段可被預約
      for (let index = 0; index < needTime.length; index++) {
        if (
          consultants[consultantsRateSortArr[dataIndex]].hour.indexOf(
            needTime[index]
          ) === -1
        ) {
          checkTimeAvailable = true;
          continue;
        } else {
          checkTimeAvailable = false;
          break;
        }
      }

      if (checkTimeAvailable) {
        for (let index = 0; index < needTime.length; index++) {
          consultants[consultantsRateSortArr[dataIndex]].hour.push(
            needTime[index]
          );
        }
        bookConsultant = consultants[consultantsRateSortArr[dataIndex]].name;
        break;
      }
    }
    if (bookConsultant.length === 0) {
      bookConsultant = "No Service";
    }
  }

  return console.log(bookConsultant);
}

const consultants = [
  { name: "John", rate: 4.5, price: 1000 },
  { name: "Bob", rate: 3, price: 1200 },
  { name: "Jenny", rate: 3.8, price: 800 },
];

console.log("---task2---");
book(consultants, 15, 1, "price"); // Jenny
book(consultants, 11, 2, "price"); // Jenny
book(consultants, 10, 2, "price"); // John
book(consultants, 20, 2, "rate"); // John
book(consultants, 11, 1, "rate"); // Bob
book(consultants, 11, 2, "rate"); // No Service
book(consultants, 14, 3, "price"); // John

function func(...data) {
  // 找出各個名字的middle name
  let middleNameArr = [];
  [...data].forEach((item) => {
    let middleNameSpilt = item.split("");
    switch (item.length) {
      case 2:
        middleNameArr.push(middleNameSpilt[1]);
        break;
      case 3:
        middleNameArr.push(middleNameSpilt[1]);
        break;
      case 4:
        middleNameArr.push(middleNameSpilt[2]);
        break;
      case 5:
        middleNameArr.push(middleNameSpilt[2]);
        break;
      default:
        break;
    }
  });

  // 篩選出陣列中的重複值
  let newMiddleNameArr = [...middleNameArr];
  let repeatValue = newMiddleNameArr.filter(
    (item, index) => newMiddleNameArr.indexOf(item) !== index
  );

  // 剔除陣列中的重複值
  repeatValue.forEach((item) => {
    while (newMiddleNameArr.indexOf(item) !== -1) {
      let index = newMiddleNameArr.indexOf(item);
      newMiddleNameArr.splice(index, 1);
    }
  });

  if (newMiddleNameArr.length === 1) {
    index = middleNameArr.indexOf(newMiddleNameArr[0]);
    return console.log([...data][index]);
  } else {
    return console.log("沒有");
  }
}

console.log("---task3---");
func("彭大牆", "陳王明雅", "吳明"); // print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花"); // print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花"); // print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆"); // print 夏曼藍波安

function getNumber(index) {
  let value = 0;
  if (index >= 0 && index <= 2) {
    switch (index % 3) {
      case 0:
        value = 0;
        break;
      case 1:
        value = 4;
        break;
      case 2:
        value = 8;
        break;
    }
  } else {
    switch (index % 3) {
      case 0:
        value = (index / 3) * 7;
        break;
      case 1:
        value = Math.floor(index / 3) * 7 + 4;
        break;
      case 2:
        value = Math.floor(index / 3) * 7 + 8;
        break;
      default:
        break;
    }
  }
  return console.log(value);
}

console.log("---task4---");
getNumber(1); // print 4
getNumber(5); // print 15
getNumber(10); // print 25
getNumber(30); // print 70
