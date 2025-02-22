from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
import mysql.connector
import uuid

class SignupFormData(BaseModel):
    signupName: str
    signupUsername: str
    signupPassword: str


class SigninFormData(BaseModel):
    signinUsername: str
    signinPassword: str


class ContentFormData(BaseModel):
    content: str


class DeleteMessage(BaseModel):
    id: int

# 以下密碼用*取代
def connentMyDatabase():
    return mysql.connector.connect(host="127.0.0.1", user="root", password="*")


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(SessionMiddleware, secret_key=uuid.uuid4(), path="/")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=JSONResponse)
async def index(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.get("/member", response_class=JSONResponse)
async def member(request: Request):
    name = request.session.get("name", None)
    messageData = []
    if name is not None:
        myDatabase = connentMyDatabase()
        myDataBaseCursor = myDatabase.cursor(dictionary=True)
        myDataBaseCursor.execute("USE website")
        # 避免合併查詢時，message欄位id與member欄位id重疊，指定篩選只包含message.id
        myDataBaseCursor.execute(
            "SELECT message.id, message.member_id, message.content, member.name, member.username FROM message INNER JOIN member ON message.member_id=member.id"
        )
        rowData = myDataBaseCursor.fetchall()
        for item in rowData:
            messageData.append(item)
        myDataBaseCursor.close()
        myDatabase.close()
        return templates.TemplateResponse(
            request=request,
            name="member.html",
            context={"name": name, "messageData": messageData},
        )
    elif name is None:
        return RedirectResponse(
            url="/?alertMessage=尚未登入或是驗證已過期需重新登入", status_code=307
        )


@app.get("/error", response_class=JSONResponse)
async def error(request: Request, message: str):
    return templates.TemplateResponse(
        request=request, name="error.html", context={"message": message}
    )


@app.post("/signup", response_class=JSONResponse)
async def signup(signupFormData: SignupFormData):
    myDatabase = connentMyDatabase()
    myDatabaseCursor = myDatabase.cursor(dictionary=True)
    myDatabaseCursor.execute("USE website")
    myDatabaseCursor.execute(
        "SELECT * FROM member WHERE username = %s", [signupFormData.signupUsername]
    )
    # 顯示查詢結果當中比對到的第一筆資料
    checkUsernameExist = myDatabaseCursor.fetchone()
    # 為確保後續執行不會出錯，查詢後顯示所有比對到的資料，再往下
    if checkUsernameExist is not None:
        myDatabaseCursor.fetchall()
    if checkUsernameExist is None:
        myDatabaseCursor.execute(
            "INSERT INTO member(name,username,password) VALUE (%s,%s,%s)",
            [
                signupFormData.signupName,
                signupFormData.signupUsername,
                signupFormData.signupPassword,
            ],
        )
        # 確保資料提交不會有執行到一半需要執行其他指令而跳錯
        # 使用完畢後關閉cursor及資料庫連接
        myDatabaseCursor.close()
        myDatabase.close()
        return JSONResponse(
            content={
                "redirect": "/",
                "message": "您已成功註冊，請使用帳號密碼登入會員頁面",
            },
            status_code=302,
        )
    else:
        # 使用完畢後關閉cursor及資料庫連接
        myDatabaseCursor.close()
        myDatabase.close()
        return JSONResponse(
            content={"redirect": "/error?message=帳號已被註冊"}, status_code=302
        )


@app.post("/signin", response_class=JSONResponse)
async def signin(request: Request, signinFormData: SigninFormData):
    myDatabase = connentMyDatabase()
    myDatabaseCursor = myDatabase.cursor(dictionary=True)
    myDatabaseCursor.execute("USE website")
    myDatabaseCursor.execute(
        "SELECT * FROM member WHERE username=%s and password= %s",
        [signinFormData.signinUsername, signinFormData.signinPassword],
    )
    checkUsername = myDatabaseCursor.fetchone()
    if checkUsername is not None:
        myDatabaseCursor.fetchall()
        request.session.update(
            {
                "id": checkUsername["id"],
                "name": checkUsername["name"],
                "username": checkUsername["username"],
            }
        )
        myDatabaseCursor.close()
        myDatabase.close()
        return JSONResponse(content={"redirect": "/member"}, status_code=200)
    else:
        myDatabaseCursor.execute(
            "SELECT * FROM member WHERE username=%s", [signinFormData.signinUsername]
        )
        checkUsernameExist = myDatabaseCursor.fetchone()
        if checkUsernameExist is not None:
            myDatabaseCursor.fetchall()
            myDatabaseCursor.close()
            myDatabase.close()
            return JSONResponse(
                content={"redirect": "/error?message=帳號或是密碼不正確"},
                status_code=302,
            )
        else:
            myDatabaseCursor.close()
            myDatabase.close()
            return JSONResponse(
                content={"redirect": "/error?message=該帳號尚未被註冊，請註冊後再登入"},
                status_code=302,
            )


@app.get("/signout", response_class=JSONResponse)
async def signout(request: Request):
    request.session.clear()
    return JSONResponse(
        content={"redirect": "/?alertMessage=已成功登出"}, status_code=302
    )


@app.post("/createMessage", response_class=JSONResponse)
async def createMessage(request: Request, contentFormData: ContentFormData):
    id = request.session.get("id", None)
    username = request.session.get("username", None)
    content = contentFormData.content
    print(id, content)
    if id is not None and username is not None:
        myDataBase = connentMyDatabase()
        myDataBaseCunsor = myDataBase.cursor(dictionary=True)
        myDataBaseCunsor.execute("USE website")
        myDataBaseCunsor.execute(
            "INSERT INTO message(member_id,content) VALUES(%s,%s)", [id, content]
        )
        myDataBase.commit()
        myDataBaseCunsor.close()
        myDataBase.close()
        return JSONResponse(content={"redirect": "/member", "message": "留言已送出"})
    elif username is None:
        return RedirectResponse(
            url="/?alertMessage=尚未登入或是驗證已過期需重新登入", status_code=307
        )


@app.post("/deleteMessage", response_class=JSONResponse)
async def deleteMessage(deleteMessage: DeleteMessage):
    myDatabase = connentMyDatabase()
    myDatabaseCunsor = myDatabase.cursor()
    myDatabaseCunsor.execute("USE website")
    myDatabaseCunsor.execute("DELETE FROM message WHERE id=%s", [deleteMessage.id])
    myDatabase.commit()
    myDatabaseCunsor.close()
    myDatabase.close()
    return JSONResponse(content={"redirect": "/member", "message": "留言已刪除"})
