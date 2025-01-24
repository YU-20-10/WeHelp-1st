import urllib.request as request
import json


remoteDataUrl1 = (
    "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1"
)
remoteDataUrl2 = (
    "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2"
)

with request.urlopen(remoteDataUrl1) as res1:
    getRemoteData1 = json.load(res1)
remoteData1 = getRemoteData1["data"]["results"]
with request.urlopen(remoteDataUrl2) as res2:
    getRemoteData2 = json.load(res2)
remoteData2 = getRemoteData2["data"]

with open("spot.csv", "w", encoding="utf-8") as spotFile:
    for data in remoteData1:
        district = ""
        spiltImgUrl = ""
        # 分離資料網址並取第一筆
        spiltWord = "https"
        for img in data["filelist"]:
            spiltImgUrl = [
                spiltWord + imgUrl
                for imgUrl in data["filelist"].split("https")
                if imgUrl
            ][0]
        # 比對資料一與資料二，取出地區名稱
        for i in range(len(remoteData2)):
            if remoteData2[i]["SERIAL_NO"] == data["SERIAL_NO"]:
                district = remoteData2[i]["address"][5:8]
        writeData = "".join(
            (
                str(data["stitle"]),
                ",",
                str(district),
                ",",
                str(data["longitude"]),
                ",",
                str(data["latitude"]),
                ",",
                str(spiltImgUrl),
            )
        )
        spotFile.write(writeData + "\n")


