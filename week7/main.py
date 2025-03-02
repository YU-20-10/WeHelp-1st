from fastapi import FastAPI, Request, Header
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
from typing import Annotated
import mysql.connector
import uuid


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(SessionMiddleware, secret_key=uuid.uuid4(), path="/")


def database():
    return mysql.connector.connect(
        host="127.0.0.1", user="root", passwd="*", database="website"
    )


class SignupFormData(BaseModel):
    signupName: str
    signupUsername: str
    signupPassword: str


class SigninFormData(BaseModel):
    signinUsername: str
    signinPassword: str


class MemberMessageForm(BaseModel):
    memberMessage:str

class EditNameFormData(BaseModel):
    name: str

class DelMessageId(BaseModel):
    id:int

@app.get("/", response_class=JSONResponse)
async def index(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html", context={"test": "1234"}
    )


@app.get("/error")
async def error(request: Request, message: str):
    return templates.TemplateResponse(
        request=request, name="error.html", context={"message": message}
    )


@app.get("/member", response_class=JSONResponse)
async def member(request: Request):
    name = request.session.get("name", None)
    username = request.session.get("username",None)
    if name is None:
        return RedirectResponse(
            url="/?alertMessage=尚未登入或是驗證已過期，請重新登入", status_code=307
        )
    memberPageData = []
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor(dictionary=True)
    databaseConnectCursor.execute(
        "SELECT message.id,message.member_id,member.name,member.username,message.content FROM message INNER JOIN member ON message.member_id=member.id"
    )
    rowData = databaseConnectCursor.fetchall()
    for item in rowData:
        memberPageData.append(item)
    databaseConnectCursor.close()
    databaseConnect.close()
    return templates.TemplateResponse(
        request=request,
        name="member.html",
        context={"name": name, "username":username ,"memberPageData": memberPageData},
    )


@app.post("/signup", response_class=JSONResponse)
async def signup(signupFormData: SignupFormData):
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor()
    databaseConnectCursor.execute(
        "SELECT member.username FROM member WHERE username=%s",
        [signupFormData.signupUsername],
    )
    checkUsernameExist = databaseConnectCursor.fetchone()
    if checkUsernameExist is None:
        databaseConnectCursor.execute(
            "INSERT INTO member(name,username,password) VALUES(%s,%s,%s)",
            [
                signupFormData.signupName,
                signupFormData.signupUsername,
                signupFormData.signupPassword,
            ],
        )
        databaseConnect.commit()
        databaseConnectCursor.close()
        databaseConnect.close()
        return JSONResponse(
            content={"redirect": "/", "alertMessage": "帳號已成功註冊"}, status_code=201
        )
    else:
        databaseConnectCursor.close()
        databaseConnect.close()
        return JSONResponse(
            content={"redirect": "/error?message=帳號已被註冊"}, status_code=409
        )


@app.post("/signin", response_class=JSONResponse)
async def signin(request: Request, signinFormData: SigninFormData):
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor(dictionary=True)
    databaseConnectCursor.execute(
        "SELECT member.id,member.username,member.name FROM member WHERE username=%s and password=%s",
        [signinFormData.signinUsername, signinFormData.signinPassword],
    )
    userData = databaseConnectCursor.fetchone()
    if userData is not None:
        request.session.update(
            {
                "id": userData["id"],
                "username": userData["username"],
                "name": userData["name"],
            }
        )
        return JSONResponse(content={"redirect": "/member"}, status_code=200)
    else:
        return JSONResponse(
            content={"redirect": "/error?message=帳號或是密碼輸入錯誤"}, status_code=401
        )


@app.get("/signout", response_class=JSONResponse)
async def signout(request: Request):
    request.session.clear()
    return JSONResponse(content={"redirect": "/", "alertMessage": "已登出"})

@app.post("/createMessage",response_class=JSONResponse)
async def createMessage(request:Request,memberMessageForm:MemberMessageForm):
    member_id=request.session.get("id",None)
    if member_id is None:
        return RedirectResponse(
            url="/?alertMessage=尚未登入或是驗證已過期，請重新登入", status_code=307
        )
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor()
    databaseConnectCursor.execute("INSERT INTO message(member_id,content) VALUES(%s,%s)",[member_id,memberMessageForm.memberMessage])
    databaseConnect.commit()
    databaseConnectCursor.close()
    databaseConnect.close()
    return JSONResponse(content={"redirect":"/member","alertMessage":"留言已送出"})

@app.post("/deleteMessage")
async def delMessage(delMessageId:DelMessageId):
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor()
    databaseConnectCursor.execute("DELETE FROM message WHERE id=%s",[delMessageId.id])
    databaseConnect.commit()
    databaseConnectCursor.close()
    databaseConnect.close()
    return JSONResponse(content={"redirect":"/member","alertMessage":"留言已刪除"})

@app.get("/api/member", response_class=JSONResponse)
async def memberSearch(request: Request, username: str):
    name = request.session.get("name", None)
    if name is None:
        return {"data": None}
    databaseConnect = database()
    databaseConnectCursor = databaseConnect.cursor(dictionary=True)
    databaseConnectCursor.execute(
        "SELECT member.id,member.name,member.username FROM member WHERE username=%s",
        [username],
    )
    memberNameExist = databaseConnectCursor.fetchone()
    if memberNameExist is not None:
        data = memberNameExist
    else:
        data = None
    databaseConnectCursor.close()
    databaseConnect.close()
    return {"data": data}


@app.patch("/api/member", response_class=JSONResponse)
async def editMemberData(
    request: Request,
    editNameFormData: EditNameFormData,
    content_type: Annotated[str | None, Header()] = None,
):
    name = request.session.get("name", None)
    username = request.session.get("username",None)
    formDataName = editNameFormData.name
    responseData = {}
    if content_type == "application/json" and name is not None and username is not None and formDataName != name:
        databaseConnect = database()
        databaseConnectCursor = databaseConnect.cursor(dictionary=True)
        # 更新資料庫的name
        databaseConnectCursor.execute(
            "UPDATE member SET name=%s WHERE username=%s", [formDataName, username]
        )
        databaseConnect.commit()
        # 更新session
        request.session["name"] = formDataName
        databaseConnectCursor.close()
        databaseConnect.close()
        responseData = {"ok": True}
    else:
        responseData = {"error": True}
    return responseData
