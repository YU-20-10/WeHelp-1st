def find_and_print(messages, current_station):
    stationName = [
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
    ]

    data = {}

    # 過濾原始資料，僅存放index
    for key, value in messages.items():
        for item in stationName:
            if item in value:
                data[key] = stationName.index(item)
            elif item not in value and "Xiaobitan" in value:
                data[key] = 2.1

    # 初始化現在車站的值
    if current_station not in stationName and current_station == "Xiaobitan":
        currentStationIndex = "sp"
    else:
        currentStationIndex = stationName.index(current_station)

    # nearestFriend 及 nearest 及 nearestValue初始化
    # nearestFriend存放的最近的朋友是誰
    # nearest為存放最近的朋友的車站的index
    # nearestValue為現在車站-最近的朋友車站的最小差值
    nearestFriend = list(data.keys())[0]
    if data[list(data.keys())[0]] == 2.1 and currentStationIndex != "sp":
        nearest = "sp"
        nearestValue = abs(currentStationIndex - stationName.index("Qizhang")) + 1
    elif data[list(data.keys())[0]] != 2.1 and currentStationIndex == "sp":
        nearest = data[list(data.keys())[0]]
        nearestValue = (
            abs(stationName.index("Qizhang") - data[list(data.keys())[0]]) + 1
        )
    elif data[list(data.keys())[0]] == 2.1 and currentStationIndex == "sp":
        nearest = "sp"
        nearestValue = 0
    else:
        nearest = data[list(data.keys())[0]]
        nearestValue = abs(currentStationIndex - data[list(data.keys())[0]])

    # 逐筆friend station資訊取最小差值
    for i in range(len(data)):
        # 取當筆資料的朋友名字及朋友車站的index
        friend = list(data.keys())[i]
        if data[list(data.keys())[i]] == 2.1:
            friendStationIndex = "sp"
        else:
            friendStationIndex = data[list(data.keys())[i]]
        
        # 初始化差值
        diffBetween = 0

        # 計算現在所在車站及朋友的車站之間的差值
        if currentStationIndex == "sp" and friendStationIndex != "sp":
            diffBetween = abs(stationName.index("Qizhang") - friendStationIndex) + 1
        elif currentStationIndex != "sp" and friendStationIndex == "sp":
            diffBetween = abs(currentStationIndex - stationName.index("Qizhang")) + 1
        elif currentStationIndex == "sp" and friendStationIndex == "sp":
            diffBetween = 0
        else:
            diffBetween = abs(currentStationIndex - friendStationIndex)
    
        # 如果差值比先前最小差值還要小，更新最小差值及最近朋友的車站的index及最近朋友
        if diffBetween <= nearestValue:
            nearestValue = diffBetween
            nearest = friendStationIndex
            nearestFriend = friend
            
    print(nearestFriend)


messages = {
    "Leslie": "I'm at home near Xiaobitan station.",
    "Bob": "I'm at Ximen MRT station.",
    "Mary": "I have a drink near Jingmei MRT station.",
    "Copper": "I just saw a concert at Taipei Arena.",
    "Vivian": "I'm at Xindian station waiting for you.",
}
print("---task1---")
find_and_print(messages, "Wanlong")  # print Mary
find_and_print(messages, "Songshan")  # print Copper
find_and_print(messages, "Qizhang")  # print Leslie
find_and_print(messages, "Ximen")  # print Bob
find_and_print(messages, "Xindian City Hall")  # print Vivian
find_and_print(messages, "Xiaobitan")  # Leslie
find_and_print(messages, "Dapinglin")  # Mary


def book(consultants, hour, duration, criteria):
    # 初始化consultants["hour"]
    for item in consultants:
        if "hour" not in item:
            item["hour"] = []

    # 展開需要申請的時間陣列
    needTime = []
    for time in range(duration):
        needTime.append(hour + time)

    newConsultants = consultants.copy()
    bookConsultant = ""

    def sortPriceFn(e):
        return e["price"]

    def sortRateFn(e):
        return e["rate"]

    if criteria == "price":
        newConsultants.sort(key=sortPriceFn)
        consultantsPriceSortArr = []
        # 依價格排序後，再以值找原先陣列的index
        for newindex, item in enumerate(newConsultants):
            for index, origin in enumerate(consultants):
                if item == origin:
                    consultantsPriceSortArr.append(index)

        # 確認是否所有想預約時段可被預約
        for dataIndex, item in enumerate(consultants):
            checkTimeAvailable = True
            for time in needTime:
                if time not in consultants[consultantsPriceSortArr[dataIndex]].get(
                    "hour"
                ):
                    checkTimeAvailable = True
                    continue
                else:
                    checkTimeAvailable = False
                    break

            if checkTimeAvailable:
                # 將所有預約時間加入原始資料
                for index, time in enumerate(needTime):
                    consultants[consultantsPriceSortArr[dataIndex]]["hour"].append(time)
                bookConsultant = consultants[consultantsPriceSortArr[dataIndex]]["name"]
                break
        if len(bookConsultant) == 0:
            bookConsultant = "No Service"

        print(bookConsultant)

    elif criteria == "rate":
        newConsultants.sort(reverse=True, key=sortRateFn)
        consultantsRateSortArr = []
        for newindex, item in enumerate(newConsultants):
            for index, origin in enumerate(consultants):
                if item == origin:
                    consultantsRateSortArr.append(index)
        # 確認是否所有想預約時段可被預約
        for dataIndex, item in enumerate(consultants):
            checkTimeAvailable = True
            for time in needTime:
                if time not in consultants[consultantsRateSortArr[dataIndex]].get(
                    "hour"
                ):
                    checkTimeAvailable = True
                    continue
                else:
                    checkTimeAvailable = False
                    break

            if checkTimeAvailable:
                # 將所有預約時間加入原始資料
                for index, time in enumerate(needTime):
                    consultants[consultantsRateSortArr[dataIndex]]["hour"].append(time)
                bookConsultant = consultants[consultantsRateSortArr[dataIndex]]["name"]
                break
        if len(bookConsultant) == 0:
            bookConsultant = "No Service"

        print(bookConsultant)


consultants = [
    {"name": "John", "rate": 4.5, "price": 1000},
    {"name": "Bob", "rate": 3, "price": 1200},
    {"name": "Jenny", "rate": 3.8, "price": 800},
]

print("---task2---")
book(consultants, 15, 1, "price")  # Jenny
book(consultants, 11, 2, "price")  # Jenny
book(consultants, 10, 2, "price")  # John
book(consultants, 20, 2, "rate")  # John
book(consultants, 11, 1, "rate")  # Bob
book(consultants, 11, 2, "rate")  # No Service
book(consultants, 14, 3, "price")  # John


def func(*data):
    newDataList = [*data]

    # 找出各個名字的middle name
    stringList = []
    for item in newDataList:
        match len(item):
            case 2:
                stringList.append(item[slice(1, 2)])
            case 3:
                stringList.append(item[slice(1, 2)])
            case 4:
                stringList.append(item[slice(2, 3)])
            case 5:
                stringList.append(item[slice(2, 3)])

    # 篩選出陣列中的重複值
    newStringList = stringList.copy()
    repeatList = []
    for index, item in enumerate(newStringList):
        if newStringList.index(item) != index:
            repeatList.append(item)

    # 剔除陣列中的重複值
    for item in repeatList:
        while item in newStringList:
            newStringList.remove(item)

    if len(newStringList) == 1:
        result = newDataList[stringList.index(newStringList[0])]
        print(result)
    else:
        print("沒有")


print("---task3---")
func("彭大牆", "陳王明雅", "吳明")  # print 彭大牆
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花")  # print 林花花
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花")  # print 沒有
func("郭宣雅", "夏曼藍波安", "郭宣恆")  # print 夏曼藍波安


def get_number(index):
    # your code here
    value = 0
    if 0 <= index <= 2:
        match index % 3:
            case 0:
                value = 0
            case 1:
                value = 4
            case 2:
                value = 8
    else:
        match index % 3:
            case 0:
                value = (index // 3) * 7
            case 1:
                value = (index // 3) * 7 + 4
            case 2:
                value = (index // 3) * 7 + 8
    print(value)


print("---task4---")
get_number(1)  # print 4
get_number(5)  # print 15
get_number(10)  # print 25
get_number(30)  # print 70
